import { ApiProperty } from '@nestjs/swagger';

import { Game } from '../repositories/game.repository';

class GameResponse implements Game {
  @ApiProperty()
  id: string;

  @ApiProperty()
  is_game_over: boolean;

  @ApiProperty()
  winner_id: string;

  @ApiProperty()
  created_at: Date;
}

export { GameResponse };
