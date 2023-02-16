import { Test, TestingModule } from '@nestjs/testing';
import { AppBffController } from './app-bff.controller';
import { AppBffService } from './app-bff.service';

describe('AppBffController', () => {
  let appBffController: AppBffController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppBffController],
      providers: [AppBffService],
    }).compile();

    appBffController = app.get<AppBffController>(AppBffController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appBffController.getHello()).toBe('Hello World!');
    });
  });
});
