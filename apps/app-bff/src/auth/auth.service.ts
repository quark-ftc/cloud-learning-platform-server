import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { User } from '@prisma/client';
import { hash, verify } from 'argon2';
import { UserLoginDto } from 'public/dto/user/user-login.dto';
import { UserRegisterDto } from 'public/dto/user/user-register.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject('microserviceUserClient')
    private readonly microserviceUserClient: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async register(userRegisterDto: UserRegisterDto) {
    try {
      const user = await firstValueFrom(
        this.microserviceUserClient.send(
          'get:username',
          userRegisterDto.username,
        ),
      );
      if (!user) {
        userRegisterDto.password = await hash(userRegisterDto.password);
        await firstValueFrom(
          this.microserviceUserClient.send('post', userRegisterDto),
        );
        return {
          status: 'success',
          message: '注册成功',
        };
      } else {
        return {
          status: 'failure',
          message: '注册失败，用户以存在',
        };
      }
    } catch (error) {
      return {
        status: 'failure',
        message: `注册失败：${error.message}`,
      };
    }
  }

  async login(userLoginDto: UserLoginDto) {
    try {
      console.log(userLoginDto);
      const user = await firstValueFrom<Promise<User>>(
        this.microserviceUserClient.send('get:username', userLoginDto.username),
      );
      console.log(user);
      if (!user) {
        return {
          status: 'failure',
          message: '登陆失败，用户不存在',
        };
      } else if (!(await verify(user.password, userLoginDto.password))) {
        return {
          status: 'failure',
          message: '登陆失败，密码错误',
        };
      } else {
        return {
          status: 'success',
          message: '登陆成功',
          data: {
            token: await this.jwtService.signAsync({
              username: userLoginDto.username,
              role: userLoginDto.role,
            }),
          },
        };
      }
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async getUserRolesByUsername(username: string) {
    const roleList = await firstValueFrom(
      this.microserviceUserClient.send('get:username:role', username),
    );
    return roleList;
  }
  async getAllStudent() {
    try {
      let studentList = await firstValueFrom(
        this.microserviceUserClient.send('get-all-student', ''),
      );
      studentList = studentList.map((item) => {
        Object.assign(item.user, item.user.student);
        delete item.user.student;
        Object.assign(item, item.user);
        delete item.user;
        return item;
      });
      console.log(studentList);
      return {
        status: 'success',
        message: '查询所有学生成功',
        data: {
          studentList,
        },
      };
    } catch (error) {
      return {
        status: 'failure',
        message: `查询所有用户失败${error.message}`,
      };
    }
  }
  async updateUserInfo(username: string, attribute: string, newValue: string) {
    const userInfo = await firstValueFrom(
      this.microserviceUserClient.send('update-user-info', {
        username,
        attribute,
        newValue,
      }),
    ).catch((error) => {
      console.log(error.message);
    });
    delete userInfo.password;
    return userInfo;
  }
  //上传用户头像
  async uploadUserAvatar(directory: string, key: string, avatar) {
    const url = await firstValueFrom(
      this.microserviceUserClient.send('upload-avatar', {
        directory,
        key,
        avatar,
      }),
    );
    return url;
  }
  //删除用户头像
  async deleteUserAvatar(key: string) {
    return await firstValueFrom(
      this.microserviceUserClient.send('delete-avatar', key),
    );
  }
}
