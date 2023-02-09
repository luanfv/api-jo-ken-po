import { IsNotEmpty } from 'class-validator';

class AddPlayerInGameDTO {
  @IsNotEmpty()
  username: string;
}

export { AddPlayerInGameDTO };
