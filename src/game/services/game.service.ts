import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { GameRepository } from '../repositories/game.repository';
import {
  Player,
  PlayerPick,
  PlayerRepository,
} from '../repositories/player.repository';
import { GetGameByIdOutput } from './game.service.type';

@Injectable()
class GameService {
  constructor(
    private gameRepository: GameRepository,
    private playerRepository: PlayerRepository,
  ) {}

  async createGame() {
    const createdGame = await this.gameRepository.create();

    if (!createdGame) {
      return new HttpException(
        'Internal server error in create game',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return createdGame;
  }

  async getGameById(gameId: string): Promise<GetGameByIdOutput> {
    const existingGame = await this.gameRepository.getById(gameId);

    if (!existingGame) {
      throw new NotFoundException('Game not found');
    }

    return {
      ...existingGame,
      created_at: existingGame.created_at.toISOString(),
    };
  }

  async addPlayerInGame(gameId: string, username: string) {
    const game = await this.gameRepository.getById(gameId);

    if (!game) {
      return new HttpException('Game not found', HttpStatus.NOT_FOUND);
    }

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

    const createdPlayer = await this.playerRepository.create(gameId, username);

    if (!createdPlayer) {
      return new HttpException(
        'Internal server error in create player',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return createdPlayer;
  }

  async playerPick(gameId: string, playerId: string, pick: PlayerPick) {
    const [game, player] = await Promise.all([
      this.gameRepository.getById(gameId),
      this.playerRepository.getById(playerId),
    ]);

    if (!game) {
      return new NotFoundException('Game not found');
    }

    if (!player || player.game_id !== game.id) {
      return new NotFoundException('Player not found');
    }

    if (game.is_game_over) {
      return new BadRequestException('Game over');
    }

    const updatedPlayer = await this.playerRepository.setPickById(
      player.id,
      pick,
    );

    if (!updatedPlayer) {
      return new InternalServerErrorException(
        'Internal server error in set player pick',
      );
    }

    return updatedPlayer;
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
    const existingGame = await this.gameRepository.getById(gameId);

    if (!existingGame) {
      return new HttpException('Game not found', HttpStatus.NOT_FOUND);
    }

    if (existingGame.is_game_over) {
      return new HttpException(
        'This game is over, you need to restart the game',
        HttpStatus.BAD_REQUEST,
      );
    }

    const players = await this.playerRepository.getByGameId(gameId);

    if (!Array.isArray(players) || !players[0] || !players[1]) {
      return new HttpException('Not enough players', HttpStatus.BAD_REQUEST);
    }

    if (!players[0].pick || !players[1].pick) {
      return new HttpException('Not all players pick', HttpStatus.BAD_REQUEST);
    }

    const winnerId = this.getGamesWinnerId(players);

    const updatedGame = await this.gameRepository.setWinnerById(
      gameId,
      winnerId,
    );

    if (!updatedGame) {
      return new HttpException(
        'Internal server error in finish game',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return updatedGame;
  }
}

export { GameService };
