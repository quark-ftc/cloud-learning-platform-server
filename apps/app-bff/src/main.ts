import { NestFactory } from '@nestjs/core';
import { AppBffModule } from './app-bff.module';

async function bootstrap() {
  const app = await NestFactory.create(AppBffModule);
  await app.listen(3000);
  app.enableCors({ origin: true }); //跨域支持
  console.log(`Application app-bff is now running on ${await app.getUrl()}`);
}
bootstrap();
