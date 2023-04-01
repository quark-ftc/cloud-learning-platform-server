import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as tencentcloud from 'tencentcloud-sdk-nodejs';
@Injectable()
export class MicroserviceSystemService {
  constructor(private readonly configService: ConfigService) {}
  //腾讯云监控客户端实例
  private readonly MonitorClient = tencentcloud.monitor.v20180724.Client;
  //认证对象
  private clientConfig = {
    credential: {
      secretId: 'SecretId',
      secretKey: 'SecretKey',
    },
    region: 'ap-shanghai',
    profile: {
      httpProfile: {
        endpoint: 'monitor.tencentcloudapi.com',
      },
    },
  };
  //请求参数
  private params = {
    Namespace: 'QCE/LIGHTHOUSE',
    MetricName: '',
    Period: 300,
    Instances: [
      {
        Dimensions: [
          {
            Name: 'InstanceId',
            Value: 'lhins-9k8m73nm',
          },
        ],
      },
    ],
  };
  //请求对象
  async getClient() {
    this.clientConfig.credential.secretId = await this.configService.get(
      'SecretId',
    );
    this.clientConfig.credential.secretKey = await this.configService.get(
      'SecretKey',
    );
    const client = new this.MonitorClient(this.clientConfig);
    return client;
  }
  /**
   *
   * @param metricName 监控指标的名称，例如：CpuUsage
   * https://cloud.tencent.com/document/product/248/60127
   */
  getParams(metricName: string) {
    this.params.MetricName = metricName;
    return this.params;
  }
}
