import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateClassDto } from '../../../public/dto/class/create-class.dto';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../../../libs/prisma/src/prisma.service';

@Controller()
export class MicroserviceClassController {
  constructor(private readonly prismaClient: PrismaService) {}
  //创建班级
  @MessagePattern('create-class')
  async createClass(createClassInfo: {
    createdTeacher: string;
    className: string;
    classDescription: string;
  }) {
    return await this.prismaClient.class.create({
      data: {
        className: createClassInfo.className,
        classDescription: createClassInfo.classDescription,
        teacher: {
          connect: { username: createClassInfo.createdTeacher },
        },
      },
    });
  }

  //根据班级名称查找班级
  @MessagePattern('get-class-by-class-name')
  async getClassByClassName(className: string) {
    return await this.prismaClient.class.findUnique({
      where: { className },
    });
  }
}
