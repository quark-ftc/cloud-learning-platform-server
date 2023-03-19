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

  // await prismaClient.user.create({
  //   data: {
  //     username: '18205172759',
  //     password: '3141592653',
  //     roles: {
  //       create: [
  //         {
  //           role: {
  //             connect: {
  //               roleName: '管理员',
  //             },
  //           },
  //         },
  //       ],
  //     },
  //   },
  // });

  // await prismaClient.roleToUser.createMany({
  //   data: [
  //     {
  //       roleName: '学生',
  //       username: '18205172759',
  //     },
  //     {
  //       roleName: '教师',
  //       username: '18205172759',
  //     },
  //   ],
  // });

  await prismaClient.menu.createMany({
    data: [
      //--------------------------------一级菜单----------------------
      //id = 1
      {
        pid: null,
        menuTitle: '管理员',
        path: '/admin',
      },
      //id = 2;
      {
        pid: null,
        menuTitle: '学生',
        path: '/student',
      },
      //id = 3
      {
        pid: null,
        menuTitle: '教师',
        path: '/teacher',
      },
      //--------------------------二级菜单-管理员------------------------------
      {
        pid: 1,
        menuTitle: '用户管理',
        path: '/user-manage',
      },
      {
        pid: 1,
        menuTitle: '课程管理',
        path: '/course-manage',
      },
      {
        pid: 1,
        menuTitle: '增加课程',
        path: '/add-course',
      },
      //-------------------------二级菜单-----学生------------
      {
        pid: 2,
        menuTitle: '所有课程',
        path: '/course-list',
      },
      {
        pid: 2,
        menuTitle: '所有班级',
        path: '/student-class-list',
      },
      //-----------------------三级菜单------教师--------
      {
        pid: 3,
        menuTitle: '班级管理',
        path: '/class-manage',
      },
    ],
  });

  await prismaClient.menuToRole.createMany({
    data: [
      {
        roleName: '管理员',
        menuTitle: '管理员',
      },
      {
        roleName: '管理员',
        menuTitle: '用户管理',
      },
      {
        roleName: '管理员',
        menuTitle: '增加课程',
      },
      {
        roleName: '管理员',
        menuTitle: '课程管理',
      },
      {
        roleName: '学生',
        menuTitle: '学生',
      },
      {
        roleName: '学生',
        menuTitle: '所有课程',
      },
      {
        roleName: '学生',
        menuTitle: '所有班级',
      },
      {
        roleName: '教师',
        menuTitle: '教师',
      },
      {
        roleName: '教师',
        menuTitle: '班级管理',
      },
    ],
  });
}
main();
