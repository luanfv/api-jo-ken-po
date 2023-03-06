import { Test } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';

import { GameService } from './game.service';
import { GameRepository, Game } from '../repositories/game.repository';
import { PlayerRepository } from '../repositories/player.repository';

describe('GameService', () => {
  let gameService: GameService;
  let gameRepository: GameRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [GameService, GameRepository, PlayerRepository],
    }).compile();

    gameService = moduleRef.get<GameService>(GameService);
    gameRepository = moduleRef.get<GameRepository>(GameRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('WHEN called createGame', () => {
    it('SHOULD called GameRepository.create', () => {
      jest
        .spyOn(gameRepository, 'create')
        .mockImplementation(() => expect.anything());
      gameService.createGame();

      expect(gameRepository.create).toBeCalled();
    });

    describe('AND can create new game', () => {
      it('SHOULD return a Game', async () => {
        const game: Game = {
          id: expect.any(String),
          is_game_over: false,
          winner_id: null,
          created_at: expect.any(Date),
        };

        jest
          .spyOn(gameRepository, 'create')
          .mockImplementation(async () => game);

        const result = await gameService.createGame();
        const expectedResult = game;

        expect(result).toEqual(expectedResult);
      });
    });

    describe('AND cannot create new game', () => {
      it('SHOULD return a HttpException', async () => {
        jest.spyOn(gameRepository, 'create').mockImplementation(null);

        const result = await gameService.createGame();
        const expectedResult = new HttpException(
          'Internal server error in create game',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );

        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe('WHEN called getGameById', () => {
    it('SHOULD called GameRepository.getById', () => {
      jest
        .spyOn(gameRepository, 'getById')
        .mockImplementation(async () => expect.anything());

      gameService.getGameById('');

      expect(gameRepository.getById).toBeCalled();
    });

    describe('AND can game found', () => {
      it('SHOULD return a Game', async () => {
        const game: Game = {
          id: expect.any(String),
          is_game_over: false,
          winner_id: null,
          created_at: expect.any(Date),
        };

        jest
          .spyOn(gameRepository, 'getById')
          .mockImplementation(async () => game);

        const result = await gameService.getGameById(expect.any(String));
        const expectedResult = game;

        expect(result).toEqual(expectedResult);
      });
    });

    describe('AND cannot game found', () => {
      it('SHOULD return a HttpException', async () => {
        jest
          .spyOn(gameRepository, 'getById')
          .mockImplementation(async () => null);

        const result = await gameService.getGameById(expect.any(String));
        const expectedResult = new HttpException(
          'Game not found',
          HttpStatus.NOT_FOUND,
        );

        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe('WHEN called addPlayerInGame', () => {
    it('SHOULD called GameRepository.getById', () => {});

    describe('AND game not found', () => {
      it('SHOULD return instance of HttpException', () => {});

      it('SHOULD return message = "Game not found" AND http status = NOT FOUND', () => {});
    });

    describe('AND player 1 is not registered', () => {
      it('SHOULD register AND return new player 1', () => {});
    });

    describe('AND username player 1 already exists', () => {
      it('SHOULD return instance of HttpException', () => {});

      it('SHOULD return message = "Player already exists" AND http status = CONFLICT', () => {});
    });

    describe('AND player 1 is registered', () => {
      it('SHOULD register AND return new player 2', () => {});
    });

    describe('AND fame already has enough players', () => {
      it('SHOULD return instance of HttpException', () => {});

      it('SHOULD return message = "Game already has enough players" AND http status = BAD REQUEST', () => {});
    });
  });

  describe('WHEN called playerPick', () => {
    it('SHOULD called GameRepository.getById', () => {});

    describe('AND game not found', () => {
      it('SHOULD return instance of HttpException', () => {});

      it('SHOULD return message = "Game not found" AND http status = NOT FOUND', () => {});
    });

    describe('AND game over', () => {
      it('SHOULD return instance of HttpException', () => {});

      it('SHOULD return message = "Game over" AND http status = BAD REQUEST', () => {});
    });

    describe('AND player not found', () => {
      it('SHOULD return instance of HttpException', () => {});

      it('SHOULD return message = "Player not found" AND http status = NOT FOUND', () => {});
    });

    describe('AND player 1 pick', () => {
      it('SHOULD called Game.playerPick', () => {});

      it('SHOULD change player pick AND return game', () => {});
    });

    describe('AND player 2 pick', () => {
      it('SHOULD called Game.playerPick', () => {});

      it('SHOULD change player pick AND return game', () => {});
    });

    describe('AND all player pick', () => {
      describe('AND a tie game', () => {
        it.each`
          player1Pick | player2Pick
          ${'JO'}     | ${'JO'}
          ${'KEN'}    | ${'KEN'}
          ${'PO'}     | ${'PO'}
        `(
          'SHOULD return game (player1 = $player1Pick and player2 = $player2Pick)',
          ({ player1Pick, player2Pick }) => {},
        );
      });

      describe('AND player 1 wins', () => {
        it.each`
          player1Pick | player2Pick
          ${'JO'}     | ${'PO'}
          ${'KEN'}    | ${'JO'}
          ${'PO'}     | ${'KEN'}
        `(
          'SHOULD game over and return game (player1 = $player1Pick and player2 = $player2Pick)',
          ({ player1Pick, player2Pick }) => {},
        );
      });

      describe('AND player 2 wins', () => {
        it.each`
          player2Pick | player1Pick
          ${'JO'}     | ${'PO'}
          ${'KEN'}    | ${'JO'}
          ${'PO'}     | ${'KEN'}
        `(
          'SHOULD game over and return game (player1 = $player1Pick and player2 = $player2Pick)',
          ({ player1Pick, player2Pick }) => {},
        );
      });
    });
  });

  describe('WHEN called restartGame', () => {
    it('SHOULD called GameRepository.getById', () => {});

    describe('AND game not found', () => {
      it('SHOULD return instance of HttpException', () => {});

      it('SHOULD return message = "Game not found" AND http status = NOT FOUND', () => {});
    });

    describe('AND reset game', () => {
      it('SHOULD change isGamOver to false', () => {});

      it('SHOULD change player1.pick and player2.pick to undefined', () => {});

      it('SHOULD change winner to undefined', () => {});

      it('SHOULD return game', () => {});
    });
  });
});
