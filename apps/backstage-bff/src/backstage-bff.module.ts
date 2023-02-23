import { Module } from '@nestjs/common';
import { BackstageBffController } from './backstage-bff.controller';
import { BackstageBffService } from './backstage-bff.service';
import { AuthModule } from './auth/auth.module';
import { RegisterMicroserviceModule } from '@app/register-microservice';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    AuthModule,
    RegisterMicroserviceModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [BackstageBffController],
  providers: [BackstageBffService],
})
export class BackstageBffModule {}
