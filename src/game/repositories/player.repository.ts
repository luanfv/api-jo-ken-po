import { Injectable } from '@nestjs/common';
import { Player } from '@prisma/client';
import { v4 as uuid } from 'uuid';

import { prisma } from '../../databases/prisma';

type PlayerPick = 'JO' | 'KEN' | 'PO';

@Injectable()
class PlayerRepository {
  async create(gameId: string, username: string) {
    try {
      return await prisma.player.create({
        data: {
          id: uuid(),
          game_id: gameId,
          username: username,
        },
      });
    } catch {
      return null;
    }
  }

  async getByIdAndGameId(username: string, gameId: string) {
    try {
      return await prisma.player.findFirst({
        where: {
          game_id: gameId,
          username,
        },
      });
    } catch {
      return null;
    }
  }

  async getByGameId(gameId: string) {
    try {
      return await prisma.player.findMany({
        where: {
          game_id: gameId,
        },
      });
    } catch {
      return null;
    }
  }

  async setPickById(playerId: string, pick: PlayerPick) {
    try {
      return await prisma.player.update({
        where: {
          id: playerId,
        },
        data: {
          pick: pick,
        },
      });
    } catch {
      return null;
    }
  }
}

export { PlayerRepository, Player, PlayerPick };
