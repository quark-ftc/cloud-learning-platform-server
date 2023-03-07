import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { MicroserviceClassModule } from './microservice-class.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MicroserviceClassModule,
    {
      transport: Transport.TCP,
      options: {
        port: 30003,
      },
    },
  );
  await app.listen();
}
bootstrap();
