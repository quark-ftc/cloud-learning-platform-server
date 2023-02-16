import { Module } from '@nestjs/common';
import { MicroservicesUserController } from './microservices-user.controller';
import { MicroservicesUserService } from './microservices-user.service';

@Module({
  imports: [],
  controllers: [MicroservicesUserController],
  providers: [MicroservicesUserService],
})
export class MicroservicesUserModule {}
