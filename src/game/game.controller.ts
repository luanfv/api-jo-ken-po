import { Body, HttpStatus, Patch, Put } from '@nestjs/common';
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

  @Get('/:gameId')
  getGameById(@Param('gameId') gameId: string) {
    const existingGame = this.gameRepository.getById(gameId);

    if (!existingGame) {
      throw new HttpException('Game not found', HttpStatus.NOT_FOUND);
    }

    return existingGame;
  }

  @Put('/:gameId/restart')
  restartGame(@Param('gameId') gameId: string) {
    const existingGame = this.gameRepository.getById(gameId);

    if (!existingGame) {
      throw new HttpException('Game not found', HttpStatus.NOT_FOUND);
    }

    existingGame.restart();
    this.gameRepository.update(existingGame);

    return existingGame;
  }

  @Post('/:gameId/player')
  addPlayerInTheGame(@Param('gameId') gameId: string, @Body() body) {
    const existingGame = this.gameRepository.getById(gameId);

    if (!existingGame) {
      throw new HttpException('Game not found', HttpStatus.NOT_FOUND);
    }

    if (!existingGame.player1) {
      existingGame.player1 = new PlayerEntity(body.username);

      return existingGame;
    }

    if (existingGame.player1.username === body.username) {
      throw new HttpException('Player already exists', HttpStatus.CONFLICT);
    }

    if (!existingGame.player2) {
      existingGame.player2 = new PlayerEntity(body.username);

      return existingGame;
    }

    throw new HttpException(
      'Game already has enough players',
      HttpStatus.BAD_REQUEST,
    );
  }

  @Patch('/:gameId/player/:playerUsername')
  selectJoKenPoPlayerInTheGame(
    @Param('gameId') gameId: string,
    @Param('playerUsername') playerUsername: string,
    @Body() body,
  ) {
    const existingGame = this.gameRepository.getById(gameId);

    if (!existingGame) {
      throw new HttpException('Game not found', HttpStatus.NOT_FOUND);
    }

    if (existingGame.finish) {
      throw new HttpException('Game over', HttpStatus.BAD_REQUEST);
    }

    switch (playerUsername) {
      case existingGame.player1.username:
        existingGame.player1.response = body.pick;

        break;

      case existingGame.player2.username:
        existingGame.player2.response = body.pick;

        break;

      default:
        throw new HttpException('Player not found', HttpStatus.NOT_FOUND);
    }

    existingGame.result();
    this.gameRepository.update(existingGame);

    return existingGame;
  }
}

export { GameController };
