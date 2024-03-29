import { Module } from '@nestjs/common';

import { GameController } from './controllers/game.controller';
import { GameRepository } from './repositories/game.repository';
import { JoKenPoValidator } from './validators/is-jo-ken-po.validator';
import { GameService } from './services/game.service';
import { PlayerRepository } from './repositories/player.repository';
import { DatabasesModule } from '../databases/databases.module';

@Module({
  imports: [DatabasesModule],
  controllers: [GameController],
  providers: [GameRepository, JoKenPoValidator, GameService, PlayerRepository],
})
class GameModule {}

export { GameModule };
