import { Injectable } from '@nestjs/common';

@Injectable()
export class MicroserviceCourseService {
  getHello(): string {
    return 'Hello World!';
  }
}
