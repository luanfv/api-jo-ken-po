import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { GameRepository } from './game.repository';
import {
  Player,
  PlayerPick,
  PlayerRepository,
} from './player/player.repository';

@Injectable()
class GameService {
  constructor(
    private gameRepository: GameRepository,
    private playerRepository: PlayerRepository,
  ) {}

  async createGame() {
    const game = await this.gameRepository.create();

    if (!game) {
      return new HttpException(
        'Internal server error in create game',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return game;
  }

  async getGameById(gameId: string) {
    const game = await this.gameRepository.getById(gameId);

    if (!game) {
      return new HttpException('Game not found', HttpStatus.NOT_FOUND);
    }

    return game;
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

    const player = this.playerRepository.create(gameId, username);

    if (!player) {
      return new HttpException(
        'Internal server error in create player',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return player;
  }

  async playerPick(gameId: string, username: string, pick: PlayerPick) {
    const existingGame = await this.gameRepository.getById(gameId);

    if (!existingGame) {
      return new HttpException('Game not found', HttpStatus.NOT_FOUND);
    }

    if (existingGame.is_game_over) {
      return new HttpException('Game over', HttpStatus.BAD_REQUEST);
    }

    const existingPlayer = await this.playerRepository.getByIdAndGameId(
      username,
      existingGame.id,
    );

    if (!existingPlayer) {
      return new HttpException('Game not found', HttpStatus.NOT_FOUND);
    }

    const player = await this.playerRepository.setPickById(
      existingPlayer.id,
      pick,
    );

    if (!player) {
      return new HttpException(
        'Internal server error in set player pick',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return player;
  }

  async restartGame(gameId: string) {
    const game = await this.gameRepository.restartById(gameId);

    if (!game) {
      return new HttpException('Game not found', HttpStatus.NOT_FOUND);
    }

    return game;
  }

  private getGamesWinnerId(players: Player[]) {
    if (players[0].pick === players[1].pick) {
      return null;
    }

    if (players[0].pick === 'JO' && players[1].pick === 'PO') {
      return players[0].id;
    }

    if (players[0].pick === 'KEN' && players[1].pick === 'JO') {
      return players[0].id;
    }

    if (players[0].pick === 'PO' && players[1].pick === 'KEN') {
      return players[0].id;
    }

    return players[1].id;
  }

  async finishGame(gameId: string) {
    const game = await this.gameRepository.getById(gameId);

    if (!game) {
      return new HttpException('Game not found', HttpStatus.NOT_FOUND);
    }

    if (game.is_game_over) {
      return new HttpException(
        'This game is over, you need to restart the game',
        HttpStatus.BAD_REQUEST,
      );
    }

    const players = await this.playerRepository.getByGameId(gameId);

    if (!players[0] || !players[1]) {
      return new HttpException('Not enough players', HttpStatus.BAD_REQUEST);
    }

    if (!players[0].pick || !players[1].pick) {
      return new HttpException('Not all players pick', HttpStatus.BAD_REQUEST);
    }

    const winnerId = this.getGamesWinnerId(players);

    const result = await this.gameRepository.setWinnerById(gameId, winnerId);

    if (!result) {
      return new HttpException(
        'Internal server error in finish game',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }
}

export { GameService };
