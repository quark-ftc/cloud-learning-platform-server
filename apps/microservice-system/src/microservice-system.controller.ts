import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MessagePattern } from '@nestjs/microservices';
import { MicroserviceSystemService } from './microservice-system.service';
@Controller()
export class MicroserviceSystemController {
  constructor(
    private readonly microserviceSystemService: MicroserviceSystemService,
  ) {}
  @MessagePattern('server-monitor')
  async serverMonitor(metricName: string) {
    console.log(metricName);
    const params = this.microserviceSystemService.getParams(metricName);
    const client = await this.microserviceSystemService.getClient();
    return await client.GetMonitorData(params);
  }
}
