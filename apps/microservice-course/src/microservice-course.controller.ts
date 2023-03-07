import { Controller, Get, Inject } from '@nestjs/common';
import { MessagePattern, ClientProxy } from '@nestjs/microservices';
import { UploadFileService } from '../../../libs/upload-file/src/upload-file.service';
import { ConfigService } from '@nestjs/config';
import { buffer } from 'stream/consumers';

@Controller()
export class MicroserviceCourseController {
  constructor(
    private readonly uploadFileService: UploadFileService,
    private readonly configService: ConfigService,
  ) {}
  @MessagePattern('upload-course-video')
  async uploadCourseVideo(courseVideo) {
    // console.log(courseVideo.buffer.data);
    const { Location } = await this.uploadFileService
      .upload('course', 'aaaa.png', Buffer.from(courseVideo.buffer.data))
      .catch((error) => {
        console.log(error.message);
      });
    //返回URL
    return Location;
  }
}
