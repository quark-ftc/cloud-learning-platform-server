import {
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('course')
export class CourseController {
  constructor(
    @Inject('microserviceCourseClient')
    private readonly microserviceCourseClient: ClientProxy,
  ) {}
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    const url = await firstValueFrom(
      this.microserviceCourseClient.send('upload-course-video', file),
    );
    console.log(file);
    console.log(url);
    return url;
  }
}
