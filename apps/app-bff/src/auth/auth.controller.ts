import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  UseInterceptors,
  UploadedFile,
  Inject,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserLoginDto } from 'public/dto/user/user-login.dto';
import { UserRegisterDto } from '../../../../public/dto/user/user-register.dto';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { UpdateUserInfoDto } from '../../../../public/dto/user/update-user-info.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { generateFileUploadKey } from 'public/util';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { hash } from 'argon2';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configsService: ConfigService,
    @Inject('microserviceRoleClient')
    private readonly microserviceRoleClient: ClientProxy,
    @Inject('microserviceUserClient')
    private readonly microserviceUserClient: ClientProxy,
  ) {}
  //-----------------------------------------------------登陆注册---------------------------------------------
  //用户注册
  @Post('/register')
  async register(@Body() userRegisterDto: UserRegisterDto) {
    if (!userRegisterDto.role) {
      userRegisterDto.role = '学生';
    }
    const result = await this.authService.register(userRegisterDto);
    return result;
  }
  //用户登陆
  @Post('/login')
  async login(@Body() userLoginDto: UserLoginDto) {
    const result = await this.authService.login(userLoginDto);
    return result;
  }
  //测试token
  @UseGuards(AuthGuard('jwtStrategy'))
  @Post('/test')
  get() {
    return '登陆成功';
  }
  //-------------------------------------------------  用户信息------------------------------------------------
  //获取用户信息
  @UseGuards(AuthGuard('jwtStrategy'))
  @Get('user-info')
  async userInfo(@Request() payload: any) {
    try {
      const rolesList = await this.authService.getUserRolesByUsername(
        payload.user.username,
      );
      console.log(rolesList);
      const roles = rolesList.map((item) => {
        return item.roleName;
      });
      const userInfo = payload.user;
      userInfo.roles = roles;
      return {
        status: 'success',
        message: '获取用户信息成功',
        data: {
          userInfo,
        },
      };
    } catch (error) {
      return {
        status: 'failure',
        message: `获取用户信息失败：${error.message}}`,
      };
    }
  }

  //更新用户信息
  @UseGuards(AuthGuard('jwtStrategy'))
  @Post('update-user-info')
  async updateUserInfo(
    @Body() upDateUserInfoDto: UpdateUserInfoDto,
    @Request() playout,
  ) {
    const user = playout.user;
    console.log(upDateUserInfoDto);
    try {
      const userInfo = await this.authService.updateUserInfo(
        user.username,
        upDateUserInfoDto.attribute,
        upDateUserInfoDto.value,
      );
      console.log(userInfo);
      return {
        status: 'success',
        message: `已更新${upDateUserInfoDto.attribute}的值为${upDateUserInfoDto.value}`,
        data: {
          userInfo,
        },
      };
    } catch (error) {
      return {
        status: 'failure',
        message: error.message,
      };
    }
  }

  //上传用户头像
  @UseGuards(AuthGuard('jwtStrategy'))
  @Post('update-avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination(req, file, callback) {
          const filePath = 'uploadCatch/avatar';
          //判断文件夹是否存在，不存在则自动生成
          if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, { recursive: true, mode: '777' });
          }
          return callback(null, filePath);
        },
        filename(req, file, callback) {
          const fileName = generateFileUploadKey(file.originalname);
          callback(null, fileName);
        },
      }),
    }),
  )
  async uploadUserAvatar(
    @UploadedFile() avatar: Express.Multer.File,
    @Request() { user },
  ) {
    try {
      //在上传之前，先删掉已有的图片
      const currentAvatar = user.avatar;
      if (currentAvatar) {
        const start = currentAvatar.indexOf('/');
        const key = currentAvatar.slice(start, currentAvatar.length);
        await this.authService.deleteUserAvatar(key); //删除成功或者文件不存在则返回204或200
      }
      const key = generateFileUploadKey(avatar.originalname);
      const url = await this.authService.uploadUserAvatar(
        'avatar',
        key,
        avatar.path,
      );
      //上传完成后删除本地文件
      fs.unlinkSync(avatar.path);
      await this.authService.updateUserInfo(user.username, 'avatar', url);
      return {
        status: 'success',
        message: '上传头像成功',
        data: {
          avatarUrl: url,
        },
      };
    } catch (error) {
      return {
        status: 'failure',
        message: error.message,
      };
    }
  }
  //-----------------------------------------权限管理----------------------------------------------------

  //创建角色
  @UseGuards(AuthGuard('jwtStrategy'))
  @Post('create-role')
  async createRole(
    @Request() { user: { username } },
    @Body() { roleName, description },
  ) {
    try {
      //获取一个用户的角色列表，判断其是否是管理员
      let rolesOfUser = await firstValueFrom(
        this.microserviceUserClient.send('get:username:role', username),
      );

      rolesOfUser = rolesOfUser.map((item) => {
        return item.roleName;
      });
      if (!rolesOfUser.includes('管理员')) {
        return {
          status: 'failure',
          message: '您不是管理员,无权创建用户',
        };
      }
      //查看角色列表，防止重复创建
      let roleList = await firstValueFrom(
        this.microserviceRoleClient.send('get', ''),
      );
      roleList = roleList.map((item) => {
        return item.roleName;
      });
      if (roleList.includes(roleName)) {
        return {
          status: 'failure',
          message: `角色:${roleName}已存在，请勿重复创建`,
        };
      }
      await firstValueFrom(
        this.microserviceRoleClient.send('create-role', {
          roleName,
          description,
        }),
      );
      return {
        status: 'success',
        message: `创建角色:${roleName}成功`,
      };
    } catch (error) {
      return {
        status: 'failure',
        message: `创建角色失败:${error.message}`,
      };
    }
  }

  //给用户授权
  @UseGuards(AuthGuard('jwtStrategy'))
  @Post('grant-privilege')
  async grantPrivilege(
    @Request() { user },
    @Body() privilegeInfo: { username: string; roleName: string },
  ) {
    try {
      //首先判断授权者是否是否具有管理员权限
      const isAdmin = await firstValueFrom(
        this.microserviceUserClient.send('is-user-admin', user.username),
      );
      if (!isAdmin) {
        return {
          status: 'failure',
          message: '您不是管理员，无权给用户授权',
        };
      }
      //判断被授予的权限是否存在
      let allRole = await firstValueFrom(
        this.microserviceRoleClient.send('get', ''),
      );
      allRole = allRole.map((item) => {
        return item.roleName;
      });
      if (!allRole.includes(privilegeInfo.roleName)) {
        return {
          status: 'failure',
          message: `您授予的权限 ${privilegeInfo.roleName}不存，请先创建权限，再授权`,
        };
      }
      console.log(allRole);
      //判断用户是否已经存在
      const oneUse = await firstValueFrom(
        this.microserviceUserClient.send(
          'get:username',
          privilegeInfo.username,
        ),
      );
      if (!oneUse) {
        return {
          status: 'failure',
          message: `您要查找的用户${privilegeInfo.username}不存在`,
        };
      }

      //判断被授权的用户是否已经有该权限
      let rolesOfUser = await firstValueFrom(
        this.microserviceUserClient.send(
          'get:username:role',
          privilegeInfo.username,
        ),
      );
      rolesOfUser = rolesOfUser.map((item) => {
        return item.roleName;
      });
      if (rolesOfUser.includes(privilegeInfo.roleName)) {
        return {
          status: 'failure',
          message: `用户${privilegeInfo.username}已经具有${privilegeInfo.roleName}权限，无需重复授权`,
        };
      }
      //给用户授权
      const result = await firstValueFrom(
        this.microserviceUserClient.send('add-role-for-user', privilegeInfo),
      );
      return {
        status: 'success',
        message: `授权成功：给${privilegeInfo.username}授予了${privilegeInfo.roleName}权限`,
      };
      console.log(result);
    } catch (error) {
      return {
        status: 'failure',
        message: `给用户${privilegeInfo.username}授予${privilegeInfo.roleName}失败：${error.message}`,
      };
    }
  }
  //删除某个用户的某个权限
  @UseGuards(AuthGuard('jwtStrategy'))
  @Post('delete-role-from-user')
  async deleteRoleFromUser(
    @Request() { user },
    @Body() deleteInfo: { username: string; roleName },
  ) {
    //判断删除的人是否有管理员权限
    try {
      if (
        !(await firstValueFrom(
          this.microserviceUserClient.send('is-user-admin', user.username),
        ))
      ) {
        return {
          status: 'failure',
          message: '您不是管理员，无权撤销授权',
        };
      }
      //判断用户是否存在
      const oneUser = await firstValueFrom(
        this.microserviceUserClient.send('get:username', deleteInfo.username),
      );
      if (!oneUser) {
        return {
          status: 'failure',
          message: `您需要撤销权限的用户${deleteInfo.username}不存在`,
        };
      }
      console.log(oneUser);
      //判断该用户是否有需要撤销的权限
      let rolesOfUser = await firstValueFrom(
        this.microserviceUserClient.send(
          'get:username:role',
          deleteInfo.username,
        ),
      );
      rolesOfUser = rolesOfUser.map((item) => {
        return item.roleName;
      });
      if (!rolesOfUser.includes(deleteInfo.roleName)) {
        return {
          status: 'failure',
          message: `用户${deleteInfo.username}并不具备${deleteInfo.roleName}权限，无需撤销`,
        };
      }
      //撤销权限
      const deletedUser = await firstValueFrom(
        this.microserviceUserClient.send('delete-role-from-user', deleteInfo),
      );
      console.log('aaaaaaa');
      console.log(deletedUser);
      if (deletedUser) {
        return {
          status: 'success',
          message: `已成功撤销${deletedUser.username}的${deleteInfo.roleName}`,
        };
      } else {
        throw new Error();
      }
    } catch (error) {
      return {
        status: 'failure',
        message: `撤销权限失败：${error.message}`,
      };
    }
  }
  //获取系统存在角色列表
  @Get('get-roles')
  async getRoles() {
    return await this.authService.getRoles();
  }
  //删除某个用户
  @UseGuards(AuthGuard('jwtStrategy'))
  @Post('delete-user')
  async deleteUser(@Request() { user }, @Body() { username }) {
    try {
      if (
        !(await firstValueFrom(
          this.microserviceUserClient.send('is-user-admin', user.username),
        ))
      ) {
        return {
          status: 'failure',
          message: '您不是管理员，无权撤销授权',
        };
      }
      //判断用户是否存在
      const oneUser = await firstValueFrom(
        this.microserviceUserClient.send('get:username', username),
      );
      if (!oneUser) {
        return {
          status: 'failure',
          message: `用户${username}不存在，不需要删除`,
        };
      }
      await firstValueFrom(
        this.microserviceUserClient.send('delete-user', username),
      );

      return {
        status: 'success',
        message: `删除用户 ${username}成功`,
      };
    } catch (error) {
      return {
        status: 'failure',
        message: `删除用户失败${error.message}`,
      };
    }
  }
  //获取用户的全部角色
  @UseGuards(AuthGuard('jwtStrategy'))
  @Post('get-all-roles-of-user')
  async getAllRolesOffUser(@Request() { user: { username } }) {
    try {
      let roleList = await firstValueFrom(
        this.microserviceUserClient.send('get:username:role', username),
      );
      console.log(roleList);
      roleList = roleList.map((item) => {
        return item.roleName;
      });
      return {
        status: 'success',
        message: `获取用户信息全部角色成功`,
        data: {
          roleList,
        },
      };
    } catch (error) {
      return {
        status: 'failure',
        message: `获取用户信息失败：${error.message}`,
      };
    }
  }
  //修改指定用户的文本信息
  @UseGuards(AuthGuard('jwtStrategy'))
  @Post('update-specified-user-info')
  async updateSpecifiedUserInfo(
    @Request() { user: { username } },
    @Body()
    updateInfo: { username: string; attribute: string; newValue: string },
  ) {
    try {
      if (
        !(await firstValueFrom(
          this.microserviceUserClient.send('is-user-admin', username),
        ))
      ) {
        return {
          status: 'failure',
          message: `修改用户:${updateInfo.username}的属性:${updateInfo.attribute}为${updateInfo.newValue}失败——您不是管理员，无权修改`,
        };
      }
      if (updateInfo.attribute === 'password') {
        updateInfo.newValue = await hash(updateInfo.newValue);
      }
      await firstValueFrom(
        this.microserviceUserClient.send('update-user-info', updateInfo),
      );
      return {
        status: 'success',
        message: `修改用户:${updateInfo.username}的属性:${updateInfo.attribute}为${updateInfo.newValue}成功`,
      };
    } catch (error) {
      return {
        status: 'failure',
        message: `修改用户:${updateInfo.username}的属性:${updateInfo.attribute}为${updateInfo.newValue}失败——${error.message}`,
      };
    }
  }
}
