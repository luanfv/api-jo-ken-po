import { HttpException, HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { GameService } from './game.service';
import { GameRepository } from './game.repository';
import { GameEntity } from './game.entity';
import { PlayerEntity } from './player/player.entity';

describe('GameService', () => {
  let gameService: GameService;
  let gameRepository: GameRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [GameService, GameRepository],
    }).compile();

    gameService = moduleRef.get<GameService>(GameService);
    gameRepository = moduleRef.get<GameRepository>(GameRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('WHEN called createGame', () => {
    it('SHOULD called GameRepository.save', () => {
      jest
        .spyOn(gameRepository, 'save')
        .mockImplementation(() => expect.anything());
      gameService.createGame();

      expect(gameRepository.save).toBeCalled();
    });

    it('SHOULD return instance of GameEntity', () => {
      const result = gameService.createGame();

      expect(result instanceof GameEntity).toBe(true);
    });
  });

  describe('WHEN called getAll', () => {
    it('SHOULD called GameRepository.getAll', () => {
      jest.spyOn(gameRepository, 'getAll').mockImplementation(() => []);

      gameService.getAllGames();

      expect(gameRepository.getAll).toBeCalled();
    });

    describe('AND do not have games registered', () => {
      it('SHOULD return a empty array', () => {
        jest.spyOn(gameRepository, 'getAll').mockImplementation(() => []);

        const resultExpected = [];
        const result = gameService.getAllGames();

        expect(result).toEqual(resultExpected);
      });
    });

    describe('AND has games registered', () => {
      it('SHOULD return an array with all games', () => {
        const expectedResult = new GameEntity();

        jest
          .spyOn(gameRepository, 'getAll')
          .mockImplementation(() => [expectedResult]);

        const result = gameService.getAllGames();

        expect(result).toEqual([expectedResult]);
      });
    });
  });

  describe('WHEN called getGameById', () => {
    it('SHOULD called GameRepository.getById', () => {
      jest
        .spyOn(gameRepository, 'getById')
        .mockImplementation(() => expect.anything());

      gameService.getGameById(expect.anything());

      expect(gameRepository.getById).toBeCalled();
    });

    describe('AND game not found', () => {
      it('SHOULD return instance of HttpException', () => {
        jest
          .spyOn(gameRepository, 'getById')
          .mockImplementation((id) =>
            [new GameEntity(), new GameEntity()].find((game) => game.id === id),
          );

        const result = gameService.getGameById('123');

        expect(result instanceof HttpException).toBe(true);
      });

      it('SHOULD return message = "Game not found" AND http status = NOT FOUND', () => {
        jest
          .spyOn(gameRepository, 'getById')
          .mockImplementation((id) =>
            [new GameEntity(), new GameEntity()].find((game) => game.id === id),
          );

        const result = gameService.getGameById('123');
        const resultExpected = new HttpException(
          'Game not found',
          HttpStatus.NOT_FOUND,
        );

        expect(result).toEqual(resultExpected);
      });
    });

    describe('AND have the game registered', () => {
      it('SHOULD return instance of GameEntity', () => {
        const expectedResult = new GameEntity();
        expectedResult.id = '123';

        jest
          .spyOn(gameRepository, 'getById')
          .mockImplementation((id) =>
            [expectedResult].find((game) => game.id === id),
          );

        const result = gameService.getGameById('123');

        expect(result instanceof GameEntity).toBe(true);
      });

      it('SHOULD return the game', () => {
        const expectedResult = new GameEntity();
        expectedResult.id = '123';

        jest
          .spyOn(gameRepository, 'getById')
          .mockImplementation((id) =>
            [expectedResult].find((game) => game.id === id),
          );

        const result = gameService.getGameById('123');

        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe('WHEN called addPlayerInGame', () => {
    it('SHOULD called GameRepository.getById', () => {
      jest
        .spyOn(gameRepository, 'getById')
        .mockImplementation(() => expect.any(GameEntity));

      gameService.addPlayerInGame(expect.any(String), expect.any(String));

      expect(gameRepository.getById).toBeCalled();
    });

    describe('AND game not found', () => {
      it('SHOULD return instance of HttpException', () => {
        jest
          .spyOn(gameRepository, 'getById')
          .mockImplementation(() => undefined);

        const result = gameService.addPlayerInGame('gameId', 'username');

        expect(result instanceof HttpException).toBe(true);
      });

      it('SHOULD return message = "Game not found" AND http status = NOT FOUND', () => {
        jest
          .spyOn(gameRepository, 'getById')
          .mockImplementation(() => undefined);

        const result = gameService.addPlayerInGame('gameId', 'username');
        const resultExpected = new HttpException(
          'Game not found',
          HttpStatus.NOT_FOUND,
        );

        expect(result).toEqual(resultExpected);
      });
    });

    describe('AND player 1 is not registered', () => {
      it('SHOULD register AND return new player 1', () => {
        jest
          .spyOn(gameRepository, 'getById')
          .mockImplementation(() => new GameEntity());

        const result = gameService.addPlayerInGame(
          expect.any(String),
          'username',
        ) as GameEntity;
        const expectedUsername = 'username';
        const expectedPlayer = new PlayerEntity(expectedUsername);

        expect(result.player1).toEqual(expectedPlayer);
      });
    });

    describe('AND username player 1 already exists', () => {
      it('SHOULD return instance of HttpException', () => {
        const game = new GameEntity();
        game.player1 = new PlayerEntity('player1');

        jest.spyOn(gameRepository, 'getById').mockImplementation(() => game);

        const result = gameService.addPlayerInGame(
          expect.any(String),
          'player1',
        ) as GameEntity;

        expect(result instanceof HttpException).toBe(true);
      });

      it('SHOULD return message = "Player already exists" AND http status = CONFLICT', () => {
        const game = new GameEntity();
        game.player1 = new PlayerEntity('player1');

        jest.spyOn(gameRepository, 'getById').mockImplementation(() => game);

        const result = gameService.addPlayerInGame(
          expect.any(String),
          'player1',
        ) as GameEntity;
        const expectedResult = new HttpException(
          'Player already exists',
          HttpStatus.CONFLICT,
        );

        expect(result).toEqual(expectedResult);
      });
    });

    describe('AND player 1 is registered', () => {
      it('SHOULD register AND return new player 2', () => {
        const game = new GameEntity();
        game.player1 = new PlayerEntity('player1');

        jest.spyOn(gameRepository, 'getById').mockImplementation(() => game);

        const result = gameService.addPlayerInGame(
          expect.any(String),
          'player2',
        ) as GameEntity;
        const expectedUsername = 'player2';
        const expectedPlayer2 = new PlayerEntity(expectedUsername);

        expect(result.player2).toEqual(expectedPlayer2);
      });
    });

    describe('AND fame already has enough players', () => {
      it('SHOULD return instance of HttpException', () => {
        const game = new GameEntity();
        game.player1 = new PlayerEntity('player1');
        game.player2 = new PlayerEntity('player2');

        jest.spyOn(gameRepository, 'getById').mockImplementation(() => game);

        const result = gameService.addPlayerInGame(
          expect.any(String),
          'player3',
        ) as GameEntity;

        expect(result instanceof HttpException).toBe(true);
      });

      it('SHOULD return message = "Game already has enough players" AND http status = BAD REQUEST', () => {
        const game = new GameEntity();
        game.player1 = new PlayerEntity('player1');
        game.player2 = new PlayerEntity('player2');

        jest.spyOn(gameRepository, 'getById').mockImplementation(() => game);

        const result = gameService.addPlayerInGame(
          expect.any(String),
          'player3',
        ) as GameEntity;
        const expectedResult = new HttpException(
          'Game already has enough players',
          HttpStatus.BAD_REQUEST,
        );

        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe('WHEN called playerPickJoKenPo', () => {
    it('SHOULD called GameRepository.getById', () => {
      jest
        .spyOn(gameRepository, 'getById')
        .mockImplementation(() => new GameEntity());

      gameService.playerPickJoKenPo(
        expect.any(String),
        expect.any(String),
        expect.any(String),
      );

      expect(gameRepository.getById).toBeCalled();
    });

    describe('AND game not found', () => {
      it('SHOULD return instance of HttpException', () => {
        jest
          .spyOn(gameRepository, 'getById')
          .mockImplementation(() => undefined);

        const result = gameService.playerPickJoKenPo(
          expect.any(String),
          expect.any(String),
          expect.any(String),
        );

        expect(result instanceof HttpException).toBe(true);
      });

      it('SHOULD return message = "Game not found" AND http status = NOT FOUND', () => {
        jest
          .spyOn(gameRepository, 'getById')
          .mockImplementation(() => undefined);

        const result = gameService.playerPickJoKenPo(
          expect.any(String),
          expect.any(String),
          expect.any(String),
        );
        const resultExpected = new HttpException(
          'Game not found',
          HttpStatus.NOT_FOUND,
        );

        expect(result).toEqual(resultExpected);
      });
    });

    describe('AND game over', () => {
      it('SHOULD return instance of HttpException', () => {
        const game = new GameEntity();
        game.isGamOver = true;

        jest.spyOn(gameRepository, 'getById').mockImplementation(() => game);

        const result = gameService.playerPickJoKenPo(
          expect.any(String),
          expect.any(String),
          expect.any(String),
        );

        expect(result instanceof HttpException).toBe(true);
      });

      it('SHOULD return message = "Game over" AND http status = BAD REQUEST', () => {
        const game = new GameEntity();
        game.isGamOver = true;

        jest.spyOn(gameRepository, 'getById').mockImplementation(() => game);

        const result = gameService.playerPickJoKenPo(
          expect.any(String),
          expect.any(String),
          expect.any(String),
        );
        const resultExpected = new HttpException(
          'Game over',
          HttpStatus.BAD_REQUEST,
        );

        expect(result).toEqual(resultExpected);
      });
    });

    describe('AND player not found', () => {
      it('SHOULD return instance of HttpException', () => {
        jest
          .spyOn(gameRepository, 'getById')
          .mockImplementation(() => new GameEntity());

        const result = gameService.playerPickJoKenPo(
          expect.any(String),
          expect.any(String),
          expect.any(String),
        );

        console.log(result);

        expect(result instanceof HttpException).toBe(true);
      });

      it('SHOULD return message = "Player not found" AND http status = NOT FOUND', () => {
        jest
          .spyOn(gameRepository, 'getById')
          .mockImplementation(() => new GameEntity());

        const result = gameService.playerPickJoKenPo(
          expect.any(String),
          expect.any(String),
          expect.any(String),
        );
        const resultExpected = new HttpException(
          'Player not found',
          HttpStatus.NOT_FOUND,
        );

        console.log(result);

        expect(result).toEqual(resultExpected);
      });
    });

    describe('AND player 1 pick', () => {
      it('SHOULD called GameEntity.playerPick', () => {
        const game = new GameEntity();
        game.player1 = new PlayerEntity('player1');

        jest.spyOn(gameRepository, 'getById').mockImplementation(() => game);
        jest.spyOn(GameEntity.prototype, 'playerPick');

        gameService.playerPickJoKenPo(
          expect.any(String),
          expect.any(String),
          expect.any(String),
        );

        expect(GameEntity.prototype.playerPick).toBeCalled();
      });

      it('SHOULD change player pick AND return game', () => {
        const expectedUsername = 'player1';
        const expectedPick = 'JO';

        const game = new GameEntity();
        game.player1 = new PlayerEntity(expectedUsername);

        jest.spyOn(gameRepository, 'getById').mockImplementation(() => game);

        const result = gameService.playerPickJoKenPo(
          game.id,
          expectedUsername,
          expectedPick,
        ) as GameEntity;

        expect(result.player1.username).toEqual(expectedUsername);
        expect(result.player1.pick).toEqual(expectedPick);
        expect(result instanceof GameEntity).toBe(true);
      });
    });

    describe('AND player 2 pick', () => {
      it('SHOULD called GameEntity.playerPick', () => {
        const game = new GameEntity();
        game.player1 = new PlayerEntity('player1');
        game.player2 = new PlayerEntity('player2');

        jest.spyOn(gameRepository, 'getById').mockImplementation(() => game);
        jest.spyOn(GameEntity.prototype, 'playerPick');

        gameService.playerPickJoKenPo(
          expect.any(String),
          expect.any(String),
          expect.any(String),
        );

        expect(GameEntity.prototype.playerPick).toBeCalled();
      });

      it('SHOULD change player pick AND return game', () => {
        const expectedUsername = 'player2';
        const expectedPick = 'JO';

        const game = new GameEntity();
        game.player1 = new PlayerEntity('player1');
        game.player2 = new PlayerEntity(expectedUsername);

        jest.spyOn(gameRepository, 'getById').mockImplementation(() => game);

        const result = gameService.playerPickJoKenPo(
          game.id,
          expectedUsername,
          expectedPick,
        ) as GameEntity;

        expect(result.player2.username).toEqual(expectedUsername);
        expect(result.player2.pick).toEqual(expectedPick);
        expect(result instanceof GameEntity).toBe(true);
      });
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
          ({ player1Pick, player2Pick }) => {
            const game = new GameEntity();
            game.player1 = new PlayerEntity('player1');
            game.player2 = new PlayerEntity('player2');

            jest
              .spyOn(gameRepository, 'getById')
              .mockImplementation(() => game);
            jest.spyOn(GameEntity.prototype, 'playerPick');

            gameService.playerPickJoKenPo(game.id, 'player1', player1Pick);

            const result = gameService.playerPickJoKenPo(
              game.id,
              'player2',
              player2Pick,
            ) as GameEntity;

            expect(result.winner).toEqual(undefined);
          },
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
          ({ player1Pick, player2Pick }) => {
            const game = new GameEntity();
            game.player1 = new PlayerEntity('player1');
            game.player2 = new PlayerEntity('player2');

            jest
              .spyOn(gameRepository, 'getById')
              .mockImplementation(() => game);
            jest.spyOn(GameEntity.prototype, 'playerPick');

            gameService.playerPickJoKenPo(game.id, 'player1', player1Pick);

            const result = gameService.playerPickJoKenPo(
              game.id,
              'player2',
              player2Pick,
            ) as GameEntity;

            expect(result.winner).toEqual(result.player1.username);
          },
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
          ({ player1Pick, player2Pick }) => {
            const game = new GameEntity();
            game.player1 = new PlayerEntity('player1');
            game.player2 = new PlayerEntity('player2');

            jest
              .spyOn(gameRepository, 'getById')
              .mockImplementation(() => game);
            jest.spyOn(GameEntity.prototype, 'playerPick');

            gameService.playerPickJoKenPo(game.id, 'player1', player1Pick);

            const result = gameService.playerPickJoKenPo(
              game.id,
              'player2',
              player2Pick,
            ) as GameEntity;

            expect(result.winner).toEqual(result.player2.username);
          },
        );
      });
    });
  });
});
