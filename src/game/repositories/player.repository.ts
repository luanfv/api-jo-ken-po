import { Injectable } from '@nestjs/common';
import { Player } from '@prisma/client';
import { v4 as uuid } from 'uuid';

import { PrismaService } from '../../databases/prisma.service';

type PlayerPick = 'JO' | 'KEN' | 'PO';

@Injectable()
class PlayerRepository {
  constructor(private prismaService: PrismaService) {}

  async create(gameId: string, username: string) {
    try {
      return await this.prismaService.player.create({
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
      return await this.prismaService.player.findFirst({
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
      return await this.prismaService.player.findMany({
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
      return await this.prismaService.player.update({
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
