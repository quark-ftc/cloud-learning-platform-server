import { Module } from '@nestjs/common';
import { BackstateBffController } from './backstate-bff.controller';
import { BackstateBffService } from './backstate-bff.service';

@Module({
  imports: [],
  controllers: [BackstateBffController],
  providers: [BackstateBffService],
})
export class BackstateBffModule {}
