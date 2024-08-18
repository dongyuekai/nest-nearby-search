import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 指定public目录为静态文件的目录
  app.useStaticAssets('public');

  await app.listen(3000);
}
bootstrap();
