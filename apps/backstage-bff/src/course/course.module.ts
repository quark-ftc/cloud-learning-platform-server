import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { MulterModule } from '@nestjs/platform-express';
@Module({
  imports: [MulterModule],
  controllers: [CourseController],
  providers: [],
})
export class CourseModule {}
