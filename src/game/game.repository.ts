import { Injectable } from '@nestjs/common';
import { GameEntity } from './game.entity';

@Injectable()
class GameRepository {
  private games: GameEntity[] = [];

  save(game: GameEntity) {
    this.games.push(game);
  }

  getAll() {
    return this.games;
  }

  getById(id: string) {
    return this.games.find((game) => game.id === id);
  }
}

export { GameRepository };
