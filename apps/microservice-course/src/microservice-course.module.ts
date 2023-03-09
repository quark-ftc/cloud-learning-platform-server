import { UploadFileModule } from '@app/upload-file';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceCourseController } from './microservice-course.controller';
import { PrismaModule } from '../../../libs/prisma/src/prisma.module';

@Module({
  imports: [UploadFileModule, PrismaModule],
  controllers: [MicroserviceCourseController],
  providers: [ConfigService],
})
export class MicroserviceCourseModule {}
