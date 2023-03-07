import { UploadFileService } from '@app/upload-file/upload-file.service';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { ConfigModule, ConfigService } from '@nestjs/config';
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
  ],
  providers: [UploadFileService, ConfigService],
  exports: [UploadFileService],
})
export class UploadFileModule {}
