import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserLoginDto } from 'public/dto/user/user-login.dto';
import { UserRegisterDto } from '../../../../public/dto/user/user-register.dto';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { UpdateUserInfoDto } from '../../../../public/dto/user/update-user-info.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { generateFileUploadKey } from 'public/util';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configsService: ConfigService,
  ) {}

  @Post('/register')
  async register(@Body() userRegisterDto: UserRegisterDto) {
    if (!userRegisterDto.role) {
      userRegisterDto.role = '学生';
    }
    const result = await this.authService.register(userRegisterDto);
    return result;
  }

  @Post('/login')
  async login(@Body() userLoginDto: UserLoginDto) {
    const result = await this.authService.login(userLoginDto);
    return result;
  }

  @UseGuards(AuthGuard('jwtStrategy'))
  @Post('/test')
  get() {
    return '登陆成功';
  }

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

  @Post('get-all-student')
  async getAllStudent() {
    return this.authService.getAllStudent();
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
  @UseInterceptors(FileInterceptor('avatar'))
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
        avatar,
      );
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
