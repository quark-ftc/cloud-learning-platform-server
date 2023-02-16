import { Controller, Get } from '@nestjs/common';
import { AppBffService } from './app-bff.service';

@Controller()
export class AppBffController {
  constructor(private readonly appBffService: AppBffService) {}

  @Get()
  getHello(): string {
    return this.appBffService.getHello();
  }
}
