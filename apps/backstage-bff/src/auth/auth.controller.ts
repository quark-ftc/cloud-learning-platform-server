import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserLoginDto } from 'public/dto/user/user-login.dto';
import { UserRegisterDto } from 'public/dto/user/user-register.dto';
import { AuthService } from './auth.service';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() userRegisterDto: UserRegisterDto) {
    const result = await this.authService.register(userRegisterDto);
    return result;
  }

  @Post('/login')
  async login(@Body() userLoginDto: UserLoginDto) {
    const result = await this.authService.login(userLoginDto);
    return result;
  }

  @Get('get-roles')
  async getRoles() {
    return await this.authService.getRoles();
  }

  @UseGuards(AuthGuard('jwtStrategy'))
  @Post('/test')
  get() {
    return '登陆成功';
  }

  @UseGuards(AuthGuard('jwtStrategy'))
  @Get('user-info')
  userInfo(@Request() payload: any) {
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
}