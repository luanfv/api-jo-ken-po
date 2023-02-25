import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { prisma } from '../databases/prisma';
import { GameEntity } from './game.entity';

@Injectable()
class GameRepository {
  async create() {
    return await prisma.game.create({ data: new GameEntity() });
  }

  async read(findArgs: Prisma.GameFindFirstArgs) {
    return await prisma.game.findFirst(findArgs);
  }

  async update(updateArgs: Prisma.GameUpdateArgs) {
    return await prisma.game.update(updateArgs);
  }
}

export { GameRepository };
