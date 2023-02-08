import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { Controller, Get, Param, Post } from '@nestjs/common';
import { GameRepository } from './game.repository';
import { GameEntity } from './game.entity';
import { PlayerEntity } from './player/player.entity';

@Controller('/games')
class GameController {
  constructor(private gameRepository: GameRepository) {}

  @Post()
  createGame() {
    const newGame = new GameEntity();

    this.gameRepository.save(newGame);

    return newGame;
  }

  @Get()
  getAllGames() {
    return this.gameRepository.getAll();
  }

  @Post('/:gameId/player/:playerUsername')
  addPlayerInTheGame(
    @Param('gameId') gameId: string,
    @Param('playerUsername') playerUsername: string,
  ) {
    const existingGame = this.gameRepository.getById(gameId);

    if (!existingGame) {
      throw new HttpException('Game not found', HttpStatus.NOT_FOUND);
    }

    if (!existingGame.player1) {
      existingGame.player1 = new PlayerEntity(playerUsername);

      return existingGame;
    }

    if (!existingGame.player2) {
      existingGame.player2 = new PlayerEntity(playerUsername);

      return existingGame;
    }

    throw new HttpException(
      'Game already has enough players',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export { GameController };
