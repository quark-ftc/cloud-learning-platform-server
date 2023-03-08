import { Controller } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MessagePattern } from '@nestjs/microservices';
import { UploadFileService } from '../../../libs/upload-file/src/upload-file.service';

@Controller()
export class MicroserviceCourseController {
  constructor(
    private readonly uploadFileService: UploadFileService,
    private readonly configService: ConfigService,
  ) {}
  @MessagePattern('upload-course-video')
  async uploadCourseVideo(folder: string, key: string, courseVideo) {
    // console.log(courseVideo.buffer.data);
    const { Location } = await this.uploadFileService
      .upload(folder, key, Buffer.from(courseVideo.buffer.data))
      .catch((error) => {
        console.log(error.message);
      });
    //返回URL
    return Location;
  }
}
