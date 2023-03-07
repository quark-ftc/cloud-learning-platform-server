import { PrismaClient } from '@prisma/client';
const prismaClient = new PrismaClient();

async function main() {
  //填充角色
  await prismaClient.role.createMany({
    data: [
      {
        roleName: '管理员',
      },
      {
        roleName: '教师',
      },
      {
        roleName: '学生',
      },
    ],
  });

  await prismaClient.user.create({
    data: {
      username: '18205172759',
      password: '3141592653',
      roles: {
        create: [
          {
            role: {
              connect: {
                roleName: '管理员',
              },
            },
          },
        ],
      },
    },
  });

  await prismaClient.roleToUser.createMany({
    data: [
      {
        roleName: '学生',
        username: '18205172759',
      },
      {
        roleName: '教师',
        username: '18205172759',
      },
    ],
  });

  await prismaClient.menu.createMany({
    data: [
      {
        pid: null,
        menuTitle: '课程管理',
        path: '/course',
      },
      {
        pid: null,
        menuTitle: '权限管理',
        path: '/auth',
      },
      {
        pid: 1,
        menuTitle: '用户管理',
        path: '/user',
      },
      {
        pid: 1,
        menuTitle: '角色管理',
        path: '/role',
      },
    ],
  });

  await prismaClient.menuToRole.createMany({
    data: [
      {
        roleName: '学生',
        menuTitle: '课程管理',
      },
      {
        roleName: '学生',
        menuTitle: '权限管理',
      },
      {
        roleName: '学生',
        menuTitle: '用户管理',
      },
      {
        roleName: '学生',
        menuTitle: '角色管理',
      },
      {
        roleName: '管理员',
        menuTitle: '课程管理',
      },
      {
        roleName: '管理员',
        menuTitle: '权限管理',
      },
      {
        roleName: '管理员',
        menuTitle: '用户管理',
      },
      {
        roleName: '管理员',
        menuTitle: '角色管理',
      },
    ],
  });
}
main();
