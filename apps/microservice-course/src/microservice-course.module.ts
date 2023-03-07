import { Module } from '@nestjs/common';
import { MicroserviceCourseController } from './microservice-course.controller';
import { UploadFileModule } from '@app/upload-file';
import { ConfigService } from '@nestjs/config';
import { RegisterMicroserviceModule } from '@app/register-microservice';

@Module({
  imports: [UploadFileModule],
  controllers: [MicroserviceCourseController],
  providers: [ConfigService],
})
export class MicroserviceCourseModule {}
