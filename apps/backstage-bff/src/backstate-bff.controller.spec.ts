import { Test, TestingModule } from '@nestjs/testing';
import { BackstateBffController } from './backstate-bff.controller';
import { BackstateBffService } from './backstate-bff.service';

describe('BackstateBffController', () => {
  let backstateBffController: BackstateBffController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BackstateBffController],
      providers: [BackstateBffService],
    }).compile();

    backstateBffController = app.get<BackstateBffController>(BackstateBffController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(backstateBffController.getHello()).toBe('Hello World!');
    });
  });
});
