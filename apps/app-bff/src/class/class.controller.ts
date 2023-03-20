import {
  Body,
  Controller,
  Inject,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { firstValueFrom } from 'rxjs';
import { CreateClassDto } from '../../../../public/dto/class/create-class.dto';

@Controller('class')
export class ClassController {
  constructor(
    @Inject('microserviceClassClient')
    private readonly microserviceClassClient: ClientProxy,
    @Inject('microserviceUserClient')
    private readonly microserviceUserClient: ClientProxy,
  ) {}

  //------------------------------------教师---------------------------------------------------
  //创建班级
  @UseGuards(AuthGuard('jwtStrategy'))
  @Post('create-class')
  async createClass(
    @Body()
    createClassDto: CreateClassDto,
    @Request() { user: { username } },
  ) {
    try {
      console.log(username);
      let roleList = await firstValueFrom(
        this.microserviceUserClient.send('get:username:role', username),
      );
      roleList = roleList.map((item) => {
        return item.roleName;
      });
      console.log(roleList);
      if (!roleList.includes('教师')) {
        return {
          status: 'failure',
          message: '您不是教师，无权创建班级',
        };
      }
      const oneClass = await firstValueFrom(
        this.microserviceClassClient.send(
          'get-class-by-class-name',
          createClassDto.className,
        ),
      );
      console.log(oneClass);
      if (oneClass) {
        return {
          status: 'failure',
          message: '班级名称已经存在，班级名称应该唯一',
        };
      }
      const createdClass = await firstValueFrom(
        this.microserviceClassClient.send('create-class', {
          createdTeacher: username,
          ...createClassDto,
        }),
      );
      return {
        status: 'success',
        message: '班级创建成功',
        data: {
          createdClass,
        },
      };
    } catch (error) {
      return {
        status: 'failure',
        message: `${error.message}`,
      };
    }
  }
  //删除班级
  @UseGuards(AuthGuard('jwtStrategy'))
  @Post('delete-class')
  async deleteClass(
    @Request()
    { user: { username } },
    @Body() { className },
  ) {
    try {
      const createdTeacher = await firstValueFrom(
        this.microserviceClassClient.send('find-created-teacher', className),
      );
      if (createdTeacher.createdTeacher !== username) {
        return {
          status: 'failure',
          message: `您不是班级 ${className}的创建者，无权删除班级`,
        };
      }
      await firstValueFrom(
        this.microserviceClassClient.send('delete-class', className),
      );
      return {
        status: 'success',
        message: `已删除班级：${className}`,
      };
    } catch (error) {
      return {
        status: 'failure',
        message: `删除班级失败${error.message}`,
      };
    }
  }
  //从自己创建的班级中删除指定学生
  @UseGuards(AuthGuard('jwtStrategy'))
  @Post('delete-student-from-class')
  async deleteStudentFromClass(
    @Request() { user: { username } },
    @Body() { studentName, className },
  ) {
    try {
      const createdTeacher = await firstValueFrom(
        this.microserviceClassClient.send('find-created-teacher', className),
      );
      if (createdTeacher.createdTeacher !== username) {
        return {
          status: 'failure',
          message: `您不是班级 ${className}的创建者，无权删除学生`,
        };
      }
      if (
        !this.microserviceClassClient.send('is-student-in-class', {
          username: studentName,
          className,
        })
      ) {
        return {
          status: 'failure',
          message: `学生${studentName}不在班级${className}中，无需退出}`,
        };
      }
      await firstValueFrom(
        this.microserviceClassClient.send('student-drop-out-of-class', {
          username: studentName,
          className,
        }),
      );
      return {
        status: 'success',
        message: `用户${studentName}已经成退出班级${className}`,
      };
    } catch (error) {
      return {
        status: 'failure',
        message: `学生 ${username}退出班级${className}失败：${error.message}`,
      };
    }
  }
  //获取所有自己创建的班级
  @UseGuards(AuthGuard('jwtStrategy'))
  @Post('get-all-class-by-specified-teacher')
  async getAllClassBySpecifiedTeacher(@Request() { user: { username } }) {
    try {
      console.log('1');
      if (
        !(await firstValueFrom(
          this.microserviceUserClient.send('is-user-teacher', username),
        ))
      ) {
        return {
          status: 'failure',
          message: '你不是教师，无法获得自己创建的班级',
        };
      }
      const classList = await firstValueFrom(
        this.microserviceClassClient.send(
          'get-all-class-by-specified-teacher',
          username,
        ),
      );
      return {
        status: 'success',
        message: `查找教师${username}创建的所有班级成功`,
        data: {
          classList,
        },
      };
    } catch (error) {
      return {
        status: 'failure',
        message: `获取教师${username}创建的班级失败:${error.message}`,
      };
    }
  }
  //-------------------------------------管理员----------------------------------------------------
  //获取所有班级列表
  @UseGuards(AuthGuard('jwtStrategy'))
  @Post('get-all-class')
  async getAllClass() {
    try {
      const classList = await firstValueFrom(
        this.microserviceClassClient.send('get-all-class', ''),
      );
      console.log(classList);
      return {
        status: 'success',
        message: '获取班级列表成功',
        data: {
          classList,
        },
      };
    } catch (error) {
      return {
        status: 'failure',
        message: `获取班级列表失败：${error.message}`,
      };
    }
  }
  //--------------------------------------学生-----------------------------------------------------
  //学生加入班级
  @UseGuards(AuthGuard('jwtStrategy'))
  @Post('student-add-to-class')
  async studentAddToClass(
    @Request() { user: { username } },
    @Body() { className },
  ) {
    try {
      let roleList = await firstValueFrom(
        this.microserviceUserClient.send('get:username:role', username),
      );
      roleList = roleList.map((item) => {
        return item.roleName;
      });
      console.log(roleList);
      if (!roleList.includes('学生')) {
        return {
          status: 'failure',
          message: '您不是学生，无法加入班级',
        };
      }
      if (
        !(await firstValueFrom(
          this.microserviceClassClient.send(
            'get-class-by-class-name',
            className,
          ),
        ))
      ) {
        return {
          status: 'failure',
          message: '您要加入的班级不存在',
        };
      }
      await firstValueFrom(
        this.microserviceClassClient.send('student-add-to-class', {
          username,
          className,
        }),
      );
      return {
        status: 'success',
        message: `学生${username}加入班级${className}成功`,
      };
    } catch (error) {
      return {
        status: 'failure',
        message: `加入班级失败：${error.message}`,
      };
    }
  }
  //学生主动退出班级
  @UseGuards(AuthGuard('jwtStrategy'))
  @Post('student-drop-out-of-class')
  async studentDropOutOfClass(
    @Request()
    { user: { username } },
    @Body() { className },
  ) {
    try {
      if (
        !this.microserviceClassClient.send('is-student-in-class', {
          username,
          className,
        })
      ) {
        return {
          status: 'failure',
          message: `用户${username}不在班级${className}中，无需退出}`,
        };
      }
      await firstValueFrom(
        this.microserviceClassClient.send('student-drop-out-of-class', {
          username,
          className,
        }),
      );
      return {
        status: 'success',
        message: `用户${username}已经成退出班级${className}`,
      };
    } catch (error) {
      return {
        status: 'failure',
        message: `学生 ${username}退出班级${className}失败：${error.message}`,
      };
    }
  }
  //获取学生所在所有班级列表
  @UseGuards(AuthGuard('jwtStrategy'))
  @Post('get-all-class-which-student-in')
  async getAllClassWhichStudentIn(@Request() { user: { username } }) {
    try {
      let classList = await firstValueFrom(
        this.microserviceClassClient.send(
          'get-all-class-which-student-in',
          username,
        ),
      );
      classList = classList.map((item) => {
        return item.class;
      });
      return {
        status: 'success',
        message: `查询用户 ${username}所在的所有班级成功`,
        data: {
          classList,
        },
      };
    } catch (error) {
      return {
        status: 'failure',
        message: `查询用户 ${username}所在的所有班级失败：${error.message}`,
      };
    }
  }
  //-----------------------------------公共----------------------------------------------------
  //获取指定班级的全部人员列表
  @UseGuards(AuthGuard('jwtStrategy'))
  @Post('get-all-user-of-specified-class')
  async getAllUserOfSpecifiedClass(
    @Request() { user: { username } },
    @Body() { className },
  ) {
    try {
      if (
        !(await firstValueFrom(
          this.microserviceClassClient.send('is-student-in-class', {
            username,
            className,
          }),
        )) &&
        !(await firstValueFrom(
          this.microserviceClassClient.send('is-teacher-in-class', {
            username,
            className,
          }),
        ))
      ) {
        return {
          status: 'failure',
          message: `用户${username}不在班级中，无法查看班级成员列表`,
        };
      }
      const classMemberList = await firstValueFrom(
        this.microserviceClassClient.send(
          'get-all-user-of-specified-class',
          className,
        ),
      );
      console.log(
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      );
      console.log(classMemberList);
      console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');
      return {
        status: 'success',
        message: '请求班级成员列表成功',
        data: {
          classMemberList,
        },
      };
    } catch (error) {
      return {
        status: 'failure',
        message: `用户${username}查找班级${className}所有成员的请求失败：${error.message}`,
      };
    }
  }
}
