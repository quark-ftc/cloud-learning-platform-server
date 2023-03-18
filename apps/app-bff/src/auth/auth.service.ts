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
    @Inject('microserviceRoleClient')
    private readonly microserviceRoleClient: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}
  //获取系统中存在的角色列表
  async getRoles() {
    try {
      const roles = await firstValueFrom(
        this.microserviceRoleClient.send('get', 'none'),
      );

      const roleNameList = roles.map((item) => {
        return item.roleName;
      });
      console.log(roleNameList);
      return {
        status: 'success',
        message: '获取角色成功',
        data: {
          roles: roleNameList,
        },
      };
    } catch (error) {
      return {
        status: 'failure',
        message: `角色获取失败：${error.message}`,
      };
    }
  }
  //注册
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
  //登陆
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
  //获取用户具有的所有角色
  async getUserRolesByUsername(username: string) {
    const roleList = await firstValueFrom(
      this.microserviceUserClient.send('get:username:role', username),
    );
    return roleList;
  }
  //更新用户信息
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
  async uploadUserAvatar(directory: string, key: string, avatarPath) {
    const url = await firstValueFrom(
      this.microserviceUserClient.send('upload-avatar', {
        directory,
        key,
        avatarPath,
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
