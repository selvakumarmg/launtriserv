import { Test, TestingModule } from '@nestjs/testing';
import { UserservController } from './userserv.controller';
import { UserservService } from './userserv.service';

describe('UserservController', () => {
  let userservController: UserservController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserservController],
      providers: [UserservService],
    }).compile();

    userservController = app.get<UserservController>(UserservController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(userservController.getHello()).toBe('Hello World!');
    });
  });
});
