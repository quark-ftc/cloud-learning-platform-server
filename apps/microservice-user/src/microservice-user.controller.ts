import { PrismaService } from '@app/prisma';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserRegisterDto } from 'public/dto/user/user-register.dto';
import { UploadFileService } from '../../../libs/upload-file/src/upload-file.service';
import e from 'express';

@Controller()
export class MicroserviceUserController {
  constructor(
    private readonly prismaClient: PrismaService,
    private readonly uploadFileService: UploadFileService,
  ) {}
  //查找所有用户
  @MessagePattern('get')
  async findAll() {
    return await this.prismaClient.user.findMany();
  }
  //根据id查找用
  @MessagePattern('get:id')
  async findById(id: string) {
    return await this.prismaClient.user.findUnique({
      where: {
        userId: id,
      },
    });
  }
  //根据用户名查找用户信息
  @MessagePattern('get:username')
  async findByUsername(username: string) {
    return await this.prismaClient.user.findUnique({
      where: {
        username: username,
      },
    });
  }
  //根据用户名查找用户所有的角色
  @MessagePattern('get:username:role')
  async getAllRoleByUsername(username: string) {
    try {
      const roles = await this.prismaClient.roleToUser.findMany({
        select: {
          roleName: true,
        },
        where: {
          username,
        },
      });
      return roles;
    } catch (error) {
      return Promise.reject(error.message);
    }
  }
  //创建账户
  @MessagePattern('post')
  async createUser(userRegisterDto: UserRegisterDto) {
    try {
      const user = await this.prismaClient.user.create({
        data: {
          username: userRegisterDto.username,
          password: userRegisterDto.password,
          roles: {
            create: [
              {
                // role: {
                //   connect: {
                //     roleName: userRegisterDto.role,
                //   },
                // },
                role: {
                  connect: {
                    roleName: userRegisterDto.role,
                  },
                },
              },
            ],
          },
        },
      });
      console.log(user);
      if (userRegisterDto.role === '学生') {
        await this.prismaClient.student.create({
          data: {
            username: userRegisterDto.username,
          },
        });
      } else if (userRegisterDto.role === '教师') {
        await this.prismaClient.teacher.create({
          data: {
            username: userRegisterDto.username,
          },
        });
      }
      return user;
    } catch (error) {
      return Promise.reject(`创建账户失败：${error.message}`);
    }
  }
  //根据分页信息获取数据
  @MessagePattern('user-paging-list')
  async getUserPagingList(pagingInfo) {
    console.log('-------------------------');
    console.log(pagingInfo.skip);
    console.log(pagingInfo.list);
    console.log('------------------------');
    return await this.prismaClient.user.findMany({
      skip: pagingInfo.skip,
      take: pagingInfo.take,
    });
  }

  //查询总用户数量
  @MessagePattern('get-user-count')
  async getUserCount() {
    return await this.prismaClient.user.count();
  }

  @MessagePattern('update-user-info')
  async updateUserInfo(updateData: {
    username: string;
    attribute: string;
    newValue: string;
  }) {
    await this.prismaClient.user.update({
      where: {
        username: updateData.username,
      },
      data: {
        [updateData.attribute]: updateData.newValue,
      },
    });
    return await this.findByUsername(updateData.username);
  }
  @MessagePattern('upload-avatar')
  async uploadAvatar(uploadInfo: { directory: string; key: string; avatar }) {
    const { Location } = await this.uploadFileService.upload(
      uploadInfo.directory,
      uploadInfo.key,
      Buffer.from(uploadInfo.avatar.buffer.data),
    );
    console.log(Location);
    return Location;
  }

  @MessagePattern('delete-avatar')
  async deleteAvatar(key: string) {
    const responseData = await this.uploadFileService.delete(key);
    console.log(responseData);
    return responseData;
  }
}
