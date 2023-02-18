import { Global, Module } from '@nestjs/common';
import { GlobalConfigService } from './global-config.service';
import { ConfigModule } from '@nestjs/config';
import { globalConfig } from './config';
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [...globalConfig],
      isGlobal: true,
    }),
  ],
  providers: [GlobalConfigService],
  exports: [GlobalConfigService, ConfigModule],
})
export class GlobalConfigModule {}
