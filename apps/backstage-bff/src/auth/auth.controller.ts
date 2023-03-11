import {
  Body,
  Controller,
  Get,
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
  @UseInterceptors(FileInterceptor('avatar'))
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
