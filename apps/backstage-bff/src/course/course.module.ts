import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { MulterModule } from '@nestjs/platform-express';
import { CourseService } from './course.service';
@Module({
  imports: [MulterModule],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
