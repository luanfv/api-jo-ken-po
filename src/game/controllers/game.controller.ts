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

import { PlayerPickDTO } from '../dtos/player-pick.dto';
import { AddPlayerInGameDTO } from '../dtos/add-player-in-game.dto';
import { GameService } from '../services/game.service';

@Controller('/games')
class GameController {
  constructor(private gameService: GameService) {}

  @Post()
  async createGame() {
    try {
      const response = await this.gameService.createGame();

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
  async getGameById(@Param('gameId') gameId: string) {
    try {
      const response = await this.gameService.getGameById(gameId);

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
  async restartGame(@Param('gameId') gameId: string) {
    try {
      const response = await this.gameService.restartGame(gameId);

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

  @Put('/:gameId/finish')
  async finishGame(@Param('gameId') gameId: string) {
    try {
      const response = await this.gameService.finishGame(gameId);

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
  async addPlayerInGame(
    @Param('gameId') gameId: string,
    @Body() body: AddPlayerInGameDTO,
  ) {
    try {
      const response = await this.gameService.addPlayerInGame(
        gameId,
        body.username,
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

  @Patch('/:gameId/player/:playerUsername')
  async playerPick(
    @Param('gameId') gameId: string,
    @Param('playerUsername') playerUsername: string,
    @Body() body: PlayerPickDTO,
  ) {
    try {
      const response = await this.gameService.playerPick(
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
