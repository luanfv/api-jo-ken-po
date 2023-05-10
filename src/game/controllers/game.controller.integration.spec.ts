import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { GameModule } from '../game.module';
import { GameRepository } from '../repositories/game.repository';

describe('GameController (Integration)', () => {
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

  describe('GET /games/:gameId', () => {
    describe('WHEN find the game', () => {
      it('SHOULD return OK with the game', async () => {
        const foundGame = await gameRepository.create();

        const result = await request(app.getHttpServer())
          .get(`/games/${foundGame.id}`)
          .expect(200);

        expect(result.body).toEqual({
          id: foundGame.id,
          is_game_over: foundGame.is_game_over,
          winner_id: foundGame.winner_id,
          created_at: expect.anything(),
        });
      });
    });

    describe('WHEN not find the game', () => {
      it('SHOULD return NOT FOUND', async () => {
        await request(app.getHttpServer()).get('/games/id-invalid').expect(404);
      });
    });
  });
});
