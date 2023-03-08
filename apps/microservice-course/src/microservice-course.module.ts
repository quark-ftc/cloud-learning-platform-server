import { UploadFileModule } from '@app/upload-file';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceCourseController } from './microservice-course.controller';

@Module({
  imports: [UploadFileModule],
  controllers: [MicroserviceCourseController],
  providers: [ConfigService],
})
export class MicroserviceCourseModule {}
