import { NestFactory } from '@nestjs/core';
import { BackstateBffModule } from './backstate-bff.module';

async function bootstrap() {
  const app = await NestFactory.create(BackstateBffModule);
  app.enableCors({ origin: true }); //跨域支持
  await app.listen(3001);
  console.log(
    `Application backstage-bff is now running on: ${await app.getUrl()}`,
  );
}
bootstrap();
