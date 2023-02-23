import { Controller, Get } from '@nestjs/common';
import { BackstageBffService } from './backstage-bff.service';

@Controller()
export class BackstageBffController {
  constructor(private readonly backstageBffService: BackstageBffService) {}

  @Get()
  getHello(): string {
    return this.backstageBffService.getHello();
  }
}
