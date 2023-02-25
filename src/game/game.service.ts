import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { GameRepository } from './game.repository';
import { PlayerRepository } from './player/player.repository';
import { PlayerPick } from './player/player.entity';

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
    return await this.gameRepository.read({
      where: {
        id: gameId,
      },
    });
  }

  async addPlayerInGame(gameId: string, username: string) {
    const players = await this.playerRepository.readAll({
      where: {
        game_id: gameId,
      },
    });

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

  async playerPick(gameId: string, username: string, pick: PlayerPick) {
    const existingGame = await this.gameRepository.read({
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

    const existingPlayer = await this.playerRepository.read({
      where: {
        game_id: existingGame.id,
        username,
      },
    });

    return await this.playerRepository.update({
      where: {
        id: existingPlayer.id,
      },
      data: {
        pick: pick,
      },
    });
  }

  async restartGame(gameId: string) {
    return await this.gameRepository.update({
      data: {
        is_game_over: false,
        players: {
          updateMany: {
            data: {
              pick: null,
            },
            where: {
              game_id: gameId,
            },
          },
        },
      },
      where: {
        id: gameId,
      },
    });
  }
}

export { GameService };
