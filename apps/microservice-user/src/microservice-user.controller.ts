import { PrismaService } from '@app/prisma';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserRegisterDto } from 'public/dto/user/user-register.dto';

@Controller()
export class MicroserviceUserController {
  constructor(private readonly prisma: PrismaService) {}
  //查找所有用户
  @MessagePattern('get')
  async findAll() {
    return await this.prisma.user.findMany();
  }

  @MessagePattern('get:id')
  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        userId: id,
      },
    });
  }

  @MessagePattern('get:username')
  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: {
        username,
      },
    });
  }

  @MessagePattern('post')
  async createUser(UserRegisterDto: UserRegisterDto) {
    return this.prisma.user.create({
      data: UserRegisterDto,
    });
  }
}
