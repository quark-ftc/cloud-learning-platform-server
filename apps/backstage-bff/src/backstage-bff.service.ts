import { Injectable } from '@nestjs/common';

@Injectable()
export class BackstageBffService {
  getHello(): string {
    return 'Hello World!';
  }
}
