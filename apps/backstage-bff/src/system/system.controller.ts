import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { MessageChannel } from 'worker_threads';

import { ConfigService } from '@nestjs/config';

@Controller('system')
export class SystemController {
  @Inject('microserviceSystemClient')
  private readonly microserviceSystemClient: ClientProxy;

  //https://cloud.tencent.com/document/product/248/60127
  //参数列表
  @Post('server-monitor')
  async serverMonitor(@Body() { metricName }) {
    try {
      const result = await firstValueFrom(
        this.microserviceSystemClient.send('server-monitor', metricName),
      );
      return {
        status: 'success',
        message: `请求监控指标${metricName}成功`,
        data: {
          serverMonitorDate: result,
        },
      };
      return result;
    } catch (error) {
      return {
        status: 'failure',
        message: `请求监控指标${metricName}失败：${error.message}`,
      };
    }
  }
}
