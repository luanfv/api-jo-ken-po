import { IsNotEmpty } from 'class-validator';

import { IsJoKenPo } from '../validator/is-jo-ken-po.validator';
import { PlayerPick } from '../player/player.repository';

class PlayerPickDTO {
  @IsNotEmpty()
  @IsJoKenPo({ message: 'pick needs to be: JO, KEN or PO' })
  pick: PlayerPick;
}

export { PlayerPickDTO };
