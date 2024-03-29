import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { User } from '@prisma/client';
import { hash, verify } from 'argon2';
import { UserLoginDto } from 'public/dto/user/user-login.dto';
import { UserRegisterDto } from 'public/dto/user/user-register.dto';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @Inject('microserviceUserClient')
    private readonly microserviceUserClient: ClientProxy,
    @Inject('microserviceRoleClient')
    private readonly microserviceRoleClient: ClientProxy,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  //用户注册
  async register(userRegisterDto: UserRegisterDto) {
    if (
      userRegisterDto.role === '管理员' &&
      userRegisterDto.adminSecretKey != this.configService.get('ADMIN_SECRET')
    ) {
      return {
        status: 'failure',
        message: '管理员口令错误，您无权注册管理员账号',
      };
    }
    try {
      const user = await firstValueFrom(
        this.microserviceUserClient.send(
          'get:username',
          userRegisterDto.username,
        ),
      );
      if (!user) {
        userRegisterDto.password = await hash(userRegisterDto.password);
        delete userRegisterDto.adminSecretKey;
        const test = await firstValueFrom(
          this.microserviceUserClient.send('post', userRegisterDto),
        );
        console.log(test);
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

  //用户登陆
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

  //获取菜单
  async getMenu(username: string) {
    try {
      //根据用户名查找某个用户的所有权限
      /**
       *  [ { roleName: '学生' }, { roleName: '管理员' } ]
       */
      const roles = await firstValueFrom(
        this.microserviceUserClient.send('get:username:role', username),
      );
      console.log(roles);
      //将结果映射为一个包含角色的数组
      /**
       *  [ '学生', '管理员' ]
       */
      const rolesList = roles.map((item) => {
        return item.roleName;
      });
      //循环遍历结果数组，获取每个角色对应的菜单信息。
      const menuData = await firstValueFrom(
        this.microserviceRoleClient.send('get:menus', rolesList),
      );
      // 对结果数组去重
      const nonDuplicateMenuData = [];
      const map = new Map();
      menuData.forEach((item) => {
        if (!map.has(item.menuId)) {
          map.set(item.menuId, true);
          nonDuplicateMenuData.push(item);
        }
      });
      console.log(nonDuplicateMenuData);
      return {
        status: 'success',
        message: '获取菜单成功',
        data: {
          menus: nonDuplicateMenuData,
        },
      };
    } catch (error) {
      return {
        status: 'failure',
        message: `获取菜单失败:${error.message}`,
      };
    }
  }
  //获取用户的分页数据
  //TODO: 这里的返回类型暂且写Promise<any>,以避免类型错误
  async getUserPagingList(page: number, take: number): Promise<any> {
    const pagingList = await firstValueFrom(
      this.microserviceUserClient.send('user-paging-list', {
        skip: page * take,
        take,
      }),
    ).catch((error) => {
      return Promise.resolve(error.message);
    });
    const userCount = await firstValueFrom(
      this.microserviceUserClient.send('get-user-count', ''),
    ).catch((error) => {
      return Promise.resolve(error.message);
    });
    console.log(userCount);
    return {
      list: pagingList,
      total: userCount,
    };
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
