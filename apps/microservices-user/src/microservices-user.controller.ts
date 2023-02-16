import { Controller, Get } from '@nestjs/common';
import { MicroservicesUserService } from './microservices-user.service';

@Controller()
export class MicroservicesUserController {
  constructor(private readonly microservicesUserService: MicroservicesUserService) {}

  @Get()
  getHello(): string {
    return this.microservicesUserService.getHello();
  }
}
