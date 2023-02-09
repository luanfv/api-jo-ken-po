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

  update(game: GameEntity) {
    this.games = this.games.map((gameRepository) => {
      if (gameRepository.id === game.id) {
        return game;
      }

      return gameRepository;
    });
  }
}

export { GameRepository };
