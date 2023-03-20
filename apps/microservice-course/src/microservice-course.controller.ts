import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PrismaService } from '../../../libs/prisma/src/prisma.service';
import { UploadFileService } from '../../../libs/upload-file/src/upload-file.service';

@Controller()
export class MicroserviceCourseController {
  constructor(
    private readonly uploadFileService: UploadFileService,
    private readonly prismaClient: PrismaService,
  ) {}
  //根据指定的目录和key将文件上传到腾讯云COS中
  @MessagePattern('upload')
  async upload(uploadInfo: {
    directory: string;
    key: string;
    filePath: string;
  }) {
    // console.log(courseVideo.buffer.data);
    const { Location } = await this.uploadFileService
      .upload(
        uploadInfo.directory,
        uploadInfo.key,
        // Buffer.from(uploadInfo.file.buffer.data),
        uploadInfo.filePath,
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
    courseCategory: string;
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
        courseCategory: createCourseInfo.courseCategory,
      },
      select: {
        courseCover: true,
        courseDescription: true,
        courseGrade: true,
        courseName: true,
        coursePrice: true,
        courseState: true,
        courseVideo: true,
        courseCategory: true,
      },
    });
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

  //获取所有课程
  @MessagePattern('find-all-course')
  async findAllCourse() {
    return this.prismaClient.course.findMany();
  }
  //获取课程的分页列表
  @MessagePattern('get-paging-list')
  async getCoursePagingList(pagingInfo: { skip: number; take: number }) {
    return this.prismaClient.course.findMany({
      skip: pagingInfo.skip,
      take: pagingInfo.take,
    });
  }

  //查询课程总数
  @MessagePattern('get-course-count')
  async getUserCount() {
    return await this.prismaClient.course.count();
  }
  //添加课程到购物车
  @MessagePattern('add-course-to-shopping-cart')
  async addCourseToShoppingCart(addShoppingCartInfo: {
    username: string;
    courseId: string;
    address: string;
  }) {
    console.log(addShoppingCartInfo);
    return await this.prismaClient.shoppingCart.create({
      data: {
        address: addShoppingCartInfo.address,
        user: {
          connect: {
            username: addShoppingCartInfo.username,
          },
        },
        course: {
          connect: {
            courseId: addShoppingCartInfo.courseId,
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
    let courseInShoppingCartList =
      await this.prismaClient.shoppingCart.findMany({
        where: {
          username,
        },
        select: {
          username: true,
          course: {
            select: {
              courseId: true,
              courseName: true,
              courseCover: true,
              courseDescription: true,
              coursePrice: true,
            },
          },
        },
      });
    courseInShoppingCartList = courseInShoppingCartList.map((item) => {
      Object.assign(item, item.course);
      delete item.course;
      return item;
    });
    return courseInShoppingCartList;
  }

  //根据唯一的用户名和课程id查找购物车中的信息
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
  //向已购订单中添加课程(购买)
  @MessagePattern('add-course-to-purchased-course')
  async addCourseToPurchasedCourse(addInfo: {
    username: string;
    courseId: string;
    price: string;
  }) {
    return await this.prismaClient.purchasedCourse.create({
      data: {
        price: addInfo.price,
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
  //查询所有已购课程(查询订单)
  @MessagePattern('get-all-purchased-course')
  async getAllPurchasedCourse(username: string) {
    let orderList = await this.prismaClient.purchasedCourse.findMany({
      where: {
        username,
      },
      select: {
        courseId: true,
        orderId: true,
        price: true,
        course: {
          select: {
            courseName: true,
            courseDescription: true,
            courseCategory: true,
            courseGrade: true,
            courseVideo: true,
            courseCover: true,
          },
        },
      },
    });
    orderList = orderList.map((item) => {
      Object.assign(item, item.course);
      delete item.course;
      return item;
    });
    return orderList;
  }

  @MessagePattern('update-course-info')
  async updateCourseInfo(uploadInfo: {
    courseName: string;
    attribute: string;
    newValue: string;
  }) {
    return this.prismaClient.course.update({
      where: {
        courseName: uploadInfo.courseName,
      },
      data: {
        [uploadInfo.attribute]: uploadInfo.newValue,
      },
    });
  }
}
