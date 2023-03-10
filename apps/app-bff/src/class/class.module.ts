import { Module } from '@nestjs/common';
import { ClassController } from './class.controller';

@Module({
  controllers: [ClassController],
  providers: [],
})
export class ClassModule {}
