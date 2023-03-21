import {
  Body,
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateCourseDto } from '../../../../public/dto/course/create-course.dto';
import { CreateClassDto } from '../../../../public/dto/class/create-class.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UploadedFiles } from '@nestjs/common';
import { generateFileUploadKey } from 'public/util';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { AuthGuard } from '@nestjs/passport';
@Controller('course')
export class CourseController {
  constructor(
    @Inject('microserviceCourseClient')
    private readonly microserviceCourseClient: ClientProxy,
    @Inject('microserviceUserClient')
    private readonly microserviceUserClient: ClientProxy,
  ) {}
  //上传课程
  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'courseVideo', maxCount: 1 },
        { name: 'courseCover', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination(req, file, callback) {
            let filePath = 'uploadCache/courseDest/';
            if (file.fieldname == 'courseVideo') {
              filePath += 'video';
            }
            if (file.fieldname == 'courseCover') {
              filePath += 'cover';
            }
            //判断文件夹是否存在，不存在则自动生成
            if (!fs.existsSync(filePath)) {
              fs.mkdirSync(filePath, { recursive: true, mode: 777 });
            }
            return callback(null, filePath);
          },
          filename(req, file, callback) {
            const fileName = generateFileUploadKey(file.originalname);
            callback(null, fileName);
          },
        }),
      },
    ),
  )
  async upload(
    @UploadedFiles()
    files: {
      courseVideo?: Express.Multer.File[];
      courseCover?: Express.Multer.File[];
    },
    @Body() createCourseDto: CreateCourseDto,
  ) {
    console.log(files);
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
          filePath: files.courseVideo[0].path,
        }),
      );
      //上传完成后删除本地文件
      fs.unlinkSync(files.courseVideo[0].path);
      //尝试上传课程封面
      const courseCoverKey = generateFileUploadKey(
        files.courseCover[0].originalname,
      );
      const courseCoverUrl = await firstValueFrom(
        this.microserviceCourseClient.send('upload', {
          directory: 'course/cover',
          key: courseCoverKey,
          filePath: files.courseCover[0].path,
        }),
      );
      //上传完成后删除本地文件
      fs.unlinkSync(files.courseCover[0].path);
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
        status: 'success',
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
  //获取全部课程(分页)列表
  @UseGuards(AuthGuard('jwtStrategy'))
  @Post('get-course-list')
  async getCourseList(
    @Request() { user: { username } },
    @Body() { category, skip, take },
  ) {
    try {
      let courseList = null;
      const total = await firstValueFrom(
        this.microserviceCourseClient.send('get-course-count', ''),
      );
      if (skip !== undefined && take !== undefined) {
        courseList = await firstValueFrom(
          this.microserviceCourseClient.send('get-paging-list', {
            skip: +skip,
            take: +take,
          }),
        );
        console.log('aaaaaaaa');
        console.log(courseList);
        console.log(skip);
        console.log(take);
        console.log('bbbbbbbbbb');
      } else {
        courseList = await firstValueFrom(
          this.microserviceCourseClient.send('find-all-course', ''),
        );
      }

      if (category) {
        console.log(category);
        courseList = courseList.filter((item) => {
          return item.courseCategory == category;
        });
      }
      let roleList = await firstValueFrom(
        this.microserviceUserClient.send('get:username:role', username),
      );
      //将roleList映射为只包含角色信息的数组
      roleList = roleList.map((item) => {
        return item.roleName;
      });
      console.log(roleList);
      /**
       * 如果用户没有管理员权限，则是返回状态为on的课程
       * 并且如果不是免费课程（coursePrice不为0）并且用户没有购买，则不返回视频url
       */
      if (!roleList.includes('管理员')) {
        let orderList = await firstValueFrom(
          this.microserviceCourseClient.send(
            'get-all-purchased-course',
            username,
          ),
        );
        //将orderList映射成值包含course的数组
        orderList = orderList.map((item) => {
          return item.courseId;
        });
        //如果课程的状态时off（不展示），则不向普通用户返回
        courseList = courseList.filter((item) => {
          return item.courseState != 'off';
        });
        //如果课程价格不为0，并且没有购买，则不反悔url
        courseList = courseList.map((item) => {
          if (item.coursePrice != 0 && !orderList.includes(item.courseId)) {
            delete item.courseVideo;
          }
          return item;
        });
        console.log(orderList);
      }

      return {
        status: 'success',
        message: '获取用户列表成功',
        data: {
          courseList,
          total,
        },
      };
    } catch (error) {
      return {
        status: 'failure',
        message: `获取用户列表失败: ${error.message}`,
      };
    }
  }
  //更新新课程的文本信息
  @UseGuards(AuthGuard('jwtStrategy'))
  @Post('update-course-info')
  async upDateCourseInfo(
    @Request() { user: { username } },
    @Body()
    updateInfo: { courseName: string; attribute: string; newValue: string },
  ) {
    if (
      !(await firstValueFrom(
        this.microserviceUserClient.send('is-user-admin', username),
      ))
    ) {
      return {
        status: 'failure',
        message: '您不是管理员，无权修改课程信息',
      };
    }
    const updatedCourse = await firstValueFrom(
      this.microserviceCourseClient.send('update-course-info', updateInfo),
    );
    return {
      status: 'success',
      message: `更新课程${updateInfo.courseName}的${updateInfo.attribute}为${updateInfo.newValue}成功}`,
      data: {
        updatedCourse,
      },
    };
  }
}
