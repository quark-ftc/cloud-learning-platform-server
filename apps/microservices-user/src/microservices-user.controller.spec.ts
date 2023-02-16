import { Test, TestingModule } from '@nestjs/testing';
import { MicroservicesUserController } from './microservices-user.controller';
import { MicroservicesUserService } from './microservices-user.service';

describe('MicroservicesUserController', () => {
  let microservicesUserController: MicroservicesUserController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MicroservicesUserController],
      providers: [MicroservicesUserService],
    }).compile();

    microservicesUserController = app.get<MicroservicesUserController>(MicroservicesUserController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(microservicesUserController.getHello()).toBe('Hello World!');
    });
  });
});
