import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { GameEntity } from './game.entity';
import { GameRepository } from './game.repository';
import { JoKenPo, PlayerEntity } from './player/player.entity';

@Injectable()
class GameService {
  constructor(private gameRepository: GameRepository) {}

  createGame() {
    const newGame = new GameEntity();

    this.gameRepository.save(newGame);

    return newGame;
  }

  getAllGames() {
    return this.gameRepository.getAll();
  }

  getGameById(gameId: string) {
    const existingGame = this.gameRepository.getById(gameId);

    if (!existingGame) {
      return new HttpException('Game not found', HttpStatus.NOT_FOUND);
    }

    return existingGame;
  }

  addPlayerInGame(gameId: string, username: string) {
    const existingGame = this.gameRepository.getById(gameId);

    if (!existingGame) {
      return new HttpException('Game not found', HttpStatus.NOT_FOUND);
    }

    if (!existingGame.player1) {
      existingGame.player1 = new PlayerEntity(username);

      return existingGame;
    }

    if (existingGame.player1.username === username) {
      return new HttpException('Player already exists', HttpStatus.CONFLICT);
    }

    if (!existingGame.player2) {
      existingGame.player2 = new PlayerEntity(username);

      return existingGame;
    }

    return new HttpException(
      'Game already has enough players',
      HttpStatus.BAD_REQUEST,
    );
  }

  playerPickJoKenPo(gameId: string, username: string, pick: JoKenPo) {
    const existingGame = this.gameRepository.getById(gameId);

    if (!existingGame) {
      return new HttpException('Game not found', HttpStatus.NOT_FOUND);
    }

    if (existingGame.isGamOver) {
      return new HttpException('Game over', HttpStatus.BAD_REQUEST);
    }

    const isPlayerPickSuccessful = existingGame.playerPick(username, pick);

    if (!isPlayerPickSuccessful) {
      return new HttpException('Player not found', HttpStatus.NOT_FOUND);
    }

    existingGame.result();

    return existingGame;
  }

  restartGame(gameId: string) {
    const existingGame = this.gameRepository.getById(gameId);

    if (!existingGame) {
      return new HttpException('Game not found', HttpStatus.NOT_FOUND);
    }

    existingGame.restart();

    return existingGame;
  }
}

export { GameService };
