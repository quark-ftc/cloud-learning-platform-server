import { GlobalConfigModule } from '@app/global-config';
import { Module } from '@nestjs/common';
import { AppBffController } from './app-bff.controller';
import { AppBffService } from './app-bff.service';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [GlobalConfigModule, AuthModule],
  controllers: [AppBffController],
  providers: [AppBffService],
})
export class AppBffModule {}
