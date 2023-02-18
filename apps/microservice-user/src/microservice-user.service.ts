import { Injectable } from '@nestjs/common';

@Injectable()
export class MicroserviceUserService {
  getHello(): string {
    return 'Hello World!';
  }
}
