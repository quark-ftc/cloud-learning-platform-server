import {
  Body,
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateCourseDto } from '../../../../public/dto/course/create-course.dto';
import { CreateClassDto } from '../../../../public/dto/class/create-class.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UploadedFiles } from '@nestjs/common';
import { generateFileUploadKey } from 'public/util';

@Controller('course')
export class CourseController {
  constructor(
    @Inject('microserviceCourseClient')
    private readonly microserviceCourseClient: ClientProxy,
  ) {}
  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'courseVideo', maxCount: 1 },
      { name: 'courseCover', maxCount: 1 },
    ]),
  )
  async upload(
    @UploadedFiles()
    files: {
      courseVideo?: Express.Multer.File[];
      courseCover?: Express.Multer.File[];
    },
    @Body() createCourseDto: CreateCourseDto,
  ) {
    // // ! 解决originalname中文乱码的问题
    // files.courseCover[0].originalname = Buffer.from(
    //   files.courseCover[0].originalname,
    //   'latin1',
    // ).toString('utf8');
    // files.courseVideo[0].originalname = Buffer.from(
    //   files.courseVideo[0].originalname,
    //   'latin1',
    // ).toString('utf8');
    console.log(files);
    console.log(createCourseDto);
    try {
      //先查询课程是否已存在
      const course = await firstValueFrom(
        this.microserviceCourseClient.send(
          'get-course-by-course-name',
          createCourseDto.courseName,
        ),
      );
      if (course) {
        return {
          status: 'failure',
          message: '课程名称已存在，课程名称应该唯一',
        };
      }
      //尝试上传课程视频
      const videoKey = generateFileUploadKey(files.courseVideo[0].originalname);

      const courseVideoUrl = await firstValueFrom(
        this.microserviceCourseClient.send('upload', {
          directory: 'course/video',
          key: videoKey,
          file: files.courseCover[0],
        }),
      );
      //尝试上传课程封面
      const courseCoverKey = generateFileUploadKey(
        files.courseCover[0].originalname,
      );
      const courseCoverUrl = await firstValueFrom(
        this.microserviceCourseClient.send('upload', {
          directory: 'course/cover',
          key: courseCoverKey,
          file: files.courseCover[0],
        }),
      );
      console.log(courseCoverUrl);
      console.log(courseVideoUrl);
      //视频和封面都上传成功后，写入数据库
      const createCourseInfo = {
        ...createCourseDto,
        courseVideo: courseVideoUrl,
        courseCover: courseCoverUrl,
      };
      console.log(createCourseInfo.courseCategory);
      const createdCourse = await firstValueFrom(
        this.microserviceCourseClient.send('create-course', createCourseInfo),
      );

      return {
        status: 'failure',
        message: '课程上传成功',
        data: {
          course: createdCourse,
        },
      };
    } catch (error) {
      return {
        status: 'failure',
        message: `上传文件失败${error.message}`,
      };
    }
  }
}
