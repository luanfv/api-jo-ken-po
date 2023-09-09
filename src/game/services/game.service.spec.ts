import { Test } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';

import { GameService } from './game.service';
import { GameRepository, Game } from '../repositories/game.repository';
import { PlayerRepository, Player } from '../repositories/player.repository';
import { PrismaService } from '../../databases/prisma.service';
import { DatabasesModule } from '../../databases/databases.module';

describe('GameService', () => {
  let gameService: GameService;
  let gameRepository: GameRepository;
  let playerRepository: PlayerRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DatabasesModule],
      providers: [GameService, GameRepository, PlayerRepository],
    }).compile();

    gameService = moduleRef.get<GameService>(GameService);
    gameRepository = moduleRef.get<GameRepository>(GameRepository);
    playerRepository = moduleRef.get<PlayerRepository>(PlayerRepository);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('WHEN call createGame', () => {
    it('SHOULD call GameRepository.create', async () => {
      jest.spyOn(gameRepository, 'create');
      jest
        .spyOn(prismaService.game, 'create')
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

        jest.spyOn(prismaService.game, 'create').mockResolvedValueOnce(game);

        const result = await gameService.createGame();
        const expectedResult = game;

        expect(result).toEqual(expectedResult);
      });
    });

    describe('AND cannot create new game', () => {
      it('SHOULD return a HttpException', async () => {
        jest.spyOn(prismaService.game, 'create').mockRejectedValueOnce(null);

        const result = await gameService.createGame();
        const expectedResult = new HttpException(
          'Internal server error in create game',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );

        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe('WHEN call getGameById', () => {
    it('SHOULD call GameRepository.getById', () => {
      jest.spyOn(gameRepository, 'getById');
      jest
        .spyOn(prismaService.game, 'findFirst')
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
        jest.spyOn(prismaService.game, 'findFirst').mockResolvedValueOnce(game);

        const result = await gameService.getGameById(expect.any(String));
        const expectedResult = game;

        expect(result).toEqual(expectedResult);
      });
    });

    describe('AND cannot game found', () => {
      it('SHOULD return a HttpException', async () => {
        jest.spyOn(gameRepository, 'getById');
        jest.spyOn(prismaService.game, 'findFirst').mockRejectedValueOnce(null);

        const result = await gameService.getGameById(expect.any(String));
        const expectedResult = new HttpException(
          'Game not found',
          HttpStatus.NOT_FOUND,
        );

        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe('WHEN call addPlayerInGame', () => {
    it('SHOULD call GameRepository.getById', async () => {
      jest.spyOn(playerRepository, 'getByGameId');
      jest
        .spyOn(prismaService.game, 'findFirst')
        .mockResolvedValueOnce(expect.anything());
      jest
        .spyOn(prismaService.player, 'findMany')
        .mockResolvedValueOnce(expect.anything());

      await gameService.addPlayerInGame('', '');

      expect(playerRepository.getByGameId).toBeCalled();
    });

    describe('AND game not found', () => {
      it('SHOULD return a HttpException', async () => {
        jest.spyOn(prismaService.game, 'findFirst').mockRejectedValueOnce(null);

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
          .spyOn(prismaService.game, 'findFirst')
          .mockResolvedValueOnce(expect.anything());
        jest
          .spyOn(prismaService.player, 'findMany')
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
          .spyOn(prismaService.game, 'findFirst')
          .mockResolvedValueOnce(expect.anything());
        jest
          .spyOn(prismaService.player, 'findMany')
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

        jest
          .spyOn(prismaService.game, 'findFirst')
          .mockResolvedValueOnce(expect.anything());
        jest.spyOn(prismaService.player, 'findMany').mockResolvedValueOnce([]);
        jest
          .spyOn(prismaService.player, 'create')
          .mockResolvedValueOnce(player);

        const result = await gameService.addPlayerInGame('', '');

        expect(result).toEqual(player);
      });
    });

    describe('AND cannot create player', () => {
      it('SHOULD return a HttpException', async () => {
        jest
          .spyOn(prismaService.game, 'findFirst')
          .mockResolvedValueOnce(expect.anything());
        jest.spyOn(prismaService.player, 'findMany').mockResolvedValueOnce([]);
        jest.spyOn(prismaService.player, 'create').mockRejectedValueOnce(null);

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
          .spyOn(prismaService.game, 'findFirst')
          .mockResolvedValueOnce(expect.anything());
        jest
          .spyOn(prismaService.player, 'findMany')
          .mockResolvedValueOnce([existingPlayer]);

        const newPlayerName = 'player2';
        const newPlayer: Player = {
          created_at: expect.any(Date),
          game_id: expect.any(String),
          id: expect.any(String),
          pick: expect.any(String),
          username: newPlayerName,
        };
        jest
          .spyOn(prismaService.player, 'create')
          .mockResolvedValueOnce(newPlayer);

        const result = (await gameService.addPlayerInGame(
          '',
          newPlayerName,
        )) as Player;

        expect(result.username).toEqual(newPlayerName);
      });
    });
  });

  describe('WHEN call playerPick', () => {
    it('SHOULD call GameRepository.getById', async () => {
      jest.spyOn(gameRepository, 'getById');
      jest.spyOn(prismaService.game, 'findFirst').mockRejectedValueOnce(null);

      await gameService.playerPick('', '', 'JO');

      expect(gameRepository.getById).toBeCalled();
    });

    describe('AND game not found', () => {
      it('SHOULD return a HttpException', async () => {
        jest.spyOn(prismaService.game, 'findFirst').mockRejectedValueOnce(null);

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
          id: '321',
          winner_id: expect.any(String),
          is_game_over: true,
        };
        const player: Player = {
          created_at: expect.any(Date),
          id: '123',
          game_id: '321',
          pick: expect.any(String),
          username: expect.any(String),
        };

        jest.spyOn(prismaService.game, 'findFirst').mockResolvedValueOnce(game);
        jest
          .spyOn(prismaService.player, 'findFirst')
          .mockResolvedValueOnce(player);

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

        jest.spyOn(prismaService.game, 'findFirst').mockResolvedValueOnce(game);
        jest
          .spyOn(prismaService.player, 'findFirst')
          .mockRejectedValueOnce(null);

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
          id: 'abc',
          winner_id: expect.any(String),
          is_game_over: false,
        };
        jest.spyOn(prismaService.game, 'findFirst').mockResolvedValueOnce(game);

        const player: Player = {
          created_at: expect.any(Date),
          id: 'cba',
          game_id: 'abc',
          pick: expect.any(String),
          username: expect.any(String),
        };
        jest
          .spyOn(prismaService.player, 'findFirst')
          .mockResolvedValueOnce(player);

        jest.spyOn(prismaService.player, 'update').mockRejectedValueOnce(null);

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
          id: 'qwe',
          winner_id: expect.any(String),
          is_game_over: false,
        };
        jest.spyOn(prismaService.game, 'findFirst').mockResolvedValueOnce(game);

        const player: Player = {
          created_at: expect.any(Date),
          id: 'ewq',
          game_id: 'qwe',
          pick: 'KEN',
          username: expect.any(String),
        };
        jest
          .spyOn(prismaService.player, 'findFirst')
          .mockResolvedValueOnce(player);

        jest
          .spyOn(prismaService.player, 'update')
          .mockResolvedValueOnce({ ...player, pick: 'KEN' });

        const result = await gameService.playerPick('', '', 'JO');
        const expectedResult: Player = { ...player, pick: 'KEN' };

        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe('WHEN call restartGame', () => {
    it('SHOULD call GameRepository.getById', async () => {
      jest.spyOn(gameRepository, 'restartById');
      jest.spyOn(prismaService.game, 'update').mockRejectedValueOnce(null);

      await gameService.restartGame('');

      expect(gameRepository.restartById).toBeCalled();
    });

    describe('AND game not found', () => {
      it('SHOULD return instance of HttpException', async () => {
        jest.spyOn(gameRepository, 'restartById');
        jest.spyOn(prismaService.game, 'update').mockRejectedValueOnce(null);

        const result = await gameService.restartGame('');
        const expectedResult = new HttpException(
          'Game is not found',
          HttpStatus.NOT_FOUND,
        );

        expect(result).toEqual(expectedResult);
      });
    });

    describe('AND reset game', () => {
      it('SHOULD change isGamOver to false', async () => {
        const mockGame: Game = {
          created_at: expect.any(Date),
          id: expect.any(String),
          is_game_over: false,
          winner_id: null,
        };

        jest.spyOn(gameRepository, 'restartById');
        jest
          .spyOn(prismaService.game, 'update')
          .mockResolvedValueOnce(mockGame);

        const result = await gameService.restartGame('');
        const expectedResult = mockGame;

        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe('WHEN call finishGame', () => {
    it('SHOULD call GameRepository.getById', async () => {
      jest.spyOn(gameRepository, 'getById');
      jest.spyOn(prismaService.game, 'findFirst').mockRejectedValueOnce(null);

      await gameService.finishGame('');

      expect(gameRepository.getById).toBeCalled();
    });

    describe('AND game not found', () => {
      it('SHOULD return a instance HttpException', async () => {
        jest.spyOn(gameRepository, 'getById');
        jest.spyOn(prismaService.game, 'findFirst').mockRejectedValueOnce(null);

        const result = await gameService.finishGame('');
        const expectedResult = new HttpException(
          'Game not found',
          HttpStatus.NOT_FOUND,
        );

        expect(result).toEqual(expectedResult);
      });
    });

    describe('AND is not game over', () => {
      it('SHOULD return a instance HttpException', async () => {
        const mockGame: Game = {
          id: expect.any(String),
          created_at: expect.any(Date),
          is_game_over: true,
          winner_id: expect.any(String),
        };

        jest.spyOn(gameRepository, 'getById');
        jest
          .spyOn(prismaService.game, 'findFirst')
          .mockResolvedValueOnce(mockGame);

        const result = await gameService.finishGame('');
        const expectedResult = new HttpException(
          'This game is over, you need to restart the game',
          HttpStatus.BAD_REQUEST,
        );

        expect(result).toEqual(expectedResult);
      });
    });

    describe('AND not have two players', () => {
      it('SHOULD call PlayerRepository.getByGameId', async () => {
        const mockGame: Game = {
          id: expect.any(String),
          created_at: expect.any(Date),
          is_game_over: false,
          winner_id: expect.any(String),
        };

        jest.spyOn(gameRepository, 'getById');
        jest
          .spyOn(prismaService.game, 'findFirst')
          .mockResolvedValueOnce(mockGame);
        jest.spyOn(playerRepository, 'getByGameId');
        jest.spyOn(prismaService.player, 'findMany').mockRejectedValue(null);

        await gameService.finishGame('');

        expect(playerRepository.getByGameId).toBeCalled();
      });

      it('SHOULD return a instance HttpException', async () => {
        const mockGame: Game = {
          id: expect.any(String),
          created_at: expect.any(Date),
          is_game_over: false,
          winner_id: expect.any(String),
        };

        jest.spyOn(gameRepository, 'getById');
        jest
          .spyOn(prismaService.game, 'findFirst')
          .mockResolvedValueOnce(mockGame);
        jest.spyOn(playerRepository, 'getByGameId');
        jest.spyOn(prismaService.player, 'findMany').mockRejectedValue(null);

        const result = await gameService.finishGame('');
        const expectedResult = new HttpException(
          'Not enough players',
          HttpStatus.BAD_REQUEST,
        );

        expect(result).toEqual(expectedResult);
      });
    });

    describe('AND player1 is not play', () => {
      it('SHOULD return a instance HttpException', async () => {
        const mockGame: Game = {
          id: expect.any(String),
          created_at: expect.any(Date),
          is_game_over: false,
          winner_id: expect.any(String),
        };
        const mockPlayers: Player[] = [
          {
            id: expect.any(String),
            created_at: expect.any(Date),
            game_id: expect.any(String),
            pick: null,
            username: expect.any(String),
          },
          {
            id: expect.any(String),
            created_at: expect.any(Date),
            game_id: expect.any(String),
            pick: 'JO',
            username: expect.any(String),
          },
        ];

        jest.spyOn(gameRepository, 'getById');
        jest
          .spyOn(prismaService.game, 'findFirst')
          .mockResolvedValueOnce(mockGame);
        jest.spyOn(playerRepository, 'getByGameId');
        jest
          .spyOn(prismaService.player, 'findMany')
          .mockResolvedValueOnce(mockPlayers);

        const result = await gameService.finishGame('');
        const expectedResult = new HttpException(
          'Not all players pick',
          HttpStatus.BAD_REQUEST,
        );

        expect(result).toEqual(expectedResult);
      });
    });

    describe('AND player2 is not play', () => {
      it('SHOULD return a instance HttpException', async () => {
        const mockGame: Game = {
          id: expect.any(String),
          created_at: expect.any(Date),
          is_game_over: false,
          winner_id: expect.any(String),
        };
        const mockPlayers: Player[] = [
          {
            id: expect.any(String),
            created_at: expect.any(Date),
            game_id: expect.any(String),
            pick: 'JO',
            username: expect.any(String),
          },
          {
            id: expect.any(String),
            created_at: expect.any(Date),
            game_id: expect.any(String),
            pick: null,
            username: expect.any(String),
          },
        ];

        jest.spyOn(gameRepository, 'getById');
        jest
          .spyOn(prismaService.game, 'findFirst')
          .mockResolvedValueOnce(mockGame);
        jest.spyOn(playerRepository, 'getByGameId');
        jest
          .spyOn(prismaService.player, 'findMany')
          .mockResolvedValueOnce(mockPlayers);

        const result = await gameService.finishGame('');
        const expectedResult = new HttpException(
          'Not all players pick',
          HttpStatus.BAD_REQUEST,
        );

        expect(result).toEqual(expectedResult);
      });
    });

    describe('AND cannot update game in database', () => {
      it('SHOULD return a instance HttpException', async () => {
        const mockGame: Game = {
          id: expect.any(String),
          created_at: expect.any(Date),
          is_game_over: false,
          winner_id: expect.any(String),
        };
        const mockPlayers: Player[] = [
          {
            id: expect.any(String),
            created_at: expect.any(Date),
            game_id: expect.any(String),
            pick: 'JO',
            username: expect.any(String),
          },
          {
            id: expect.any(String),
            created_at: expect.any(Date),
            game_id: expect.any(String),
            pick: 'JO',
            username: expect.any(String),
          },
        ];

        jest.spyOn(gameRepository, 'getById');
        jest
          .spyOn(prismaService.game, 'findFirst')
          .mockResolvedValueOnce(mockGame);
        jest.spyOn(playerRepository, 'getByGameId');
        jest
          .spyOn(prismaService.player, 'findMany')
          .mockResolvedValueOnce(mockPlayers);

        const result = await gameService.finishGame('');
        const expectedResult = new HttpException(
          'Internal server error in finish game',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );

        expect(result).toEqual(expectedResult);
      });

      it('SHOULD call GameRepository.setWinnerById', async () => {
        const mockGame: Game = {
          id: expect.any(String),
          created_at: expect.any(Date),
          is_game_over: false,
          winner_id: expect.any(String),
        };
        const mockPlayers: Player[] = [
          {
            id: expect.any(String),
            created_at: expect.any(Date),
            game_id: expect.any(String),
            pick: 'JO',
            username: expect.any(String),
          },
          {
            id: expect.any(String),
            created_at: expect.any(Date),
            game_id: expect.any(String),
            pick: 'JO',
            username: expect.any(String),
          },
        ];

        jest.spyOn(gameRepository, 'getById');
        jest
          .spyOn(prismaService.game, 'findFirst')
          .mockResolvedValueOnce(mockGame);
        jest.spyOn(playerRepository, 'getByGameId');
        jest
          .spyOn(prismaService.player, 'findMany')
          .mockResolvedValueOnce(mockPlayers);
        jest.spyOn(gameRepository, 'setWinnerById').mockResolvedValueOnce(null);
        jest.spyOn(prismaService.game, 'update').mockRejectedValueOnce(null);

        await gameService.finishGame('');

        expect(gameRepository.setWinnerById).toBeCalled();
      });
    });

    describe('AND finish game', () => {
      it.each`
        player1  | player2  | winner
        ${'JO'}  | ${'PO'}  | ${'player1'}
        ${'KEN'} | ${'JO'}  | ${'player1'}
        ${'PO'}  | ${'KEN'} | ${'player1'}
        ${'PO'}  | ${'JO'}  | ${'player2'}
        ${'JO'}  | ${'KEN'} | ${'player2'}
        ${'KEN'} | ${'PO'}  | ${'player2'}
        ${'PO'}  | ${'PO'}  | ${null}
        ${'JO'}  | ${'JO'}  | ${null}
        ${'KEN'} | ${'KEN'} | ${null}
      `(
        'SHOULD return the game with $winner as the winner (player1 = $player1 and player2 = $player2)',
        async ({ player1, player2, winner }) => {
          const mockGame: Game = {
            id: expect.any(String),
            created_at: expect.any(Date),
            is_game_over: false,
            winner_id: expect.any(String),
          };
          const mockPlayers: Player[] = [
            {
              id: 'player1',
              created_at: expect.any(Date),
              game_id: expect.any(String),
              pick: player1,
              username: expect.any(String),
            },
            {
              id: 'player2',
              created_at: expect.any(Date),
              game_id: expect.any(String),
              pick: player2,
              username: expect.any(String),
            },
          ];

          jest.spyOn(gameRepository, 'getById');
          jest
            .spyOn(prismaService.game, 'findFirst')
            .mockResolvedValueOnce(mockGame);
          jest.spyOn(playerRepository, 'getByGameId');
          jest
            .spyOn(prismaService.player, 'findMany')
            .mockResolvedValueOnce(mockPlayers);
          jest
            .spyOn(gameRepository, 'setWinnerById')
            .mockResolvedValueOnce(expect.anything());
          jest
            .spyOn(prismaService.game, 'update')
            .mockResolvedValueOnce(expect.anything());

          const result = (await gameService.finishGame('')) as Game;
          const expectedResult: Game = {
            ...mockGame,
            is_game_over: true,
            winner_id: winner,
          };

          expect(result).toEqual(expectedResult);
        },
      );
    });
  });
});
