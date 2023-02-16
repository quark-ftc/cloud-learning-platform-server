import { NestFactory } from '@nestjs/core';
import { AppBffModule } from './app-bff.module';

async function bootstrap() {
  const app = await NestFactory.create(AppBffModule);
  await app.listen(3000);
}
bootstrap();
