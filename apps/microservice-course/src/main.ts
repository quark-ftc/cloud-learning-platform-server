import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { MicroserviceCourseModule } from './microservice-course.module';
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MicroserviceCourseModule,
    {
      transport: Transport.TCP,
      options: {
        port: 30002,
      },
    },
  );
  await app.listen();
}
bootstrap();
