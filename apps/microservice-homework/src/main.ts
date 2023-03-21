import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { MicroserviceHomeworkModule } from './microservice-homework.module';
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MicroserviceHomeworkModule,
    {
      transport: Transport.TCP,
      options: {
        port: 30004,
      },
    },
  );
  await app.listen();
}
bootstrap();
