import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { GameRepository } from './game.repository';
import { PlayerRepository } from './player/player.repository';
import { JoKenPo } from './player/player.entity';

@Injectable()
class GameService {
  constructor(
    private gameRepository: GameRepository,
    private playerRepository: PlayerRepository,
  ) {}

  async createGame() {
    return await this.gameRepository.create();
  }

  async getGameById(gameId: string) {
    const existingGame = await this.gameRepository.find({
      where: {
        id: gameId,
      },
    });

    if (!existingGame) {
      return new HttpException('Game not found', HttpStatus.NOT_FOUND);
    }

    return existingGame;
  }

  async addPlayerInGame(gameId: string, username: string) {
    const players = await this.playerRepository.getByGameId(gameId);

    if (players.length > 1) {
      return new HttpException(
        'Game already has enough players',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!!players[0] && players[0].username === username) {
      return new HttpException('Player already exists', HttpStatus.CONFLICT);
    }

    return await this.playerRepository.create(gameId, username);
  }

  async playerPickJoKenPo(gameId: string, username: string, pick: JoKenPo) {
    const existingGame = await this.gameRepository.find({
      where: {
        id: gameId,
      },
    });

    if (!existingGame) {
      return new HttpException('Game not found', HttpStatus.NOT_FOUND);
    }

    if (existingGame.is_game_over) {
      return new HttpException('Game over', HttpStatus.BAD_REQUEST);
    }

    const existingPlayer = await this.playerRepository.getByGameId(
      existingGame.id,
      {
        username,
      },
    );

    const result = await this.playerRepository.setPick(
      existingPlayer[0].id,
      pick,
    );

    return result;
  }

  async restartGame(gameId: string) {
    return await this.gameRepository.update({
      data: {
        is_game_over: false,
      },
      where: {
        id: gameId,
      },
    });
  }
}

export { GameService };
