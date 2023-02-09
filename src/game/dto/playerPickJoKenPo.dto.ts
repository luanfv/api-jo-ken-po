import { IsNotEmpty } from 'class-validator';

import { JoKenPo } from '../player/player.entity';
import { IsJoKenPo } from '../validator/is-jo-ken-po.validator';

class PlayerPickJoKenPoDTO {
  @IsNotEmpty()
  @IsJoKenPo({ message: 'pick needs to be: JO, KEN or PO' })
  pick: JoKenPo;
}

export { PlayerPickJoKenPoDTO };
