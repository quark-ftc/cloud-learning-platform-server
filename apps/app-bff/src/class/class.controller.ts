import {
  Body,
  Controller,
  Inject,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateClassDto } from '../../../../public/dto/class/create-class.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('class')
export class ClassController {
  constructor(
    @Inject('microserviceClassClient')
    private readonly microserviceClassClient: ClientProxy,
    @Inject('microserviceUserClient')
    private readonly microserviceUserClient: ClientProxy,
  ) {}
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
}
