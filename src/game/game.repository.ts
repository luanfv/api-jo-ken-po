import { Injectable } from '@nestjs/common';
import { Game } from '@prisma/client';
import { v4 as uuid } from 'uuid';

import { prisma } from '../databases/prisma';

@Injectable()
class GameRepository {
  async create() {
    try {
      return await prisma.game.create({
        data: {
          id: uuid(),
          is_game_over: false,
        },
      });
    } catch {
      return null;
    }
  }

  async getById(gameId: string) {
    try {
      return await prisma.game.findFirst({
        where: {
          id: gameId,
        },
      });
    } catch {
      return null;
    }
  }

  async restartById(gameId: string) {
    try {
      return await prisma.game.update({
        data: {
          is_game_over: false,
          players: {
            updateMany: {
              data: {
                pick: null,
              },
              where: {
                game_id: gameId,
              },
            },
          },
        },
        where: {
          id: gameId,
        },
      });
    } catch {
      return null;
    }
  }

  async setWinnerById(gameId: string, winnerId: string) {
    try {
      return await prisma.game.update({
        data: {
          is_game_over: true,
          winner_id: winnerId,
        },
        where: {
          id: gameId,
        },
      });
    } catch {
      return null;
    }
  }
}

export { GameRepository, Game };
