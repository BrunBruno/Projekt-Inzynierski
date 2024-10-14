import { setupServer } from "msw/node";
import { DefaultBodyType, MockedRequest, rest, RestHandler } from "msw";
import {
  CheckIfInGameDto,
  CheckIfUpdateRequiredDto,
  CreateGameByEmailDto,
  CreateGameWithLinkDto,
  CreatePrivateGameDto,
  FetchTimeDto,
  GetAllFinishedGamesDto,
  GetAllInvitationsDto,
  GetAllMessagesDto,
  GetEndedGameDto,
  GetGameDto,
  GetGameTimingDto,
  GetOpponentDto,
  GetPlayerDto,
  GetTypeHistoryDto,
  SearchGameDto,
} from "../types/gameDtos";
import { PagedResult } from "../types/abstractDtosAndModels";
import { friendshipControllerPaths, gameControllerPaths, userControllerPaths } from "./ApiService";
import {
  GetByEmailDto,
  GetEloDto,
  GetFullUserDto,
  GetOtherUserDto,
  GetRegisterConfDto,
  GetUserDto,
  IsEmailVerifiedDto,
  LogInUserDto,
} from "../types/userDtos";
import { DataConfiguration } from "../objects/entitiesEnums";
import { GetAllFriendsByStatusDto, GetAllNonFriendsDto, GetFriendProfileDto } from "../types/friendshipDtos";

type UserControllerServerParams = {
  logInUserDto?: LogInUserDto;
  getUserDto?: GetUserDto;
  getFullUserDto?: GetFullUserDto;
  getOtherUserDto?: GetOtherUserDto;
  getEloDto?: GetEloDto;
  isEmailVerifiedDto?: IsEmailVerifiedDto;
  getByEmailDto?: GetByEmailDto;
};

type GameControllerServerParams = {
  searchGameDto?: SearchGameDto;
  createPrivateGameDto?: CreatePrivateGameDto;
  createGameByEmailDto?: CreateGameByEmailDto;
  createGameWithLinkDto?: CreateGameWithLinkDto;
  checkIfInGameDto?: CheckIfInGameDto;
  checkIfUpdateRequiredDto?: CheckIfUpdateRequiredDto;
  getGameDto?: GetGameDto;
  getPlayerDto?: GetPlayerDto;
  fetchTimeDto?: FetchTimeDto;
  getOpponentDto?: GetOpponentDto;
  getEndedGameDto?: GetEndedGameDto;
  getGameTimingDto?: GetGameTimingDto;
  getAllFinishedGamesDtoList?: GetAllFinishedGamesDto[];
  getTypeHistoryDtoList?: GetTypeHistoryDto[];
  getAllInvitationsDtoList?: GetAllInvitationsDto[];
  getAllMessagesDtoList?: GetAllMessagesDto[];
};

type FriendshipControllerServerParams = {
  getAllFriendsByStatusDtoList?: GetAllFriendsByStatusDto[];
  getAllNonFriendsDtoList?: GetAllNonFriendsDto[];
  getFriendProfileDto?: GetFriendProfileDto;
};

type CreateMockServerParams = GameControllerServerParams &
  UserControllerServerParams &
  FriendshipControllerServerParams;

// function to create a mock server
export const createMockServer = (mockResult: CreateMockServerParams) => {
  const externHandlers: RestHandler<MockedRequest<DefaultBodyType>>[] = [
    rest.get("https://ipinfo.io", (_, res, ctx) => {
      return res(ctx.status(200), ctx.json({ data: { country: "PL" } }));
    }),
  ];

  // user controller handler
  const userControllerHandlers: RestHandler<MockedRequest<DefaultBodyType>>[] = [
    // register user
    rest.post(userControllerPaths.registerUser, (_, res, ctx) => {
      return res(ctx.status(200));
    }),

    // login user
    rest.post(userControllerPaths.logInUser, (_, res, ctx) => {
      if (!mockResult.logInUserDto) {
        console.error("mock LogInUserDto not provided");
        return res(ctx.status(500), ctx.json(null));
      }

      return res(ctx.status(200), ctx.json<LogInUserDto>(mockResult.logInUserDto));
    }),

    // regenerate code
    rest.post(userControllerPaths.regenerateCode, (_, res, ctx) => {
      return res(ctx.status(200));
    }),

    // verify email
    rest.put(userControllerPaths.verifyEmail, (_, res, ctx) => {
      return res(ctx.status(200));
    }),

    // update profile
    rest.put(userControllerPaths.updateProfile, (_, res, ctx) => {
      return res(ctx.status(200));
    }),

    // get user
    rest.get(userControllerPaths.getUser, (_, res, ctx) => {
      if (!mockResult.getUserDto) {
        console.error("mock GetUserDto not provided");
        return res(ctx.status(500), ctx.json(null));
      }

      return res(ctx.status(200), ctx.json<GetUserDto>(mockResult.getUserDto));
    }),

    // get full user
    rest.get(userControllerPaths.getFullUser, (_, res, ctx) => {
      if (!mockResult.getFullUserDto) {
        console.error("mock GetFullUserDto not provided");
        return res(ctx.status(500), ctx.json(null));
      }

      return res(ctx.status(200), ctx.json<GetFullUserDto>(mockResult.getFullUserDto));
    }),

    // get other user
    rest.get(userControllerPaths.getOtherUser, (_, res, ctx) => {
      if (!mockResult.getOtherUserDto) {
        console.error("mock GetOtherUserDto not provided");
        return res(ctx.status(500), ctx.json(null));
      }

      return res(ctx.status(200), ctx.json<GetOtherUserDto>(mockResult.getOtherUserDto));
    }),

    // get elo
    rest.get(userControllerPaths.getElo, (_, res, ctx) => {
      if (!mockResult.getEloDto) {
        console.error("mock GetEloDto not provided");
        return res(ctx.status(500), ctx.json(null));
      }

      return res(ctx.status(200), ctx.json<GetEloDto>(mockResult.getEloDto));
    }),

    // is verified
    rest.get(userControllerPaths.isVerified, (_, res, ctx) => {
      if (!mockResult.isEmailVerifiedDto) {
        console.error("mock IsEmailVerifiedDto not provided");
        return res(ctx.status(500), ctx.json(null));
      }

      return res(ctx.status(200), ctx.json<IsEmailVerifiedDto>(mockResult.isEmailVerifiedDto));
    }),

    // get by email
    rest.get(userControllerPaths.getByEmail, (_, res, ctx) => {
      if (!mockResult.getByEmailDto) {
        console.error("mock IsEmailVerifiedDto not provided");
        return res(ctx.status(500), ctx.json(null));
      }

      return res(ctx.status(200), ctx.json<GetByEmailDto>(mockResult.getByEmailDto));
    }),

    // get register configuration
    rest.get(userControllerPaths.getRegisterConf, (req, res, ctx) => {
      const configId = req.url.searchParams.get("configurationId");

      if (!configId) {
        console.error("configurationId not exists");
        return res(ctx.status(500), ctx.json(null));
      }

      let response: GetRegisterConfDto;

      if (parseInt(configId) === DataConfiguration.userPassword) {
        response = {
          minLength: 5,
          maxLength: null,
          requireUppercase: false,
          requireLowercase: false,
          requireDigit: true,
          requireSpecialChar: false,
        };

        return res(ctx.status(200), ctx.json<GetRegisterConfDto>(response));
      } else if (parseInt(configId) === DataConfiguration.userName) {
        response = {
          minLength: 5,
          maxLength: 30,
          requireUppercase: false,
          requireLowercase: false,
          requireDigit: false,
          requireSpecialChar: false,
        };

        return res(ctx.status(200), ctx.json<GetRegisterConfDto>(response));
      }
    }),
  ];
  //*/

  // game controller handlers
  const gameControllerHandlers: RestHandler<MockedRequest<DefaultBodyType>>[] = [
    /** STATIC */

    // start search
    rest.post(gameControllerPaths.startSearch, (_, res, ctx) => {
      if (!mockResult.searchGameDto) {
        console.error("mock SearchGameDto not provided");
        return res(ctx.status(500), ctx.json(null));
      }

      return res(ctx.status(200), ctx.json<SearchGameDto>(mockResult.searchGameDto));
    }),

    // create private game
    rest.post(gameControllerPaths.createPrivateGame, (_, res, ctx) => {
      if (!mockResult.createPrivateGameDto) {
        console.error("mock CreatePrivateGameDto not provided");
        return res(ctx.status(500), ctx.json(null));
      }

      return res(ctx.status(200), ctx.json<CreatePrivateGameDto>(mockResult.createPrivateGameDto));
    }),

    // create game by email
    rest.post(gameControllerPaths.createGameByEmail, (_, res, ctx) => {
      if (!mockResult.createGameByEmailDto) {
        console.error("mock CreateGameByEmailDto not provided");
        return res(ctx.status(500), ctx.json(null));
      }

      return res(ctx.status(200), ctx.json<CreateGameByEmailDto>(mockResult.createGameByEmailDto));
    }),

    // create game with link
    rest.post(gameControllerPaths.createGameWithLink, (_, res, ctx) => {
      if (!mockResult.createGameWithLinkDto) {
        console.error("mock CreateGameWithLinDto not provided");
        return res(ctx.status(500), ctx.json(null));
      }

      return res(ctx.status(200), ctx.json<CreateGameWithLinkDto>(mockResult.createGameWithLinkDto));
    }),

    // create rematch game
    rest.post(gameControllerPaths.createRematchGame, (_, res, ctx) => {
      return res(ctx.status(200));
    }),

    // check if in game
    rest.get(gameControllerPaths.checkIfInGame, (_, res, ctx) => {
      if (!mockResult.checkIfInGameDto) {
        console.error("mock CheckIfInGameDto not provided");
        return res(ctx.status(500), ctx.json(null));
      }

      return res(ctx.status(200), ctx.json<CheckIfInGameDto>(mockResult.checkIfInGameDto));
    }),

    // get all finished games
    rest.get(gameControllerPaths.getAllFinishedGames, (_, res, ctx) => {
      if (!mockResult.getAllFinishedGamesDtoList) {
        console.error("mock GetAllFinishedGamesDto not provided");
        return res(ctx.status(500), ctx.json(null));
      }

      const response: PagedResult<GetAllFinishedGamesDto> = createPagedResult(mockResult.getAllFinishedGamesDtoList);

      return res(ctx.status(200), ctx.json<PagedResult<GetAllFinishedGamesDto>>(response));
    }),

    // get type history
    rest.get(gameControllerPaths.getTypeHistory, (_, res, ctx) => {
      if (!mockResult.getTypeHistoryDtoList) {
        console.error("mock GetTypeHistoryDto not provided");
        return res(ctx.status(500), ctx.json(null));
      }

      const response: PagedResult<GetTypeHistoryDto> = createPagedResult(mockResult.getTypeHistoryDtoList);

      return res(ctx.status(200), ctx.json<PagedResult<GetTypeHistoryDto>>(response));
    }),

    // get all invitations
    rest.get(gameControllerPaths.getAllInvitations, (_, res, ctx) => {
      if (!mockResult.getAllInvitationsDtoList) {
        console.error("mock GetAllInvitationsDto not provided");
        return res(ctx.status(500), ctx.json(null));
      }

      const response: PagedResult<GetAllInvitationsDto> = createPagedResult(mockResult.getAllInvitationsDtoList);

      return res(ctx.status(200), ctx.json<PagedResult<GetAllInvitationsDto>>(response));
    }),

    // abort search
    rest.delete(gameControllerPaths.abortSearch, (_, res, ctx) => {
      return res(ctx.status(200));
    }),

    /** DYNAMIC */

    // get game
    rest.get(gameControllerPaths.getGame, (_, res, ctx) => {
      if (!mockResult.getGameDto) {
        console.error("mock GetGameDto not provided");
        return res(ctx.status(500), ctx.json(null));
      }

      return res(ctx.status(200), ctx.json<GetGameDto>(mockResult.getGameDto));
    }),

    // get player
    rest.get(gameControllerPaths.getPlayer, (_, res, ctx) => {
      if (!mockResult.getPlayerDto) {
        console.error("mock GetPlayerDto not provided");
        return res(ctx.status(500), ctx.json(null));
      }

      return res(ctx.status(200), ctx.json<GetPlayerDto>(mockResult.getPlayerDto));
    }),

    // fetch time
    rest.get(gameControllerPaths.fetchTime, (_, res, ctx) => {
      if (!mockResult.fetchTimeDto) {
        console.error("mock FetchTimeDto not provided");
        return res(ctx.status(500), ctx.json(null));
      }

      return res(ctx.status(200), ctx.json<FetchTimeDto>(mockResult.fetchTimeDto));
    }),

    // get opponent
    rest.get(gameControllerPaths.getOpponent, (_, res, ctx) => {
      if (!mockResult.getOpponentDto) {
        console.error("mock GetOpponentDto not provided");
        return res(ctx.status(500), ctx.json(null));
      }

      return res(ctx.status(200), ctx.json<GetOpponentDto>(mockResult.getOpponentDto));
    }),

    // get ended game
    rest.get(gameControllerPaths.getEndedGame, (_, res, ctx) => {
      if (!mockResult.getEndedGameDto) {
        console.error("mock GetEndedGameDto not provided");
        return res(ctx.status(500), ctx.json(null));
      }

      return res(ctx.status(200), ctx.json<GetEndedGameDto>(mockResult.getEndedGameDto));
    }),

    // get game timing
    rest.get(gameControllerPaths.getGameTiming, (_, res, ctx) => {
      if (!mockResult.getGameTimingDto) {
        console.error("mock GetGameTimingDto not provided");
        return res(ctx.status(500), ctx.json(null));
      }

      return res(ctx.status(200), ctx.json<GetGameTimingDto>(mockResult.getGameTimingDto));
    }),

    // get all messages
    rest.get(gameControllerPaths.getAllMessages, (_, res, ctx) => {
      if (!mockResult.getAllMessagesDtoList) {
        console.error("mock GetAllMessagesDto not provided");
        return res(ctx.status(500), ctx.json(null));
      }

      const response: PagedResult<GetAllMessagesDto> = createPagedResult(mockResult.getAllMessagesDtoList);

      return res(ctx.status(200), ctx.json<PagedResult<GetAllMessagesDto>>(response));
    }),

    // cancel private game
    rest.delete(gameControllerPaths.cancelPrivateGame, (_, res, ctx) => {
      return res(ctx.status(200));
    }),

    // check if update required
    rest.get(gameControllerPaths.checkIfUpdateRequired, (_, res, ctx) => {
      if (!mockResult.checkIfUpdateRequiredDto) {
        console.error("mock CheckIfUpdateRequiredDto not provided");
        return res(ctx.status(500), ctx.json(null));
      }

      return res(ctx.status(200), ctx.json<CheckIfUpdateRequiredDto>(mockResult.checkIfUpdateRequiredDto));
    }),
  ];

  // friendship controller handlers
  const friendshipControllerHandlers: RestHandler<MockedRequest<DefaultBodyType>>[] = [
    /** STATIC */

    // invite friend
    rest.post(friendshipControllerPaths.inviteFriend, (_, res, ctx) => {
      return res(ctx.status(200));
    }),

    // get all friends by status
    rest.get(friendshipControllerPaths.getAllFriendsByStatus, (_, res, ctx) => {
      if (!mockResult.getAllFriendsByStatusDtoList) {
        console.error("mock GetAllFriendsByStatusDto not provided");
        return res(ctx.status(500), ctx.json(null));
      }

      const response: PagedResult<GetAllFriendsByStatusDto> = createPagedResult(
        mockResult.getAllFriendsByStatusDtoList
      );

      return res(ctx.status(200), ctx.json<PagedResult<GetAllFriendsByStatusDto>>(response));
    }),

    // get all friends by status
    rest.get(friendshipControllerPaths.getAllNonFriends, (_, res, ctx) => {
      if (!mockResult.getAllNonFriendsDtoList) {
        console.error("mock GetAllNonFriendsDto not provided");
        return res(ctx.status(500), ctx.json(null));
      }

      const response: PagedResult<GetAllNonFriendsDto> = createPagedResult(mockResult.getAllNonFriendsDtoList);

      return res(ctx.status(200), ctx.json<PagedResult<GetAllNonFriendsDto>>(response));
    }),

    /** DYNAMIC */

    // respond to friend request
    rest.put(friendshipControllerPaths.respondToFriendRequest, (_, res, ctx) => {
      return res(ctx.status(200));
    }),

    // get game timing
    rest.get(friendshipControllerPaths.getFriendProfile, (_, res, ctx) => {
      if (!mockResult.getFriendProfileDto) {
        console.error("mock GetFriendProfileDto not provided");
        return res(ctx.status(500), ctx.json(null));
      }

      return res(ctx.status(200), ctx.json<GetFriendProfileDto>(mockResult.getFriendProfileDto));
    }),

    // remove friend
    rest.delete(friendshipControllerPaths.removeFriend, (_, res, ctx) => {
      return res(ctx.status(200));
    }),
  ];
  //*/

  return setupServer(
    ...[...externHandlers, ...userControllerHandlers, ...gameControllerHandlers, ...friendshipControllerHandlers]
  );
};

const createPagedResult = <T>(data: T[]): PagedResult<T> => {
  return {
    items: data,
    totalPages: 1,
    itemsFrom: 1,
    itemsTo: data.length,
    totalItemsCount: data.length,
  };
};
