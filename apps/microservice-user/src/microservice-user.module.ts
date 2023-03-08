import { Module } from '@nestjs/common';
import { MicroserviceUserController } from './microservice-user.controller';
// import { PrismaService } from '../../../libs/prisma/src/prisma.service';
import { PrismaModule } from '../../../libs/prisma/src/prisma.module';
import { UploadFileModule } from '@app/upload-file';
@Module({
  imports: [PrismaModule, UploadFileModule],
  controllers: [MicroserviceUserController],
  providers: [],
})
export class MicroserviceUserModule {}
