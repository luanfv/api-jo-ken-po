import { Test } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';

import { GameService } from './game.service';
import { GameRepository, Game } from '../repositories/game.repository';
import { PlayerRepository, Player } from '../repositories/player.repository';
import { prisma } from '../../databases/prisma';

describe('GameService', () => {
  let gameService: GameService;
  let gameRepository: GameRepository;
  let playerRepository: PlayerRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [GameService, GameRepository, PlayerRepository],
    }).compile();

    gameService = moduleRef.get<GameService>(GameService);
    gameRepository = moduleRef.get<GameRepository>(GameRepository);
    playerRepository = moduleRef.get<PlayerRepository>(PlayerRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('WHEN called createGame', () => {
    it('SHOULD called GameRepository.create', async () => {
      jest.spyOn(gameRepository, 'create');
      jest
        .spyOn(prisma.game, 'create')
        .mockResolvedValueOnce(expect.anything());

      await gameService.createGame();

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

        jest.spyOn(prisma.game, 'create').mockResolvedValueOnce(game);

        const result = await gameService.createGame();
        const expectedResult = game;

        expect(result).toEqual(expectedResult);
      });
    });

    describe('AND cannot create new game', () => {
      it('SHOULD return a HttpException', async () => {
        jest.spyOn(prisma.game, 'create').mockRejectedValueOnce(null);

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
      jest.spyOn(gameRepository, 'getById');
      jest
        .spyOn(prisma.game, 'findFirst')
        .mockResolvedValueOnce(expect.anything());

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

        jest.spyOn(gameRepository, 'getById');
        jest.spyOn(prisma.game, 'findFirst').mockResolvedValueOnce(game);

        const result = await gameService.getGameById(expect.any(String));
        const expectedResult = game;

        expect(result).toEqual(expectedResult);
      });
    });

    describe('AND cannot game found', () => {
      it('SHOULD return a HttpException', async () => {
        jest.spyOn(gameRepository, 'getById');
        jest.spyOn(prisma.game, 'findFirst').mockRejectedValueOnce(null);

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
    it('SHOULD called GameRepository.getById', async () => {
      jest.spyOn(playerRepository, 'getByGameId');
      jest
        .spyOn(prisma.player, 'findMany')
        .mockResolvedValueOnce(expect.anything());

      await gameService.addPlayerInGame('', '');

      expect(playerRepository.getByGameId).toBeCalled();
    });

    describe('AND game not found', () => {
      it('SHOULD return a HttpException', async () => {
        jest.spyOn(prisma.player, 'findMany').mockRejectedValueOnce(null);

        const result = await gameService.addPlayerInGame('', '');
        const expectedResult = new HttpException(
          'Game not found',
          HttpStatus.NOT_FOUND,
        );

        expect(result).toEqual(expectedResult);
      });
    });

    describe('AND fame already has enough players', () => {
      it('SHOULD return a HttpException', async () => {
        const existingPlayers: Player[] = [
          {
            created_at: expect.any(Date),
            game_id: expect.any(String),
            id: expect.any(String),
            pick: expect.any(String),
            username: 'player1',
          },
          {
            created_at: expect.any(Date),
            game_id: expect.any(String),
            id: expect.any(String),
            pick: expect.any(String),
            username: 'player2',
          },
        ];

        jest
          .spyOn(prisma.player, 'findMany')
          .mockResolvedValueOnce(existingPlayers);

        const result = await gameService.addPlayerInGame('', 'player3');
        const expectedResult = new HttpException(
          'Game already has enough players',
          HttpStatus.BAD_REQUEST,
        );

        expect(result).toEqual(expectedResult);
      });
    });

    describe('AND username player 1 already exists', () => {
      it('SHOULD return a HttpException', async () => {
        const existingPlayer: Player = {
          created_at: expect.any(Date),
          game_id: expect.any(String),
          id: expect.any(String),
          pick: expect.any(String),
          username: 'player1',
        };

        jest
          .spyOn(prisma.player, 'findMany')
          .mockResolvedValueOnce([existingPlayer]);

        const result = await gameService.addPlayerInGame('', 'player1');
        const expectedResult = new HttpException(
          'Player already exists',
          HttpStatus.CONFLICT,
        );

        expect(result).toEqual(expectedResult);
      });
    });

    describe('AND player 1 is not registered', () => {
      it('SHOULD register AND return new player 1', async () => {
        const player: Player = {
          created_at: expect.any(Date),
          game_id: expect.any(String),
          id: expect.any(String),
          pick: expect.any(String),
          username: expect.any(String),
        };

        jest.spyOn(prisma.player, 'findMany').mockResolvedValueOnce([]);
        jest.spyOn(prisma.player, 'create').mockResolvedValueOnce(player);

        const result = await gameService.addPlayerInGame('', '');

        expect(result).toEqual(player);
      });
    });

    describe('AND cannot create player', () => {
      it('SHOULD return a HttpException', async () => {
        jest.spyOn(prisma.player, 'findMany').mockResolvedValueOnce([]);
        jest.spyOn(prisma.player, 'create').mockRejectedValueOnce(null);

        const result = await gameService.addPlayerInGame('', '');
        const expectedResult = new HttpException(
          'Internal server error in create player',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );

        expect(result).toEqual(expectedResult);
      });
    });

    describe('AND player 1 is registered', () => {
      it('SHOULD return new player 2', async () => {
        const existingPlayer: Player = {
          created_at: expect.any(Date),
          game_id: expect.any(String),
          id: expect.any(String),
          pick: expect.any(String),
          username: 'player1',
        };
        jest
          .spyOn(prisma.player, 'findMany')
          .mockResolvedValueOnce([existingPlayer]);

        const newPlayerName = 'player2';
        const newPlayer: Player = {
          created_at: expect.any(Date),
          game_id: expect.any(String),
          id: expect.any(String),
          pick: expect.any(String),
          username: newPlayerName,
        };
        jest.spyOn(prisma.player, 'create').mockResolvedValueOnce(newPlayer);

        const result = (await gameService.addPlayerInGame(
          '',
          newPlayerName,
        )) as Player;

        expect(result.username).toEqual(newPlayerName);
      });
    });
  });

  describe('WHEN called playerPick', () => {
    it('SHOULD called GameRepository.getById', async () => {
      jest.spyOn(gameRepository, 'getById');
      jest.spyOn(prisma.game, 'findFirst').mockRejectedValueOnce(null);

      await gameService.playerPick('', '', 'JO');

      expect(gameRepository.getById).toBeCalled();
    });

    describe('AND game not found', () => {
      it('SHOULD return a HttpException', async () => {
        jest.spyOn(prisma.game, 'findFirst').mockRejectedValueOnce(null);

        const result = await gameService.playerPick('', '', 'JO');
        const expectedResult = new HttpException(
          'Game not found',
          HttpStatus.NOT_FOUND,
        );

        expect(result).toEqual(expectedResult);
      });
    });

    describe('AND game over', () => {
      it('SHOULD return a HttpException', async () => {
        const game: Game = {
          created_at: expect.any(Date),
          id: expect.any(String),
          winner_id: expect.any(String),
          is_game_over: true,
        };

        jest.spyOn(prisma.game, 'findFirst').mockResolvedValueOnce(game);

        const result = await gameService.playerPick('', '', 'JO');
        const expectedResult = new HttpException(
          'Game over',
          HttpStatus.NOT_FOUND,
        );

        expect(result).toEqual(expectedResult);
      });
    });

    describe('AND player not found', () => {
      it('SHOULD return a HttpException', async () => {
        const game: Game = {
          created_at: expect.any(Date),
          id: expect.any(String),
          winner_id: expect.any(String),
          is_game_over: false,
        };

        jest.spyOn(prisma.game, 'findFirst').mockResolvedValueOnce(game);
        jest.spyOn(prisma.player, 'findFirst').mockRejectedValueOnce(null);

        const result = await gameService.playerPick('', '', 'JO');
        const expectedResult = new HttpException(
          'Player not found',
          HttpStatus.NOT_FOUND,
        );

        expect(result).toEqual(expectedResult);
      });
    });

    describe('AND cannot set pick', () => {
      it('SHOULD return a HttpException', async () => {
        const game: Game = {
          created_at: expect.any(Date),
          id: expect.any(String),
          winner_id: expect.any(String),
          is_game_over: false,
        };
        jest.spyOn(prisma.game, 'findFirst').mockResolvedValueOnce(game);

        const player: Player = {
          created_at: expect.any(Date),
          id: expect.any(String),
          game_id: expect.any(String),
          pick: expect.any(String),
          username: expect.any(String),
        };
        jest.spyOn(prisma.player, 'findFirst').mockResolvedValueOnce(player);

        jest.spyOn(prisma.player, 'update').mockRejectedValueOnce(null);

        const result = await gameService.playerPick('', '', 'JO');
        const expectedResult = new HttpException(
          'Internal server error in set player pick',
          HttpStatus.NOT_FOUND,
        );

        expect(result).toEqual(expectedResult);
      });
    });

    describe('AND return player set pick', () => {
      it('SHOULD return updated player', async () => {
        jest.spyOn(gameRepository, 'getById');

        const game: Game = {
          created_at: expect.any(Date),
          id: expect.any(String),
          winner_id: expect.any(String),
          is_game_over: false,
        };
        jest.spyOn(prisma.game, 'findFirst').mockResolvedValueOnce(game);

        const player: Player = {
          created_at: expect.any(Date),
          id: expect.any(String),
          game_id: expect.any(String),
          pick: 'KEN',
          username: expect.any(String),
        };
        jest.spyOn(prisma.player, 'findFirst').mockResolvedValueOnce(player);

        jest
          .spyOn(prisma.player, 'update')
          .mockResolvedValueOnce({ ...player, pick: 'KEN' });

        const result = await gameService.playerPick('', '', 'JO');
        const expectedResult: Player = { ...player, pick: 'KEN' };

        expect(result).toEqual(expectedResult);
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
