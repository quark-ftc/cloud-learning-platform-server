import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PrismaService } from '../../../libs/prisma/src/prisma.service';

@Controller()
export class MicroserviceHomeworkController {
  constructor(private readonly prismaClient: PrismaService) {}
  //发布作业
  @MessagePattern('create-homework')
  async createHomework(createHomeworkInfo: {
    homeworkName: string;
    descriptionText: string;
    descriptionImage: string;
    deadline: string;
    belongedClass: string;
    homeworkType: string;
    posingTeacher: string;
  }) {
    console.log(createHomeworkInfo);
    return await this.prismaClient.homework.create({
      data: {
        deadline: new Date(createHomeworkInfo.deadline),
        homeworkName: createHomeworkInfo.homeworkName,
        descriptionImage: createHomeworkInfo.descriptionImage,
        descriptionText: createHomeworkInfo.descriptionText,
        homeworkType: createHomeworkInfo.homeworkType,
        class: {
          connect: {
            className: createHomeworkInfo.belongedClass,
          },
        },
        teacher: {
          connect: {
            username: createHomeworkInfo.posingTeacher,
          },
        },
      },
    });
  }
  //在特定班级中查找作业
  @MessagePattern('find-homework-specific-class')
  async findHomeworkSpecificClass(findInfo: {
    belongedClass: string;
    homeworkName: string;
  }) {
    return await this.prismaClient.homework.findUnique({
      where: {
        homeworkNameAndBelongedClass: {
          belongedClass: findInfo.belongedClass,
          homeworkName: findInfo.homeworkName,
        },
      },
    });
  }
  //在特定班级中删除找作业
  @MessagePattern('delete-homework-specific-class')
  async deleteHomeworkSpecificClass(deleteInfo: {
    belongedClass: string;
    homeworkName: string;
  }) {
    console.log(deleteInfo);
    return await this.prismaClient.homework.delete({
      where: {
        homeworkNameAndBelongedClass: {
          belongedClass: deleteInfo.belongedClass,
          homeworkName: deleteInfo.homeworkName,
        },
      },
    });
  }

  //获取某个班级的所有课程列表
  @MessagePattern('get-homework-list-of-class')
  async getStudentHomeworkListOfClass(className: string) {
    return await this.prismaClient.homework.findMany({
      where: {
        belongedClass: className,
      },
    });
  }
  //将学生提交作业的信息写入数据库
  @MessagePattern('add-student-homework-submitted-info-to-db')
  async addStudentHomeworkSubmittedInfoToDb(addInfo: {
    homeworkName: string;
    homeworkBelongedClass: string;
    homeworkImage: string;
    AIEvaluation: string;
    studentName: string;
  }) {
    return await this.prismaClient.studentToHomeWork.create({
      data: {
        AIEvaluation: addInfo.AIEvaluation,
        homeworkImage: addInfo.homeworkImage,
        homework: {
          connect: {
            homeworkNameAndBelongedClass: {
              belongedClass: addInfo.homeworkBelongedClass,
              homeworkName: addInfo.homeworkName,
            },
          },
        },
        student: {
          connect: {
            username: addInfo.studentName,
          },
        },
      },
    });
  }

  //教师查看某个班级的某项作业的提交列表
  @MessagePattern('get-all-submitted-homework')
  async getAllSubmittedHomework({ homeworkName, className }) {
    return await this.prismaClient.studentToHomeWork.findMany({
      where: {
        homeworkName,
        homeworkBelongedClass: className,
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                avatar: true,
                nickname: true,
                realName: true,
              },
            },
          },
        },
      },
    });
  }

  //查看某一项作业的信息
  @MessagePattern('get-one-homework')
  async getOneHomework({ className, homeworkName, username }) {
    return await this.prismaClient.studentToHomeWork.findUnique({
      where: {
        studentUsernameAndHomeworkBelongedAndClassHomeworkName: {
          homeworkBelongedClass: className,
          homeworkName,
          studentUsername: username,
        },
      },
    });
  }

  //教师点评某项作业
  @MessagePattern('comment-on-homework')
  async commentOnHomework({
    comment,
    className,
    studentUsername,
    homeworkName,
  }) {
    return await this.prismaClient.studentToHomeWork.update({
      where: {
        studentUsernameAndHomeworkBelongedAndClassHomeworkName: {
          homeworkBelongedClass: className,
          homeworkName: homeworkName,
          studentUsername: studentUsername,
        },
      },
      data: {
        teacherComment: comment,
      },
    });
  }
}
