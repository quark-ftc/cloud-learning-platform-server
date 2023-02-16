import { Injectable } from '@nestjs/common';

@Injectable()
export class MicroservicesUserService {
  getHello(): string {
    return 'Hello World!';
  }
}
