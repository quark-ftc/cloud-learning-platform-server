import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserLoginDto } from 'public/dto/user/user-login.dto';
import { UserRegisterDto } from '../../../../public/dto/user/user-register.dto';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Controller('/user')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configsService: ConfigService,
  ) {}

  @Post('/register')
  async register(@Body() userRegisterDto: UserRegisterDto) {
    const result = this.authService.register(userRegisterDto);
    return result;
  }

  @Post('/login')
  async login(@Body() userLoginDto: UserLoginDto) {
    const result = this.authService.login(userLoginDto);
    return result;
  }

  @UseGuards(AuthGuard('jwtStrategy'))
  @Post('/test')
  get() {
    return '登陆成功';
  }
}
