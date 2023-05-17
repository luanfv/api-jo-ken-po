import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

class AddPlayerInGameDTO {
  @ApiProperty()
  @IsNotEmpty()
  username: string;
}

export { AddPlayerInGameDTO };
