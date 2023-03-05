import { IsNotEmpty } from 'class-validator';

import { IsJoKenPo } from '../validators/is-jo-ken-po.validator';
import { PlayerPick } from '../repositories/player.repository';

class PlayerPickDTO {
  @IsNotEmpty()
  @IsJoKenPo({ message: 'pick needs to be: JO, KEN or PO' })
  pick: PlayerPick;
}

export { PlayerPickDTO };
