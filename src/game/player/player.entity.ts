class PlayerEntity {
  username: string;
  join: 'JO' | 'KEN' | 'PO' | undefined;
  winner: boolean;

  constructor(username: string) {
    this.username = username;
    this.winner = false;
  }
}

export { PlayerEntity };
