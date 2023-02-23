import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { MicroserviceRoleModule } from './microservice-role.module';
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MicroserviceRoleModule,
    {
      transport: Transport.TCP,
      options: {
        port: 30001,
      },
    },
  );
  await app.listen();
}
bootstrap();
