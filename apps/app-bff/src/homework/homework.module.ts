import { Module } from '@nestjs/common';
import { HomeworkController } from './homework.controller';
import { UploadFileModule } from '@app/upload-file';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    UploadFileModule,
    ConfigModule.forRoot({
      envFilePath: '../../../../.env',
    }),
  ],
  controllers: [HomeworkController],
})
export class HomeworkModule {}
