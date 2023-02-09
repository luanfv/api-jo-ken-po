import { v4 as uuid } from 'uuid';

import { PlayerEntity } from './player/player.entity';

class GameEntity {
  id: string;
  player1: PlayerEntity;
  player2: PlayerEntity;
  winner: string | undefined;
  finish: boolean;

  constructor() {
    this.id = uuid();
    this.finish = false;
  }

  result() {
    if (!this.player1.response || !this.player2.response) {
      return this;
    }

    this.finish = true;

    if (this.player1.response === this.player2.response) {
      return this;
    }

    if (this.player1.response === 'JO' && this.player2.response === 'PO') {
      this.winner = this.player1.username;

      return this;
    }

    if (this.player1.response === 'KEN' && this.player2.response === 'JO') {
      this.winner = this.player1.username;

      return this;
    }

    if (this.player1.response === 'PO' && this.player2.response === 'KEN') {
      this.winner = this.player1.username;

      return this;
    }

    this.winner = this.player2.username;

    return this;
  }

  restart() {
    this.finish = false;
    this.player1.response = undefined;
    this.player2.response = undefined;
    this.winner = undefined;
  }
}

export { GameEntity };
