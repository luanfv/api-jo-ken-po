import { Injectable } from '@nestjs/common';
import { Game } from '@prisma/client';
import { v4 as uuid } from 'uuid';

import { PrismaService } from '../../databases/prisma.service';

@Injectable()
class GameRepository {
  constructor(private prismaService: PrismaService) {}

  async create() {
    try {
      return await this.prismaService.game.create({
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
      return await this.prismaService.game.findFirst({
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
      return await this.prismaService.game.update({
        data: {
          is_game_over: true,
          is_ready: true,
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

  async setReadyById(gameId: string, isReady: boolean) {
    try {
      return await this.prismaService.game.update({
        data: {
          is_ready: isReady,
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
