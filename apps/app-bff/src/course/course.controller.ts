import { Controller, Post, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('course')
export class CourseController {
  constructor(
    @Inject('microserviceCourseClient')
    private readonly microserviceCourseClient: ClientProxy,
  ) {}
  @Post('get-course-list')
  async getCourseList() {
    try {
      const courseList = await firstValueFrom(
        this.microserviceCourseClient.send('find-all-course', ''),
      );
      return {
        status: 'success',
        message: '获取用户列表成功',
        data: {
          courseList,
        },
      };
    } catch (error) {
      return {
        status: 'failure',
        message: `获取用户列表失败: ${error.message}`,
      };
    }
  }
}
