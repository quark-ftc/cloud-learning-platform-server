import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UploadFileService } from '../../../libs/upload-file/src/upload-file.service';
import { PrismaService } from '../../../libs/prisma/src/prisma.service';
import { CreateCourseDto } from '../../../public/dto/course/create-course.dto';
import { PrismaClient } from '@prisma/client';
import { userInfo } from 'os';
import { use } from 'passport';

@Controller()
export class MicroserviceCourseController {
  constructor(
    private readonly uploadFileService: UploadFileService,
    private readonly prismaClient: PrismaService,
  ) {}
  //根据指定的目录和key将文件上传到腾讯云COS中
  @MessagePattern('upload')
  async upload(uploadInfo: { directory: string; key: string; file: any }) {
    // console.log(courseVideo.buffer.data);
    const { Location } = await this.uploadFileService
      .upload(
        uploadInfo.directory,
        uploadInfo.key,
        Buffer.from(uploadInfo.file.buffer.data),
      )
      .catch((error) => {
        console.log(error.message);
      });
    //返回URL
    const url = 'https://' + Location;
    return url;
  }
  //根据key删除删除腾讯云COS中的文件
  @MessagePattern('delete')
  async delete(key: string) {
    const responseData = await this.uploadFileService.delete(key);
    console.log(responseData);
  }
  //根据课程名称查找课程
  @MessagePattern('get-course-by-course-name')
  async getCourseByCourseName(courseName: string) {
    return await this.prismaClient.course.findUnique({
      where: {
        courseName,
      },
    });
  }
  //根据课程id查找课程
  @MessagePattern('get-course-by-course-id')
  async getCourseByCourseId(courseId: string) {
    return await this.prismaClient.course.findUnique({
      where: {
        courseId,
      },
    });
  }
  //将课程信息写入数据库
  @MessagePattern('create-course')
  async createCourse(createCourseInfo: {
    courseName: string;
    courseDescription: string;
    coursePrice: string;
    courseGrade: string;
    courseState: string;
    courseVideo: string;
    courseCover: string;
  }) {
    return await this.prismaClient.course.create({
      data: {
        courseCover: createCourseInfo.courseCover,
        courseGrade: createCourseInfo.courseGrade,
        courseName: createCourseInfo.courseName,
        coursePrice: createCourseInfo.coursePrice,
        courseVideo: createCourseInfo.courseVideo,
        courseDescription: createCourseInfo.courseDescription,
        courseState: createCourseInfo.courseState,
      },
      select: {
        courseCover: true,
        courseDescription: true,
        courseGrade: true,
        courseName: true,
        coursePrice: true,
        courseState: true,
        courseVideo: true,
      },
    });
  }
  //获取所有课程
  @MessagePattern('find-all-course')
  async findAllCourse() {
    return this.prismaClient.course.findMany();
  }
  //添加课程到购物车
  @MessagePattern('add-course-to-shopping-cart')
  async addCourseToShoppingCart(addShoppingCartInfo: {
    username: string;
    courseId: string;
    address: string;
  }) {
    return await this.prismaClient.shoppingCart.create({
      data: {
        address: addShoppingCartInfo.address,
        course: {
          connect: {
            courseId: addShoppingCartInfo.courseId,
          },
        },
        user: {
          connect: {
            username: addShoppingCartInfo.username,
          },
        },
      },
    });
  }
  //从购物车删除课程
  @MessagePattern('delete-course-from-shopping-cart')
  async deleteCourseToShoppingCart(deleteShoppingCartInfo: {
    username: string;
    courseId: string;
  }) {
    return await this.prismaClient.shoppingCart.delete({
      where: {
        usernameAndCourseId: {
          courseId: deleteShoppingCartInfo.courseId,
          username: deleteShoppingCartInfo.username,
        },
      },
    });
  }
  //获取购物车中的所有订单
  @MessagePattern('get-all-orders-in-shopping-cart')
  async getAllOrdersInShoppingCart(username: string) {
    return await this.prismaClient.shoppingCart.findMany({
      where: {
        username,
      },
    });
  }

  //根据唯一的用户名和课程id在购物车中查找订单
  @MessagePattern('get-order-in-shopping-cart-by-username-and-course-id')
  async getOrderByUsernameAndCourseId(findInfo: {
    username: string;
    courseId: string;
  }) {
    return await this.prismaClient.shoppingCart.findUnique({
      where: {
        usernameAndCourseId: {
          username: findInfo.username,
          courseId: findInfo.courseId,
        },
      },
    });
  }
  //根据唯一的用户名和课程id在已购课程中中查找订单
  @MessagePattern('get-order-in-purchased-course-by-username-and-course-id')
  async getOrderInPurchasedCourseByUsernameAndCourseId(findInfo: {
    username: string;
    courseId: string;
  }) {
    return await this.prismaClient.purchasedCourse.findUnique({
      where: {
        usernameAndCourseId: {
          courseId: findInfo.courseId,
          username: findInfo.username,
        },
      },
    });
  }
  //向已购订单中添加课程
  @MessagePattern('add-course-to-purchased-course')
  async addCourseToPurchasedCourse(addInfo: {
    username: string;
    courseId: string;
  }) {
    return await this.prismaClient.purchasedCourse.create({
      data: {
        course: {
          connect: {
            courseId: addInfo.courseId,
          },
        },
        user: {
          connect: {
            username: addInfo.username,
          },
        },
      },
    });
  }
}
