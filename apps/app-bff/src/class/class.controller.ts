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
      console.log(roleList);
      // console.log(createClassDto);
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
}
