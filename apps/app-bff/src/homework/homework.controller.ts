import { UploadFileService } from '@app/upload-file';
import {
  Body,
  Controller,
  Inject,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { generateFileUploadKey } from 'public/util';
import { firstValueFrom } from 'rxjs';
import * as tencentcloud from 'tencentcloud-sdk-nodejs';
// import axios from 'axios';
@Controller('homework')
export class HomeworkController {
  constructor(
    @Inject('microserviceHomeworkClient')
    private readonly microserviceHomeworkClient: ClientProxy,
    @Inject('microserviceUserClient')
    private readonly microserviceUserClient: ClientProxy,
    @Inject('microserviceClassClient')
    private readonly microserviceClassClient: ClientProxy,
    private uploadFileService: UploadFileService,
    private readonly configService: ConfigService,
  ) {}

  //--------------------------------------------教师----------------------------------------------
  //教师给某个班级发布作业
  @Post('create-homework')
  @UseGuards(AuthGuard('jwtStrategy'))
  @UseInterceptors(
    FileInterceptor('descriptionImage', {
      storage: diskStorage({
        destination(req, file, callback) {
          const filePath = 'uploadCache/homework/descriptionImage';
          //判断文件夹是否存在，不存在则自动生成
          if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, { recursive: true, mode: '777' });
          }
          return callback(null, filePath);
        },
        filename(req, file, callback) {
          const fileName = generateFileUploadKey(file.originalname);
          callback(null, fileName);
        },
      }),
    }),
  )
  async createHomework(
    @UploadedFile() descriptionImage: Express.Multer.File,
    @Request() { user: { username } },
    @Body()
    createHomeworkInfo: {
      homeworkName: string;
      descriptionText: string;
      deadline: string;
      belongedClass: string;
      homeworkType: string;
    },
  ) {
    let descriptionImageRUL = null;
    let descriptionImageKey = null;
    try {
      //判断用户身份是否是教师
      if (
        !firstValueFrom(
          this.microserviceUserClient.send('is-user-teacher', username),
        )
      ) {
        return {
          status: 'failure',
          message: `用户${username}不是教师，无权发布作业`,
        };
      }
      //判断教师是否是发布作业班级的创建者
      if (
        !(await firstValueFrom(
          this.microserviceClassClient.send('is-teacher-in-class', username),
        ))
      ) {
        return {
          status: 'failure',
          message: `用户:${username}不在班级:${createHomeworkInfo.belongedClass}，无权发布作业`,
        };
      }
      //判断发布的作业是否已经被发布过
      const existedHomework = await firstValueFrom(
        this.microserviceHomeworkClient.send('find-homework-specific-class', {
          belongedClass: createHomeworkInfo.belongedClass,
          homeworkName: createHomeworkInfo.homeworkName,
        }),
      );
      if (existedHomework) {
        return {
          status: ' failure',
          message: `您要发布给${createHomeworkInfo.belongedClass}班级的作业${createHomeworkInfo.homeworkName}已将存在，无需重复发布`,
        };
      }
      console.log(existedHomework);
      //如果课程的表述图片存在，则上传图片
      if (descriptionImage) {
        descriptionImageKey = generateFileUploadKey(
          descriptionImage.originalname,
        );
        const { Location } = await this.uploadFileService.upload(
          'homework/descriptionImage',
          descriptionImageKey,
          descriptionImage.path,
        );
        //上传完成后删除本地文件
        fs.unlinkSync(descriptionImage.path);
        descriptionImageRUL = 'https://' + Location;
      }
      const postedHomework = await firstValueFrom(
        this.microserviceHomeworkClient.send('create-homework', {
          ...createHomeworkInfo,
          descriptionImage: descriptionImageRUL,
          posingTeacher: username,
        }),
      );
      return {
        status: 'success',
        message: `已经成功将作业：${createHomeworkInfo.homeworkName}发布给班级：${createHomeworkInfo.belongedClass}`,
        data: {
          postedHomework,
        },
      };
    } catch (error) {
      if (descriptionImage) {
        await this.uploadFileService.delete(
          'homework/descriptionImage' + descriptionImageKey,
        );
      }

      return {
        status: 'failure',
        message: `发布作业失败:${error.message}`,
      };
    }
  }

  //教师删除某个班级的作业
  @Post('delete-homework')
  @UseGuards(AuthGuard('jwtStrategy'))
  async deleteHomework(
    @Request() { user: { username } },
    @Body() deleteInfo: { className: string; homeworkName: string },
  ) {
    try {
      //判断用户身份是否是教师
      if (
        !firstValueFrom(
          this.microserviceUserClient.send('is-user-teacher', username),
        )
      ) {
        return {
          status: 'failure',
          message: `用户${username}不是教师，无权发布作业`,
        };
      }
      //判断教师是否是发布作业班级的创建者
      if (
        !(await firstValueFrom(
          this.microserviceClassClient.send('is-teacher-in-class', username),
        ))
      ) {
        return {
          status: 'failure',
          message: `用户:${username}不在班级:${deleteInfo.className}，无权发布作业`,
        };
      }
      //判断发布的作业是否已经被发布过
      const existedHomework = await firstValueFrom(
        this.microserviceHomeworkClient.send('find-homework-specific-class', {
          belongedClass: deleteInfo.className,
          homeworkName: deleteInfo.homeworkName,
        }),
      );
      //如果没发布过，则无需删除
      if (!existedHomework) {
        return {
          status: ' failure',
          message: `${deleteInfo.className}班级的${deleteInfo.homeworkName}作业不存在，无需删除`,
        };
      }
      //如果发布过，且表述图片存在，则首先删除表述图片信息
      if (existedHomework.descriptionImage) {
        //跳过前面的https：//前缀
        const start = existedHomework.descriptionImage.indexOf('/', 8);
        const key = existedHomework.descriptionImage.slice(
          start + 1,
          existedHomework.descriptionImage.length,
        );
        console.log(key);
        await this.uploadFileService.delete(key);
      }
      const deletedHomework = await firstValueFrom(
        this.microserviceHomeworkClient.send('delete-homework-specific-class', {
          belongedClass: deleteInfo.className,
          homeworkName: deleteInfo.homeworkName,
        }),
      );
      return {
        status: 'success',
        message: `删除${deleteInfo.className}班的${deleteInfo.homeworkName}作业成功`,
        data: {
          deletedHomework,
        },
      };
    } catch (error) {
      return {
        status: 'success',
        message: `删除班级失败 ${error.message}}`,
      };
    }
  }

  //查看某班级某项作业的提交情况
  @Post('get-all-submitted-homework')
  @UseGuards(AuthGuard('jwtStrategy'))
  async getAllSubmittedHomework(
    @Request() { user: { username } },
    @Body() { className, homeworkName },
  ) {
    try {
      //判断用户身份是否是教师
      if (
        !firstValueFrom(
          this.microserviceUserClient.send('is-user-teacher', username),
        )
      ) {
        return {
          status: 'failure',
          message: `用户${username}不是教师，无权发布作业`,
        };
      }
      //判断教师是否是发布作业班级的创建者
      if (
        !(await firstValueFrom(
          this.microserviceClassClient.send('is-teacher-in-class', username),
        ))
      ) {
        return {
          status: 'failure',
          message: `用户:${username}不在班级:${className}，无权发布作业`,
        };
      }
      let submitHomeworkList = await firstValueFrom(
        this.microserviceHomeworkClient.send('get-all-submitted-homework', {
          className,
          homeworkName,
        }),
      );
      submitHomeworkList = submitHomeworkList.map((item) => {
        delete item.id;
        delete item.studentUsername;
        delete item.username;
        Object.assign(item.student, item.student.user);
        delete item.student.user;
        return item;
      });
      console.log(submitHomeworkList);
      return {
        status: 'success',
        message: `获取班级：${className}的${homeworkName}提交列表列表成功`,
        data: {
          submitHomeworkList,
        },
      };
    } catch (error) {
      return {
        status: 'failure',
        message: `教师${username}查看班级${className}所有${homeworkName}提交失败`,
      };
    }
  }

  //-----------------------------------------------------学生---------------------------------------------------
  //学生提交作业
  @Post('complete-homework')
  @UseGuards(AuthGuard('jwtStrategy'))
  @UseInterceptors(
    FileInterceptor('homeworkImage', {
      storage: diskStorage({
        destination(req, file, callback) {
          const filePath = 'uploadCache/homework/homeworkImage';
          //判断文件夹是否存在，不存在则自动生成
          if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, { recursive: true, mode: '777' });
          }
          return callback(null, filePath);
        },
        filename(req, file, callback) {
          const fileName = generateFileUploadKey(file.originalname);
          callback(null, fileName);
        },
      }),
    }),
  )
  async completeHomework(
    @Request() { user: { username } },
    @Body() { homeworkName, homeworkBelongedClass, homeworkType },
    @UploadedFile() homeworkImage: Express.Multer.File,
  ) {
    let homeworkImageUrl = '';
    let homeworkImageKey = '';
    console.log(username);
    try {
      //判断用户身份是否是学生
      if (
        !firstValueFrom(
          this.microserviceUserClient.send('is-user-student', username),
        )
      ) {
        return {
          status: 'failure',
          message: `用户${username}不学生，无法提交作业`,
        };
      }
      //判断学生是否属于特定班级
      if (
        !(await firstValueFrom(
          this.microserviceClassClient.send('is-student-in-class', {
            className: homeworkBelongedClass,
            username,
          }),
        ))
      ) {
        return {
          status: 'failure',
          message: `用户${username}不属于班级${homeworkBelongedClass}`,
        };
      }
      //判断作业是否存在
      if (
        !firstValueFrom(
          this.microserviceHomeworkClient.send('find-homework-specific-class', {
            belongedClass: homeworkBelongedClass,
            homeworkName: homeworkName,
          }),
        )
      ) {
        return {
          status: 'failure',
          message: `${username}提交的${homeworkName}不存在`,
        };
      }
      //将作业图片上传到COS
      homeworkImageKey = generateFileUploadKey(homeworkImage.originalname);
      const { Location } = await this.uploadFileService.upload(
        'homework/homeworkImage',
        homeworkImageKey,
        homeworkImage.path,
      );
      //上传完成后删除本地文件
      fs.unlinkSync(homeworkImage.path);
      homeworkImageUrl = 'https://' + Location;
      if (homeworkType === 'english-writing') {
        /**
         * 使用腾讯云SDK,
         * 使用API Explorer可以调试并生SDK调用代码
         * https://console.cloud.tencent.com/api/explorer?Product=ecc&Version=2018-12-13&Action=EHOCR
         */
        const clientConfig = {
          credential: {
            secretId: this.configService.get('SecretId'),
            secretKey: this.configService.get('SecretKey'),
          },
          region: '',
          profile: {
            httpProfile: {
              endpoint: 'ecc.tencentcloudapi.com',
            },
          },
        };
        console.log(homeworkImageUrl);
        // 实例化要请求产品的client对象,clientProfile是可选的
        const EccClient = tencentcloud.ecc.v20181213.Client;
        const client = new EccClient(clientConfig);
        const params = {
          Image: homeworkImageUrl,
          InputType: 0,
          ServerType: 1,
        };
        const AIEvaluation = await client.EHOCR(params);
        const submittedHomework = await firstValueFrom(
          this.microserviceHomeworkClient.send(
            'add-student-homework-submitted-info-to-db',
            {
              homeworkName: homeworkName,
              AIEvaluation: AIEvaluation,
              homeworkBelongedClass: homeworkBelongedClass,
              homeworkImage: homeworkImageUrl,
              studentName: username,
            },
          ),
        );
        return {
          status: 'success',
          message: `学生${username}的${homeworkName}作业提交成功`,
          data: {
            submittedHomework,
          },
        };
      } else {
        const submittedHomework = await firstValueFrom(
          this.microserviceHomeworkClient.send(
            'add-student-homework-submitted-info-to-db',
            {
              homeworkName: homeworkName,
              homeworkBelongedClass: homeworkBelongedClass,
              homeworkImage: homeworkImageUrl,
              studentName: username,
            },
          ),
        );
        return {
          status: 'success',
          message: `学生${username}的${homeworkName}作业提交成功`,
          data: {
            submittedHomework,
          },
        };
      }
    } catch (error) {
      return {
        status: 'failure',
        message: `提交作业失败:${error.message}`,
      };
    }
  }
  //获取一个班级的所有作业列表
  @Post('get-homework-list')
  @UseGuards(AuthGuard('jwtStrategy'))
  async getHomeworkList(
    @Request() { user: { username } },
    @Body() { className },
  ) {
    //判断用户是否属于班级
    if (
      !(await firstValueFrom(
        this.microserviceClassClient.send('is-student-in-class', {
          username,
          className,
        }),
      )) &&
      !(await firstValueFrom(
        this.microserviceClassClient.send('is-teacher-in-class', {
          className,
          createdTeacher: username,
        }),
      ))
    ) {
      return {
        status: 'failure',
        message: `用户${username}不在班级${className}中`,
      };
    }
    const homeworkList = await firstValueFrom(
      this.microserviceHomeworkClient.send(
        'get-homework-list-of-class',
        className,
      ),
    );

    return {
      status: 'success',
      message: `获取班级${className}的作业列表成功`,
      data: {
        homeworkList,
      },
    };
  }
  //查看某个学生的某项作业
  @Post('get-one-homework')
  @UseGuards(AuthGuard('jwtStrategy'))
  async getOneHomework(
    @Request()
    { user: { username } },
    @Body() { className, homeworkName, studentUsername },
  ) {
    //如果提供studentUsername,则查询studentUsername的作业，否则，查询当前用户的作业
    if (studentUsername) {
      username = studentUsername;
    }
    try {
      const homework = await firstValueFrom(
        this.microserviceHomeworkClient.send('get-one-homework', {
          className,
          homeworkName,
          username,
        }),
      );
      return {
        status: 'success',
        message: `获取${username}${className}班级中的${homeworkName}作业成功`,
        data: {
          homework,
        },
      };
    } catch (error) {
      return {
        status: 'failure',
        message: `获取${username}${className}班级中的${homeworkName}作业失败`,
      };
    }
  }
  //教师点评某项作业
  @Post('comment-on-homework')
  @UseGuards(AuthGuard('jwtStrategy'))
  async commentOnHomework(
    @Request() { user: { username } },
    @Body() { comment, className, studentUsername, homeworkName },
  ) {
    try {
      //判断用户身份是否是教师
      if (
        !firstValueFrom(
          this.microserviceUserClient.send('is-user-teacher', username),
        )
      ) {
        return {
          status: 'failure',
          message: `用户${username}不是教师，点评作业`,
        };
      }
      //判断教师是否是发布作业班级的创建者
      if (
        !(await firstValueFrom(
          this.microserviceClassClient.send('is-teacher-in-class', username),
        ))
      ) {
        return {
          status: 'failure',
          message: `用户:${username}不在班级:${className}，无权点评作业`,
        };
      }
      const homework = await firstValueFrom(
        this.microserviceHomeworkClient.send('comment-on-homework', {
          comment,
          className,
          studentUsername,
          homeworkName,
        }),
      );
      return {
        status: 'success',
        message: `点评 ${className}班中 ${studentUsername} 的 ${homeworkName} 作业失败`,
        data: {
          homework,
        },
      };
    } catch (error) {
      return {
        status: 'failure',
        message: `点评 ${className}班中 ${studentUsername} 的 ${homeworkName} 作业失败`,
      };
    }
  }
}
