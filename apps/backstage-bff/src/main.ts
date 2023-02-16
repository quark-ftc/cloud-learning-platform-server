import { NestFactory } from '@nestjs/core';
import { BackstateBffModule } from './backstate-bff.module';

async function bootstrap() {
  const app = await NestFactory.create(BackstateBffModule);
  await app.listen(3001);
}
bootstrap();
