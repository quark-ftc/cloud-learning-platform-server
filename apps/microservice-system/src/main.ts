import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { MicroserviceSystemModule } from './microservice-system.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MicroserviceSystemModule,
    {
      transport: Transport.TCP,
      options: {
        port: 30005,
      },
    },
  );
  await app.listen();
}
bootstrap();
