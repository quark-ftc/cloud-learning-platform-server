import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const COS = require('cos-nodejs-sdk-v5');
@Injectable()
export class UploadFileService {
  constructor(private readonly configService: ConfigService) {}
  private cos = new COS({
    // 必选参数
    SecretId: this.configService.get('SecretId'),
    SecretKey: this.configService.get('SecretKey'),
    // 可选参数
    FileParallelLimit: 3, // 控制文件上传并发数
    ChunkParallelLimit: 8, // 控制单个文件下分片上传并发数，在同园区上传可以设置较大的并发数
    ChunkSize: 1024 * 1024 * 8, // 控制分片大小，单位 B，在同园区上传可以设置较大的分片大小
  });
  async upload(directory: string, key: string, body: Buffer) {
    return await this.cos.putObject({
      Bucket: this.configService.get('Bucket'),
      Region: this.configService.get('Region'),
      Key: directory + '/' + key,
      Body: body,
      onProgress: function (progressData) {
        console.log(JSON.stringify(progressData));
      },
    });
  }
}
