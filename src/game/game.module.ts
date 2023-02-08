import { Module } from '@nestjs/common';

import { GameController } from './game.controller';
import { GameRepository } from './game.repository';

@Module({
  controllers: [GameController],
  providers: [GameRepository],
})
class GameModule {}

export { GameModule };
