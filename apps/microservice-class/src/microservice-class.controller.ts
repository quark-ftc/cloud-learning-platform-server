import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateClassDto } from '../../../public/dto/class/create-class.dto';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../../../libs/prisma/src/prisma.service';

@Controller()
export class MicroserviceClassController {
  constructor(private readonly prismaClient: PrismaService) {}
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
}
