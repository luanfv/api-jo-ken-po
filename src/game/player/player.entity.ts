type JoKenPo = 'JO' | 'KEN' | 'PO';

class PlayerEntity {
  username: string;
  pick: JoKenPo | undefined;

  constructor(username: string) {
    this.username = username;
  }
}

export { PlayerEntity, JoKenPo };
