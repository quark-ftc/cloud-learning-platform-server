import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserLoginDto } from 'public/dto/user/user-login.dto';
import { UserRegisterDto } from '../../../../public/dto/user/user-register.dto';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

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
}
