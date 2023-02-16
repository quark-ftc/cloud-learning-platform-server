import { Module } from '@nestjs/common';
import { AppBffController } from './app-bff.controller';
import { AppBffService } from './app-bff.service';

@Module({
  imports: [],
  controllers: [AppBffController],
  providers: [AppBffService],
})
export class AppBffModule {}
