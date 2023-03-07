import { Module } from '@nestjs/common';
import { MicroserviceClassController } from './microservice-class.controller';
import { PrismaModule } from '../../../libs/prisma/src/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MicroserviceClassController],
  providers: [],
})
export class MicroserviceClassModule {}
