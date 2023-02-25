import { IsNotEmpty } from 'class-validator';

import { PlayerPick } from '../player/player.entity';
import { IsJoKenPo } from '../validator/is-jo-ken-po.validator';

class PlayerPickDTO {
  @IsNotEmpty()
  @IsJoKenPo({ message: 'pick needs to be: JO, KEN or PO' })
  pick: PlayerPick;
}

export { PlayerPickDTO };
