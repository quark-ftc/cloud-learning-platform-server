import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class GlobalConfigService {
  constructor(public readonly configService: ConfigService) {}
}
