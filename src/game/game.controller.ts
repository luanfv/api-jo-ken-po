import {
  Body,
  Patch,
  Put,
  Controller,
  Get,
  Param,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { PlayerPickJoKenPoDTO } from './dto/playerPickJoKenPo.dto';
import { AddPlayerInGameDTO } from './dto/addPlayerInGame.dto';
import { GameService } from './game.service';

@Controller('/games')
class GameController {
  constructor(private gameService: GameService) {}

  @Post()
  createGame() {
    try {
      const response = this.gameService.createGame();

      if (response instanceof HttpException) {
        throw response;
      }

      return response;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  getAllGames() {
    try {
      const response = this.gameService.getAllGames();

      if (response instanceof HttpException) {
        throw response;
      }

      return response;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/:gameId')
  getGameById(@Param('gameId') gameId: string) {
    try {
      const response = this.gameService.getGameById(gameId);

      if (response instanceof HttpException) {
        throw response;
      }

      return response;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('/:gameId/restart')
  restartGame(@Param('gameId') gameId: string) {
    try {
      const response = this.gameService.restartGame(gameId);

      if (response instanceof HttpException) {
        throw response;
      }

      return response;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/:gameId/player')
  addPlayerInGame(
    @Param('gameId') gameId: string,
    @Body() body: AddPlayerInGameDTO,
  ) {
    try {
      const response = this.gameService.addPlayerInGame(gameId, body.username);

      if (response instanceof HttpException) {
        throw response;
      }

      return response;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('/:gameId/player/:playerUsername')
  playerPickJoKenPo(
    @Param('gameId') gameId: string,
    @Param('playerUsername') playerUsername: string,
    @Body() body: PlayerPickJoKenPoDTO,
  ) {
    try {
      const response = this.gameService.playerPickJoKenPo(
        gameId,
        playerUsername,
        body.pick,
      );

      if (response instanceof HttpException) {
        throw response;
      }

      return response;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export { GameController };
