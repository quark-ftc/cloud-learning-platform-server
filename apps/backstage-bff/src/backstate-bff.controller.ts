import { Controller, Get } from '@nestjs/common';
import { BackstateBffService } from './backstate-bff.service';

@Controller()
export class BackstateBffController {
  constructor(private readonly backstateBffService: BackstateBffService) {}

  @Get()
  getHello(): string {
    return this.backstateBffService.getHello();
  }
}
