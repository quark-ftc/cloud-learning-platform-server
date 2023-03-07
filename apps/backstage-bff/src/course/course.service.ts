import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CourseService {
  constructor(
    @Inject('microserviceCourseClient')
    private readonly microserviceCourseClient: ClientProxy,
  ) {}
  async upload(file: Express.Multer.File) {
    // console.log(file);
    await firstValueFrom(
      this.microserviceCourseClient.send('upload-course-video', file),
    ).catch((error) => {
      console.log(error.message);
    });
  }
}
