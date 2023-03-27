import { Module } from '@nestjs/common';
import { MicroserviceSystemController } from './microservice-system.controller';
import { ConfigModule } from '@nestjs/config';
import { MicroserviceSystemService } from './microservice-system.service';
@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [MicroserviceSystemController],
  providers: [MicroserviceSystemService],
})
export class MicroserviceSystemModule {}
