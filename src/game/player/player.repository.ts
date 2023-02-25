import { Injectable } from '@nestjs/common';

import { prisma } from '../../databases/prisma';
import { PlayerEntity } from './player.entity';
import { Prisma } from '@prisma/client';

@Injectable()
class PlayerRepository {
  async create(gameId: string, username: string) {
    return await prisma.player.create({
      data: new PlayerEntity(gameId, username),
    });
  }

  async read(readArgs: Prisma.PlayerFindFirstArgs) {
    return await prisma.player.findFirst(readArgs);
  }

  async readAll(readAllArgs: Prisma.PlayerFindManyArgs) {
    return await prisma.player.findMany(readAllArgs);
  }

  async update(updateArgs: Prisma.PlayerUpdateArgs) {
    return await prisma.player.update(updateArgs);
  }

  async updateAll(updateAllArgs: Prisma.PlayerUpdateManyArgs) {
    return await prisma.player.updateMany(updateAllArgs);
  }
}

export { PlayerRepository };
