import { v4 as uuid } from 'uuid';

type JoKenPo = 'JO' | 'KEN' | 'PO';

class PlayerEntity {
  readonly id: string;
  readonly username: string;
  readonly pick: JoKenPo | undefined;
  readonly game_id: string;

  constructor(gameId: string, username: string) {
    this.game_id = gameId;
    this.username = username;
    this.id = uuid();
  }
}

export { PlayerEntity, JoKenPo };
