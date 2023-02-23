import { Module } from '@nestjs/common';
import { AppBffController } from './app-bff.controller';
import { AppBffService } from './app-bff.service';
import { AuthModule } from './auth/auth.module';
import { RegisterMicroserviceModule } from '../../../libs/register-microservice/src/register-microservice.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    AuthModule,
    RegisterMicroserviceModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppBffController],
  providers: [AppBffService],
})
export class AppBffModule {}
