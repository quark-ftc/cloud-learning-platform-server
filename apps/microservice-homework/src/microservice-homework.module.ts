import { Module } from '@nestjs/common';
import { MicroserviceHomeworkController } from './microservice-homework.controller';
import { PrismaModule } from '../../../libs/prisma/src/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MicroserviceHomeworkController],
  providers: [],
})
export class MicroserviceHomeworkModule {}
