import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateClassDto } from '../../../public/dto/class/create-class.dto';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../../../libs/prisma/src/prisma.service';
import { AddCourseToShoppingCartDto } from '../../../public/dto/course/add-course-to-shopping-cart.dto';

@Controller()
export class MicroserviceClassController {
  constructor(private readonly prismaClient: PrismaService) {}
  //------------------------------------教师------------------------------------------------------
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
  //获取指定教师创建的班级列表
  @MessagePattern('get-all-class-by-specified-teacher')
  async getAllClassBySpecifiedTeacher(teacherUsername: string) {
    const classList = await this.prismaClient.class.findMany({
      where: {
        createdTeacher: teacherUsername,
      },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                nickname: true,
                realName: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
    return classList.map((item) => {
      Object.assign(item.teacher, item.teacher.user);
      delete item.teacher.user;
      return item;
    });
  }

  //根据班级名称查找班级
  @MessagePattern('get-class-by-class-name')
  async getClassByClassName(className: string) {
    return await this.prismaClient.class.findUnique({
      where: { className },
    });
  }
  //获取所有的班级列表
  @MessagePattern('get-all-class')
  async getAllClass() {
    return await this.prismaClient.class.findMany();
  }
  //学生加入班级
  @MessagePattern('student-add-to-class')
  async studentAddToClass(addInfo: { username: string; className: string }) {
    return await this.prismaClient.classToStudent.create({
      data: {
        class: {
          connect: {
            className: addInfo.className,
          },
        },
        student: {
          connect: {
            username: addInfo.username,
          },
        },
      },
    });
  }
  //查找一个学生是否属于一个班级
  @MessagePattern('is-student-in-class')
  async isStudentInClass(findInfo: { username: string; className: string }) {
    const result = await this.prismaClient.classToStudent.findUnique({
      where: {
        studentUsernameAndClassName: {
          className: findInfo.className,
          studentUsername: findInfo.username,
        },
      },
    });
    if (result) {
      return true;
    } else {
      return false;
    }
  }
  //查找一个教师是否属于一个班级
  @MessagePattern('is-teacher-in-class')
  async isTeacherInClass(findInfo: { username: string; className: string }) {
    const result = await this.prismaClient.class.findFirst({
      where: {
        className: findInfo.className,
        createdTeacher: findInfo.username,
      },
    });
    if (result) {
      return true;
    } else {
      return false;
    }
  }
  //查找一个班级的所有成员信息
  @MessagePattern('get-all-user-of-specified-class')
  async getAllUserOfSpecifiedClass(findInfo: {
    username: string;
    className: string;
  }) {
    const students = await this.prismaClient.student.findMany({
      include: {
        user: {
          select: {
            address: true,
            avatar: true,
            email: true,
            nickname: true,
            realName: true,
            age: true,
            school: true,
          },
        },
      },
    });
    const studentList = students.map((item) => {
      Object.assign(item, item.user);
      delete item.user;
      return item;
    });
    const teacher = await this.prismaClient.class.findFirst({
      where: {
        className: findInfo.className,
      },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                address: true,
                avatar: true,
                email: true,
                nickname: true,
                realName: true,
                age: true,
                school: true,
              },
            },
          },
        },
      },
    });
    Object.assign(teacher.teacher, teacher.teacher.user);
    delete teacher.teacher.user;
    const teacherInfo = { ...teacher.teacher };
    console.log(teacherInfo);
    return {
      teacher: teacherInfo,
      studentList: studentList,
    };
  }

  //学生退出班级
  @MessagePattern('student-drop-out-of-class')
  async studentDropOutOfClass(deleteInfo: {
    username: string;
    className: string;
  }) {
    console.log(deleteInfo);
    return await this.prismaClient.classToStudent.delete({
      where: {
        studentUsernameAndClassName: {
          className: deleteInfo.className,
          studentUsername: deleteInfo.username,
        },
      },
    });
  }
  //查询一个班级的创建教师
  @MessagePattern('find-created-teacher')
  async findCreatedTeacher(className) {
    return await this.prismaClient.class.findUnique({
      select: {
        createdTeacher: true,
      },
      where: {
        className,
      },
    });
  }
  //删除班级
  @MessagePattern('delete-class')
  async deleteClass(className: string) {
    return await this.prismaClient.class.delete({
      where: {
        className: className,
      },
    });
  }
  //获取学生所属的所有班级列表
  @MessagePattern('get-all-class-which-student-in')
  async getAllClassWhichStudentIn(studentUsername: string) {
    return await this.prismaClient.classToStudent.findMany({
      where: {
        studentUsername,
      },
      include: {
        class: {
          select: {
            classDescription: true,
            className: true,
            createdTeacher: true,
            classId: true,
            classNumber: true,
            createAt: true,
            updateAt: true,
          },
        },
      },
    });
  }
}
