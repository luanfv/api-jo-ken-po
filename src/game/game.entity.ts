import { Game } from '@prisma/client';
import { v4 as uuid } from 'uuid';

class GameEntity implements Game {
  readonly id: string;
  readonly winner_id: string | undefined;
  readonly is_game_over: boolean;
  readonly created_at: Date;

  constructor() {
    this.id = uuid();
    this.is_game_over = false;
  }
}

export { GameEntity };
