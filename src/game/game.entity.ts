import { v4 as uuid } from 'uuid';

import { PlayerEntity } from './player/player.entity';

class GameEntity {
  id: string;
  player1: PlayerEntity;
  player2: PlayerEntity;

  constructor() {
    this.id = uuid();
  }
}

export { GameEntity };
