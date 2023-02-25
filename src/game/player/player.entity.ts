import { Player } from '@prisma/client';
import { v4 as uuid } from 'uuid';

type PlayerPick = 'JO' | 'KEN' | 'PO';

class PlayerEntity implements Player {
  readonly id: string;
  readonly username: string;
  readonly pick: PlayerPick | undefined;
  readonly game_id: string;
  readonly created_at: Date;

  constructor(gameId: string, username: string) {
    this.game_id = gameId;
    this.username = username;
    this.id = uuid();
  }
}

export { PlayerEntity, PlayerPick };
