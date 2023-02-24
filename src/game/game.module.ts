import { Module } from '@nestjs/common';

import { GameController } from './game.controller';
import { GameRepository } from './game.repository';
import { JoKenPoValidator } from './validator/is-jo-ken-po.validator';
import { GameService } from './game.service';
import { PlayerRepository } from './player/player.repository';

@Module({
  controllers: [GameController],
  providers: [GameRepository, JoKenPoValidator, GameService, PlayerRepository],
})
class GameModule {}

export { GameModule };
