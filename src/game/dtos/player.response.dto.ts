import { ApiProperty } from '@nestjs/swagger';

import { Player } from '../repositories/player.repository';

class PlayerResponse implements Player {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  pick: string;

  @ApiProperty()
  game_id: string;

  @ApiProperty()
  created_at: Date;
}

export { PlayerResponse };
