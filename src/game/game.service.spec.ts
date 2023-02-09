import { HttpException, HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { GameService } from './game.service';
import { GameRepository } from './game.repository';
import { GameEntity } from './game.entity';

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

    describe('AND do not have the game registered', () => {
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
        const httpException = new HttpException(
          'Game not found',
          HttpStatus.NOT_FOUND,
        );

        expect(result).toEqual(httpException);
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
});
