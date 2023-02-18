import { Module } from '@nestjs/common';
import { MicroserviceUserController } from './microservice-user.controller';
import { MicroserviceUserService } from './microservice-user.service';
import { GlobalConfigModule } from '@app/global-config';
import { PrismaService } from '../../../libs/prisma/src/prisma.service';

@Module({
  imports: [GlobalConfigModule],
  controllers: [MicroserviceUserController],
  providers: [MicroserviceUserService, PrismaService],
})
export class MicroserviceUserModule {}
