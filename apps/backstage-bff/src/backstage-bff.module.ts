import { RegisterMicroserviceModule } from '@app/register-microservice';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BackstageBffController } from './backstage-bff.controller';
import { BackstageBffService } from './backstage-bff.service';
import { CourseModule } from './course/course.module';
import { SystemModule } from './system/system.module';

@Module({
  imports: [
    CourseModule,
    AuthModule,
    RegisterMicroserviceModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SystemModule,
  ],
  controllers: [BackstageBffController],
  providers: [BackstageBffService],
})
export class BackstageBffModule {}
