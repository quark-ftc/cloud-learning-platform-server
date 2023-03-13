import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUserPagingListDto } from 'public/dto/user/get-user-paging-list.dto';
import { UpdateUserInfoDto } from 'public/dto/user/update-user-info.dto';
import { UserLoginDto } from 'public/dto/user/user-login.dto';
import { UserRegisterDto } from 'public/dto/user/user-register.dto';
import { AuthService } from './auth.service';
import { generateFileUploadKey } from '../../../../public/util/generate-file-upload-key';
import { ClientProxy } from '@nestjs/microservices';
import { RoleCreateDto } from '../../../../public/dto/role/role-create.dto';
import { firstValueFrom } from 'rxjs';
import { diskStorage } from 'multer';
import * as fs from 'fs';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject('microserviceRoleClient')
    private readonly microserviceRoleClient: ClientProxy,
    @Inject('microserviceUserClient')
    private readonly microserviceUserClient: ClientProxy,
  ) {}
  //用户注册
  @Post('/register')
  async register(@Body() userRegisterDto: UserRegisterDto) {
    const result = await this.authService.register(userRegisterDto);
    return result;
  }
  //用户登陆
  @Post('/login')
  async login(@Body() userLoginDto: UserLoginDto) {
    const result = await this.authService.login(userLoginDto);
    return result;
  }

  //获取角色列表
  @Get('get-roles')
  async getRoles() {
    return await this.authService.getRoles();
  }
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
          message: `用户:${roleName}已存在，请勿重复创建`,
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

  @UseGuards(AuthGuard('jwtStrategy'))
  @Post('/test')
  get() {
    return '登陆成功';
  }

  @UseGuards(AuthGuard('jwtStrategy'))
  @Get('user-info')
  async userInfo(@Request() payload: any) {
    console.log('user-info');
    console.log(payload.user);
    return {
      status: 'success',
      message: '获取用户信息成功',
      data: {
        userInfo: payload.user,
      },
    };
  }
  // @UseGuards(AuthGuard('jwtStrategy'))
  // @Get('get_menus')
  // getMenus() {
  //   console.log('aaa');
  //   return {
  //     status: 'success',
  //     message: '获取菜单成功',
  //     data: {
  //       menus: [
  //         {
  //           id: 2,
  //           pid: 0,
  //           name: 'Course',
  //           path: '/course',
  //           title: '课程管理',
  //           icon: 'el-icon-star-off',
  //         },
  //         {
  //           id: 3,
  //           pid: 0,
  //           name: 'Student',
  //           path: '/',
  //           title: '学生管理',
  //           icon: 'el-icon-star-off',
  //         },
  //         {
  //           id: 4,
  //           pid: 2,
  //           name: 'CourseOperate',
  //           path: '/course/operate',
  //           title: '课程操作',
  //           icon: 'el-icon-star-off',
  //         },
  //         {
  //           id: 5,
  //           pid: 4,
  //           name: 'CourseAdd',
  //           path: '/course/operate/add',
  //           title: '增加课程',
  //           icon: 'el-icon-star-off',
  //         },
  //         {
  //           id: 6,
  //           pid: 4,
  //           name: 'CourseDelete',
  //           path: 'operate/operate/delete',
  //           title: '删除课程',
  //           icon: 'el-icon-star-off',
  //         },
  //         {
  //           id: 7,
  //           pid: 3,
  //           path: 'one',
  //           name: 'StudentAdd',
  //           title: '添加学生',
  //           icon: 'el-icon-star-off',
  //         },
  //         {
  //           id: 8,
  //           pid: 3,
  //           path: '/two',
  //           name: 'StudentDelete',
  //           title: '删除学生',
  //           icon: 'el-icon-star-off',
  //         },
  //       ],
  //     },
  //   };
  // }

  @UseGuards(AuthGuard('jwtStrategy'))
  @Get('get-menus')
  async getMenu(@Request() payload: any) {
    const user = payload.user;
    return await this.authService.getMenu(user.username);
  }
  //获取用户分页数据
  @UseGuards(AuthGuard('jwtStrategy'))
  @Post('user-paging-list')
  async getUserPagingList(@Body() getUserPagingListDto: GetUserPagingListDto) {
    try {
      const pagingData = await this.authService.getUserPagingList(
        +getUserPagingListDto.page, //TODO 改用管道
        +getUserPagingListDto.size,
      );
      console.log(pagingData);
      return {
        status: 'success',
        message: '获取分页数据成功',
        data: {
          size: +getUserPagingListDto.size,
          page: +getUserPagingListDto.page,
          list: pagingData.list,
          total: pagingData.total,
        },
      };
    } catch (error) {
      return {
        status: 'failure',
        message: `获取分页数据失败:${error.message}`,
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
            fs.mkdirSync(filePath, { recursive: true });
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
    console.log(avatar);
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
}
