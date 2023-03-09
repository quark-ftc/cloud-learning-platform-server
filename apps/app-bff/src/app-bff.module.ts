import { Module } from '@nestjs/common';
import { AppBffController } from './app-bff.controller';
import { AppBffService } from './app-bff.service';
import { AuthModule } from './auth/auth.module';
import { RegisterMicroserviceModule } from '../../../libs/register-microservice/src/register-microservice.module';
import { ConfigModule } from '@nestjs/config';
import { ClassModule } from './class/class.module';
import { CourseModule } from './course/course.module';
@Module({
  imports: [
    AuthModule,
    RegisterMicroserviceModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClassModule,
    CourseModule,
  ],
  controllers: [AppBffController],
  providers: [AppBffService],
})
export class AppBffModule {}
