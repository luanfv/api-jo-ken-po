import { Injectable } from '@nestjs/common';

import { prisma } from '../../databases/prisma';
import { JoKenPo, PlayerEntity } from './player.entity';
import { Prisma } from '@prisma/client';

@Injectable()
class PlayerRepository {
  async create(gameId: string, username: string) {
    return await prisma.player.create({
      data: new PlayerEntity(username, gameId),
    });
  }

  async getByGameId(gameId: string, where?: Prisma.PlayerWhereInput) {
    return await prisma.player.findMany({
      where: {
        game_id: gameId,
        ...where,
      },
    });
  }

  async getById(id: string) {
    return await prisma.player.findFirst({
      where: {
        id: id,
      },
    });
  }

  async setPick(id: string, pick: JoKenPo) {
    await prisma.player.update({
      where: {
        id: id,
      },
      data: {
        pick: pick,
      },
    });
  }
}

export { PlayerRepository };
