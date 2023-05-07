import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { GameModule } from '../game.module';
import { GameRepository } from '../repositories/game.repository';

describe('AppController (Integration)', () => {
  let app: INestApplication;
  let gameRepository: GameRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GameModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    gameRepository = module.get<GameRepository>(GameRepository);
  });

  it('SHOULD can insert in database', async () => {
    const game = await gameRepository.create();

    expect(game).toBeTruthy();
  });
});
