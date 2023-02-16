import { Injectable } from '@nestjs/common';

@Injectable()
export class BackstateBffService {
  getHello(): string {
    return 'Hello World!';
  }
}
