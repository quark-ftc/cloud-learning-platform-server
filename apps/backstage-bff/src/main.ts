import { NestFactory } from '@nestjs/core';
import { BackstageBffModule } from './backstage-bff.module';

async function bootstrap() {
  const app = await NestFactory.create(BackstageBffModule);
  app.enableCors({ origin: true }); //跨域支持
  await app.listen(3001);
  console.log(
    `Application backstage-bff is now running on: ${await app.getUrl()}`,
  );
}
bootstrap();
