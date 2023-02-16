import { v4 as uuid } from 'uuid';

import { JoKenPo, PlayerEntity } from './player/player.entity';

class GameEntity {
  id: string;
  player1: PlayerEntity | undefined;
  player2: PlayerEntity | undefined;
  winner: string | undefined;
  isGamOver: boolean;

  constructor() {
    this.id = uuid();
    this.isGamOver = false;
  }

  playerPick(username: string, pick: JoKenPo): boolean {
    if (this.player1 || this.player2) {
      if (this.player1 && this.player1.username === username) {
        this.player1.pick = pick;

        return true;
      }

      if (this.player2 && this.player2.username === username) {
        this.player2.pick = pick;

        return true;
      }
    }

    return false;
  }

  result() {
    if (!this.player1 || !this.player1.pick) {
      return;
    }

    if (!this.player2 || !this.player2.pick) {
      return;
    }

    this.isGamOver = true;

    if (this.player1.pick === this.player2.pick) {
      return;
    }

    if (this.player1.pick === 'JO' && this.player2.pick === 'PO') {
      this.winner = this.player1.username;

      return;
    }

    if (this.player1.pick === 'KEN' && this.player2.pick === 'JO') {
      this.winner = this.player1.username;

      return;
    }

    if (this.player1.pick === 'PO' && this.player2.pick === 'KEN') {
      this.winner = this.player1.username;

      return;
    }

    this.winner = this.player2.username;

    return;
  }

  restart() {
    this.isGamOver = false;

    if (this.player1) {
      this.player1.pick = undefined;
    }

    if (this.player2) {
      this.player2.pick = undefined;
    }

    this.winner = undefined;
  }
}

export { GameEntity };
