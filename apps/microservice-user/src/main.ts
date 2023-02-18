import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { MicroserviceUserModule } from './microservice-user.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MicroserviceUserModule,
    {
      transport: Transport.TCP,
      options: {
        port: 30000,
      },
    },
  );
  await app.listen();
}
bootstrap();
