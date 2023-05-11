import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { v4 as uuid } from 'uuid';

import { GameModule } from '../game.module';
import { Game } from '../repositories/game.repository';
import { prisma } from '../../databases/prisma';

describe('GameController (Integration)', () => {
  let app: INestApplication;
  let gameToTest: Game;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GameModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    gameToTest = await prisma.game.create({
      data: {
        id: uuid(),
        is_game_over: false,
      },
    });
  });

  afterEach(async () => {
    await prisma.player.deleteMany({
      where: {
        game_id: gameToTest.id,
      },
    });

    await prisma.game.deleteMany({
      where: {
        id: gameToTest.id,
      },
    });
  });

  describe('POST /games', () => {
    describe('WHEN can create new game', () => {
      it('SHOULD return CREATED with new game', async () => {
        const result = await request(app.getHttpServer())
          .post('/games')
          .expect(HttpStatus.CREATED);

        expect(result.body).toEqual({
          id: expect.anything(),
          is_game_over: false,
          winner_id: null,
          created_at: expect.anything(),
        });
      });
    });
  });

  describe('GET /games/:gameId', () => {
    describe('WHEN find the game', () => {
      it('SHOULD return OK with the game', async () => {
        const result = await request(app.getHttpServer())
          .get(`/games/${gameToTest.id}`)
          .expect(HttpStatus.OK);

        expect(result.body).toEqual({
          id: gameToTest.id,
          is_game_over: gameToTest.is_game_over,
          winner_id: gameToTest.winner_id,
          created_at: expect.anything(),
        });
      });
    });

    describe('WHEN not find the game', () => {
      it('SHOULD return NOT FOUND', async () => {
        await request(app.getHttpServer())
          .get('/games/id-invalid')
          .expect(HttpStatus.NOT_FOUND);
      });
    });
  });

  describe('PUT /games/:gameId/restart', () => {
    describe('WHEN can restart the game', () => {
      it('SHOULD return OK with the game updated', async () => {
        const result = await request(app.getHttpServer())
          .put(`/games/${gameToTest.id}/restart`)
          .expect(HttpStatus.OK);

        expect(result.body).toEqual({
          id: gameToTest.id,
          is_game_over: gameToTest.is_game_over,
          winner_id: gameToTest.winner_id,
          created_at: expect.anything(),
        });
      });
    });

    describe('WHEN cannot restart the game', () => {
      it('SHOULD return NOT FOUND', async () => {
        await request(app.getHttpServer())
          .put('/games/id-invalid/restart')
          .expect(HttpStatus.NOT_FOUND);
      });
    });
  });

  describe('PUT /games/:gameId/finish', () => {
    describe('WHEN cannot finish the game because game is not found', () => {
      it('SHOULD return NOT FOUND', async () => {
        await request(app.getHttpServer())
          .put('/games/id-invalid/finish')
          .expect(HttpStatus.NOT_FOUND);
      });
    });

    describe('WHEN cannot finish the game because game is already finished', () => {
      it('SHOULD return BAD REQUEST', async () => {
        await request(app.getHttpServer())
          .put(`/games/${gameToTest.id}/finish`)
          .expect(HttpStatus.BAD_REQUEST);
      });
    });

    describe('WHEN cannot finish the game because game not enough players', () => {
      it('SHOULD return BAD REQUEST', async () => {
        await request(app.getHttpServer())
          .put(`/games/${gameToTest.id}/finish`)
          .expect(HttpStatus.BAD_REQUEST);
      });
    });

    describe('WHEN cannot finish the game because game not all players pick', () => {
      it('SHOULD return BAD REQUEST', async () => {
        await prisma.player.createMany({
          data: [
            {
              game_id: gameToTest.id,
              username: 'Player1',
              id: uuid(),
            },
            {
              game_id: gameToTest.id,
              username: 'Player2',
              id: uuid(),
              pick: 'JO',
            },
          ],
        });

        await request(app.getHttpServer())
          .put(`/games/${gameToTest.id}/finish`)
          .expect(HttpStatus.BAD_REQUEST);
      });
    });

    describe('WHEN can finish the game', () => {
      it('SHOULD return OK with the game', async () => {
        await prisma.player.createMany({
          data: [
            {
              game_id: gameToTest.id,
              username: 'Player1',
              id: '1',
              pick: 'KEN',
            },
            {
              game_id: gameToTest.id,
              username: 'Player2',
              id: '2',
              pick: 'JO',
            },
          ],
        });

        const result = await request(app.getHttpServer())
          .put(`/games/${gameToTest.id}/finish`)
          .expect(HttpStatus.OK);

        expect(result.body).toEqual({
          id: gameToTest.id,
          is_game_over: true,
          winner_id: '1',
          created_at: expect.anything(),
        });
      });
    });
  });
});
