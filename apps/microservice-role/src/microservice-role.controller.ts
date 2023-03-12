import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { PrismaService } from '../../../libs/prisma/src/prisma.service';
import { RoleCreateDto } from '../../../public/dto/role/role-create.dto';
import { AppBffController } from '../../app-bff/src/app-bff.controller';

@Controller()
export class MicroserviceRoleController {
  constructor(private readonly prismaClient: PrismaService) {}
  //获取全部角色
  @MessagePattern('get')
  async findAll() {
    return await this.prismaClient.role.findMany();
  }

  //创建角色
  @MessagePattern('create-role')
  async createRole(roleCreateDto: RoleCreateDto) {
    return await this.prismaClient.role.create({
      data: {
        roleName: roleCreateDto.roleName,
        description: roleCreateDto.description,
      },
    });
  }
  //删除角色
  @MessagePattern('delete-role')
  async deleteRole(roleName: string) {
    return await this.prismaClient.role.delete({
      where: {
        roleName,
      },
    });
  }

  //获取一个用户的全部菜单
  /**
   *
   * @param roleList 角色数组
   * @returns 扁平化的菜单数据
   */
  @MessagePattern('get:menus')
  async getMenusByRoleName(roleList) {
    let list = [];
    //循环遍历每一个角色的菜单权限
    for (const item of roleList) {
      const result = await this.prismaClient.menuToRole.findMany({
        where: {
          roleName: item.roleName,
        },
        include: {
          menu: {
            select: {
              menuTitle: true,
              menuId: true,
              pid: true,
              path: true,
            },
          },
        },
      });
      console.log(result);
      list = list.concat(result);
    }
    //处理结果数组
    const menuList = list.map((item) => {
      //将数据库中pid中的null映射为0
      if (item.menu.pid == null) {
        item.menu.pid = 0;
      }
      return item.menu;
    });
    return menuList;
  }
}
