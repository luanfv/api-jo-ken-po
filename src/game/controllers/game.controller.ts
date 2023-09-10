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
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';

import { PlayerPickDTO } from '../dtos/player-pick.dto';
import { AddPlayerInGameDTO } from '../dtos/add-player-in-game.dto';
import { GameService } from '../services/game.service';
import { GameResponse } from '../dtos/game.response.dto';
import { PlayerResponse } from '../dtos/player.response.dto';

@Controller('/games')
class GameController {
  constructor(private gameService: GameService) {}

  @ApiTags('games')
  @ApiResponse({
    type: GameResponse,
    status: HttpStatus.CREATED,
    description: 'Create new game',
  })
  @Post()
  async createGame(): Promise<GameResponse> {
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

  @ApiTags('games')
  @ApiResponse({
    type: GameResponse,
    status: HttpStatus.OK,
    description: 'Find the game',
  })
  @Get('/:gameId')
  async getGameById(@Param('gameId') gameId: string): Promise<GameResponse> {
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

  @Get('/:gameId/stream')
  async stream(@Param('gameId') gameId: string, @Res() response) {
    response.setHeader('Content-Type', 'text/event-stream');
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Connection', 'keep-alive');

    let currentData;
    let nextData;

    currentData = await this.gameService.getGameById(gameId);

    response.write(`data: ${JSON.stringify(currentData)}\n\n`);

    setInterval(async () => {
      nextData = await this.gameService.getGameById(gameId);

      if (currentData !== nextData) {
        currentData = nextData;
        response.write(`data: ${JSON.stringify(nextData)}\n\n`);
      }
    }, 5e3);
  }

  @ApiTags('games')
  @ApiResponse({
    type: GameResponse,
    status: HttpStatus.OK,
    description: 'Finish the game',
  })
  @Put('/:gameId/finish')
  async finishGame(@Param('gameId') gameId: string): Promise<GameResponse> {
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

  @ApiTags('games')
  @ApiResponse({
    type: PlayerResponse,
    status: HttpStatus.CREATED,
    description: 'Add player in the game',
  })
  @ApiBody({
    type: AddPlayerInGameDTO,
    examples: {
      successful: {
        summary: 'Add player in the game',
        description: 'Send a username to create new player in the game',
        value: {
          username: 'Fulanin',
        },
      },
    },
  })
  @Post('/:gameId/player')
  async addPlayerInGame(
    @Param('gameId') gameId: string,
    @Body() body: AddPlayerInGameDTO,
  ): Promise<PlayerResponse> {
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

  @ApiTags('games')
  @ApiResponse({
    type: PlayerResponse,
    status: HttpStatus.OK,
    description: 'Player pick: JO, KEN or PO',
  })
  @ApiBody({
    type: PlayerPickDTO,
    examples: {
      successful: {
        summary: 'Valid pick',
        description: 'Send a valid pick',
        value: {
          pick: 'JO',
        },
      },
      failure: {
        summary: 'Invalid pick',
        description: 'Send a invalid pick',
        value: {
          pick: 'BA',
        },
      },
    },
  })
  @Patch('/:gameId/player/:playerId')
  async playerPick(
    @Param('gameId') gameId: string,
    @Param('playerId') playerId: string,
    @Body() body: PlayerPickDTO,
  ): Promise<PlayerResponse> {
    try {
      const response = await this.gameService.playerPick(
        gameId,
        playerId,
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
