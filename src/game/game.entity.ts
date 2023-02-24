import { v4 as uuid } from 'uuid';

import { PlayerEntity } from './player/player.entity';

class GameEntity {
  readonly id: string;
  readonly winner_id: string | undefined;
  readonly is_game_over: boolean;

  constructor(gameId?: string) {
    this.id = gameId ?? uuid();
    this.is_game_over = false;
  }
}

export { GameEntity };
