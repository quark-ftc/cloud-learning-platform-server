import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../libs/prisma/src/prisma.module';
import { MicroserviceRoleController } from './microservice-role.controller';

@Module({
  imports: [PrismaModule],
  controllers: [MicroserviceRoleController],
  providers: [],
})
export class MicroserviceRoleModule {}
