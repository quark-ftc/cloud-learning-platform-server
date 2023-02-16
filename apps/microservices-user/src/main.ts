import { NestFactory } from '@nestjs/core';
import { MicroservicesUserModule } from './microservices-user.module';

async function bootstrap() {
  const app = await NestFactory.create(MicroservicesUserModule);
  await app.listen(30000);
}
bootstrap();
