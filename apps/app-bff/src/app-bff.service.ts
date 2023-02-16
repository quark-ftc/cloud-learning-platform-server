import { Injectable } from '@nestjs/common';

@Injectable()
export class AppBffService {
  getHello(): string {
    return 'Hello World!';
  }
}
