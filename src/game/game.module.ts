import { Module } from '@nestjs/common';

import { GameController } from './game.controller';
import { GameRepository } from './game.repository';
import { JoKenPoValidator } from './validator/is-jo-ken-po.validator';

@Module({
  controllers: [GameController],
  providers: [GameRepository, JoKenPoValidator],
})
class GameModule {}

export { GameModule };
