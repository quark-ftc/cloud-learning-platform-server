import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UploadFileService } from '../../../libs/upload-file/src/upload-file.service';
import { PrismaService } from '../../../libs/prisma/src/prisma.service';
import { CreateCourseDto } from '../../../public/dto/course/create-course.dto';
import { PrismaClient } from '@prisma/client';

@Controller()
export class MicroserviceCourseController {
  constructor(
    private readonly uploadFileService: UploadFileService,
    private readonly prismaClient: PrismaService,
  ) {}
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
  //删除
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

  @MessagePattern('find-all-course')
  async findAllCourse() {
    return this.prismaClient.course.findMany();
  }
}
