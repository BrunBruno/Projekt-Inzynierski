// import { setupServer } from "msw/node";
// import { http } from "msw";
// import {
//   CheckIfInWebGameDto,
//   CheckIfUpdateOnPrivateGameRequiredDto,
//   CreatePrivateGameByEmailDto,
//   CreatePrivateGameWithLinkDto,
//   CreatePrivateGameDto,
//   FetchTimeDto,
//   GetAllFinishedGamesDto,
//   GetAllInvitationsDto,
//   GetAllWebGameMessagesDto,
//   GetWebGameDto,
//   GetGameTimingDto,
//   GetOpponentDto,
//   GetWebGamePlayerDto,
//   GetTypeHistoryDto,
//   SearchWebGameDto,
// } from "../types/webGameDtos";
// import { PagedResult } from "../types/abstractDtosAndModels";
// import { friendshipControllerPaths, webGameControllerPaths, userControllerPaths } from "./ApiService";
// import {
//   GetByEmailDto,
//   GetEloDto,
//   GetFullUserDto,
//   GetOtherUserDto,
//   GetRegisterConfDto,
//   GetUserDto,
//   IsEmailVerifiedDto,
//   LogInUserDto,
// } from "../types/userDtos";
// import { DataConfiguration } from "../objects/entitiesEnums";
// import { GetAllFriendsByStatusDto, GetAllNonFriendsDto, GetFriendProfileDto } from "../types/friendshipDtos";

// type UserControllerServerParams = {
//   logInUserDto?: LogInUserDto;
//   getUserDto?: GetUserDto;
//   getFullUserDto?: GetFullUserDto;
//   getOtherUserDto?: GetOtherUserDto;
//   getEloDto?: GetEloDto;
//   isEmailVerifiedDto?: IsEmailVerifiedDto;
//   getByEmailDto?: GetByEmailDto;
// };

// type webGameControllerServerParams = {
//   SearchWebGameDto?: SearchWebGameDto;
//   createPrivateGameDto?: CreatePrivateGameDto;
//   createGameByEmailDto?: CreatePrivateGameByEmailDto;
//   CreatePrivateGameWithLinkDto?: CreatePrivateGameWithLinkDto;
//   checkIfInGameDto?: CheckIfInWebGameDto;
//   checkIfUpdateRequiredDto?: CheckIfUpdateOnPrivateGameRequiredDto;
//   GetWebGameDto?: GetWebGameDto;
//   getPlayerDto?: GetWebGamePlayerDto;
//   fetchTimeDto?: FetchTimeDto;
//   getOpponentDto?: GetOpponentDto;
//   getGameTimingDto?: GetGameTimingDto;
//   getAllFinishedGamesDtoList?: GetAllFinishedGamesDto[];
//   getTypeHistoryDtoList?: GetTypeHistoryDto[];
//   getAllInvitationsDtoList?: GetAllInvitationsDto[];
//   GetAllWebGameMessagesDtoList?: GetAllWebGameMessagesDto[];
// };

// type FriendshipControllerServerParams = {
//   getAllFriendsByStatusDtoList?: GetAllFriendsByStatusDto[];
//   getAllNonFriendsDtoList?: GetAllNonFriendsDto[];
//   getFriendProfileDto?: GetFriendProfileDto;
// };

// type CreateMockServerParams = webGameControllerServerParams &
//   UserControllerServerParams &
//   FriendshipControllerServerParams;

// // function to create a mock server
// export const createMockServer = (mockResult: CreateMockServerParams) => {
//   const externHandlers = [
//     http.get("https://ipinfo.io", (req, res, ctx) => {
//       return res(ctx.status(200), ctx.json({ data: { country: "PL" } }));
//     }),
//   ];

//   // user controller handler
//   const userControllerHandlers = [
//     // register user
//     http.post(userControllerPaths.registerUser, (_, res, ctx) => {
//       return res(ctx.status(200));
//     }),

//     // login user
//     http.post(userControllerPaths.logInUser, (_, res, ctx) => {
//       if (!mockResult.logInUserDto) {
//         console.error("mock LogInUserDto not provided");
//         return res(ctx.status(500), ctx.json(null));
//       }

//       return res(ctx.status(200), ctx.json<LogInUserDto>(mockResult.logInUserDto));
//     }),

//     // regenerate code
//     http.post(userControllerPaths.regenerateCode, (_, res, ctx) => {
//       return res(ctx.status(200));
//     }),

//     // verify email
//     http.put(userControllerPaths.verifyEmail, (_, res, ctx) => {
//       return res(ctx.status(200));
//     }),

//     // update profile
//     http.put(userControllerPaths.updateProfile, (_, res, ctx) => {
//       return res(ctx.status(200));
//     }),

//     // get user
//     http.get(userControllerPaths.getUser, (_, res, ctx) => {
//       if (!mockResult.getUserDto) {
//         console.error("mock GetUserDto not provided");
//         return res(ctx.status(500), ctx.json(null));
//       }

//       return res(ctx.status(200), ctx.json<GetUserDto>(mockResult.getUserDto));
//     }),

//     // get full user
//     http.get(userControllerPaths.getFullUser, (_, res, ctx) => {
//       if (!mockResult.getFullUserDto) {
//         console.error("mock GetFullUserDto not provided");
//         return res(ctx.status(500), ctx.json(null));
//       }

//       return res(ctx.status(200), ctx.json<GetFullUserDto>(mockResult.getFullUserDto));
//     }),

//     // get other user
//     http.get(userControllerPaths.getOtherUser, (_, res, ctx) => {
//       if (!mockResult.getOtherUserDto) {
//         console.error("mock GetOtherUserDto not provided");
//         return res(ctx.status(500), ctx.json(null));
//       }

//       return res(ctx.status(200), ctx.json<GetOtherUserDto>(mockResult.getOtherUserDto));
//     }),

//     // get elo
//     http.get(userControllerPaths.getElo, (_, res, ctx) => {
//       if (!mockResult.getEloDto) {
//         console.error("mock GetEloDto not provided");
//         return res(ctx.status(500), ctx.json(null));
//       }

//       return res(ctx.status(200), ctx.json<GetEloDto>(mockResult.getEloDto));
//     }),

//     // is verified
//     http.get(userControllerPaths.isVerified, (_, res, ctx) => {
//       if (!mockResult.isEmailVerifiedDto) {
//         console.error("mock IsEmailVerifiedDto not provided");
//         return res(ctx.status(500), ctx.json(null));
//       }

//       return res(ctx.status(200), ctx.json<IsEmailVerifiedDto>(mockResult.isEmailVerifiedDto));
//     }),

//     // get by email
//     http.get(userControllerPaths.getByEmail, (_, res, ctx) => {
//       if (!mockResult.getByEmailDto) {
//         console.error("mock IsEmailVerifiedDto not provided");
//         return res(ctx.status(500), ctx.json(null));
//       }

//       return res(ctx.status(200), ctx.json<GetByEmailDto>(mockResult.getByEmailDto));
//     }),

//     // get register configuration
//     http.get(userControllerPaths.getRegisterConf, (req, res, ctx) => {
//       const configId = req.url.searchParams.get("configurationId");

//       if (!configId) {
//         console.error("configurationId not exists");
//         return res(ctx.status(500), ctx.json(null));
//       }

//       let response: GetRegisterConfDto;

//       if (parseInt(configId) === DataConfiguration.userPassword) {
//         response = {
//           minLength: 5,
//           maxLength: null,
//           requireUppercase: false,
//           requireLowercase: false,
//           requireDigit: true,
//           requireSpecialChar: false,
//         };

//         return res(ctx.status(200), ctx.json<GetRegisterConfDto>(response));
//       } else if (parseInt(configId) === DataConfiguration.userName) {
//         response = {
//           minLength: 5,
//           maxLength: 30,
//           requireUppercase: false,
//           requireLowercase: false,
//           requireDigit: false,
//           requireSpecialChar: false,
//         };

//         return res(ctx.status(200), ctx.json<GetRegisterConfDto>(response));
//       }
//     }),
//   ];

//   // game controller handlers
//   const webGameControllerHandlers = [
//     /** STATIC */

//     // start search
//     http.post(webGameControllerPaths.startSearch, (_, res, ctx) => {
//       if (!mockResult.SearchWebGameDto) {
//         console.error("mock SearchWebGameDto not provided");
//         return res(ctx.status(500), ctx.json(null));
//       }

//       return res(ctx.status(200), ctx.json<SearchWebGameDto>(mockResult.SearchWebGameDto));
//     }),

//     // create private game
//     http.post(webGameControllerPaths.createPrivateGame, (_, res, ctx) => {
//       if (!mockResult.createPrivateGameDto) {
//         console.error("mock CreatePrivateGameDto not provided");
//         return res(ctx.status(500), ctx.json(null));
//       }

//       return res(ctx.status(200), ctx.json<CreatePrivateGameDto>(mockResult.createPrivateGameDto));
//     }),

//     // create game by email
//     http.post(webGameControllerPaths.createGameByEmail, (_, res, ctx) => {
//       if (!mockResult.createGameByEmailDto) {
//         console.error("mock CreatePrivateGameByEmailDto not provided");
//         return res(ctx.status(500), ctx.json(null));
//       }

//       return res(ctx.status(200), ctx.json<CreatePrivateGameByEmailDto>(mockResult.createGameByEmailDto));
//     }),

//     // create game with link
//     http.post(webGameControllerPaths.createGameWithLink, (_, res, ctx) => {
//       if (!mockResult.CreatePrivateGameWithLinkDto) {
//         console.error("mock CreateGameWithLinDto not provided");
//         return res(ctx.status(500), ctx.json(null));
//       }

//       return res(ctx.status(200), ctx.json<CreatePrivateGameWithLinkDto>(mockResult.CreatePrivateGameWithLinkDto));
//     }),

//     // create rematch game
//     //http.post(webGameControllerPaths.createRematchGame, (_, res, ctx) => {
//     //   return res(ctx.status(200));
//     // }),

//     // check if in game
//     http.get(webGameControllerPaths.checkIfInGame, (_, res, ctx) => {
//       if (!mockResult.checkIfInGameDto) {
//         console.error("mock CheckIfInWebGameDto not provided");
//         return res(ctx.status(500), ctx.json(null));
//       }

//       return res(ctx.status(200), ctx.json<CheckIfInWebGameDto>(mockResult.checkIfInGameDto));
//     }),

//     // get all finished games
//     http.get(webGameControllerPaths.getAllFinishedGames, (_, res, ctx) => {
//       if (!mockResult.getAllFinishedGamesDtoList) {
//         console.error("mock GetAllFinishedGamesDto not provided");
//         return res(ctx.status(500), ctx.json(null));
//       }

//       const response: PagedResult<GetAllFinishedGamesDto> = createPagedResult(mockResult.getAllFinishedGamesDtoList);

//       return res(ctx.status(200), ctx.json<PagedResult<GetAllFinishedGamesDto>>(response));
//     }),

//     // get type history
//     http.get(webGameControllerPaths.getTypeHistory, (_, res, ctx) => {
//       if (!mockResult.getTypeHistoryDtoList) {
//         console.error("mock GetTypeHistoryDto not provided");
//         return res(ctx.status(500), ctx.json(null));
//       }

//       const response: PagedResult<GetTypeHistoryDto> = createPagedResult(mockResult.getTypeHistoryDtoList);

//       return res(ctx.status(200), ctx.json<PagedResult<GetTypeHistoryDto>>(response));
//     }),

//     // get all invitations
//     http.get(webGameControllerPaths.getAllInvitations, (_, res, ctx) => {
//       if (!mockResult.getAllInvitationsDtoList) {
//         console.error("mock GetAllInvitationsDto not provided");
//         return res(ctx.status(500), ctx.json(null));
//       }

//       const response: PagedResult<GetAllInvitationsDto> = createPagedResult(mockResult.getAllInvitationsDtoList);

//       return res(ctx.status(200), ctx.json<PagedResult<GetAllInvitationsDto>>(response));
//     }),

//     // abort search
//     http.delete(webGameControllerPaths.abortSearch, (_, res, ctx) => {
//       return res(ctx.status(200));
//     }),

//     /** DYNAMIC */

//     // get game
//     http.get(webGameControllerPaths.getGame, (_, res, ctx) => {
//       if (!mockResult.GetWebGameDto) {
//         console.error("mock GetWebGameDto not provided");
//         return res(ctx.status(500), ctx.json(null));
//       }

//       return res(ctx.status(200), ctx.json<GetWebGameDto>(mockResult.GetWebGameDto));
//     }),

//     // get player
//     http.get(webGameControllerPaths.getPlayer, (_, res, ctx) => {
//       if (!mockResult.getPlayerDto) {
//         console.error("mock GetWebGamePlayerDto not provided");
//         return res(ctx.status(500), ctx.json(null));
//       }

//       return res(ctx.status(200), ctx.json<GetWebGamePlayerDto>(mockResult.getPlayerDto));
//     }),

//     // fetch time
//     http.get(webGameControllerPaths.fetchTime, (_, res, ctx) => {
//       if (!mockResult.fetchTimeDto) {
//         console.error("mock FetchTimeDto not provided");
//         return res(ctx.status(500), ctx.json(null));
//       }

//       return res(ctx.status(200), ctx.json<FetchTimeDto>(mockResult.fetchTimeDto));
//     }),

//     // get opponent
//     http.get(webGameControllerPaths.getOpponent, (_, res, ctx) => {
//       if (!mockResult.getOpponentDto) {
//         console.error("mock GetOpponentDto not provided");
//         return res(ctx.status(500), ctx.json(null));
//       }

//       return res(ctx.status(200), ctx.json<GetOpponentDto>(mockResult.getOpponentDto));
//     }),

//     // get game timing
//     http.get(webGameControllerPaths.getGameTiming, (_, res, ctx) => {
//       if (!mockResult.getGameTimingDto) {
//         console.error("mock GetGameTimingDto not provided");
//         return res(ctx.status(500), ctx.json(null));
//       }

//       return res(ctx.status(200), ctx.json<GetGameTimingDto>(mockResult.getGameTimingDto));
//     }),

//     // get all messages
//     http.get(webGameControllerPaths.getAllMessages, (_, res, ctx) => {
//       if (!mockResult.GetAllWebGameMessagesDtoList) {
//         console.error("mock GetAllWebGameMessagesDto not provided");
//         return res(ctx.status(500), ctx.json(null));
//       }

//       const response: PagedResult<GetAllWebGameMessagesDto> = createPagedResult(mockResult.GetAllWebGameMessagesDtoList);

//       return res(ctx.status(200), ctx.json<PagedResult<GetAllWebGameMessagesDto>>(response));
//     }),

//     // cancel private game
//     http.delete(webGameControllerPaths.cancelPrivateGame, (_, res, ctx) => {
//       return res(ctx.status(200));
//     }),

//     // check if update required
//     http.get(webGameControllerPaths.checkIfUpdateRequired, (_, res, ctx) => {
//       if (!mockResult.checkIfUpdateRequiredDto) {
//         console.error("mock CheckIfUpdateOnPrivateGameRequiredDto not provided");
//         return res(ctx.status(500), ctx.json(null));
//       }

//       return res(ctx.status(200), ctx.json<CheckIfUpdateOnPrivateGameRequiredDto>(mockResult.checkIfUpdateRequiredDto));
//     }),
//   ];

//   // friendship controller handlers
//   const friendshipControllerHandlers = [
//     /** STATIC */

//     // invite friend
//     http.post(friendshipControllerPaths.inviteFriend, (_, res, ctx) => {
//       return res(ctx.status(200));
//     }),

//     // get all friends by status
//     http.get(friendshipControllerPaths.getAllFriendsByStatus, (_, res, ctx) => {
//       if (!mockResult.getAllFriendsByStatusDtoList) {
//         console.error("mock GetAllFriendsByStatusDto not provided");
//         return res(ctx.status(500), ctx.json(null));
//       }

//       const response: PagedResult<GetAllFriendsByStatusDto> = createPagedResult(
//         mockResult.getAllFriendsByStatusDtoList
//       );

//       return res(ctx.status(200), ctx.json<PagedResult<GetAllFriendsByStatusDto>>(response));
//     }),

//     // get all friends by status
//     http.get(friendshipControllerPaths.getAllNonFriends, (_, res, ctx) => {
//       if (!mockResult.getAllNonFriendsDtoList) {
//         console.error("mock GetAllNonFriendsDto not provided");
//         return res(ctx.status(500), ctx.json(null));
//       }

//       const response: PagedResult<GetAllNonFriendsDto> = createPagedResult(mockResult.getAllNonFriendsDtoList);

//       return res(ctx.status(200), ctx.json<PagedResult<GetAllNonFriendsDto>>(response));
//     }),

//     /** DYNAMIC */

//     // respond to friend request
//     http.put(friendshipControllerPaths.respondToFriendRequest, (_, res, ctx) => {
//       return res(ctx.status(200));
//     }),

//     // get game timing
//     http.get(friendshipControllerPaths.getFriendProfile, (_, res, ctx) => {
//       if (!mockResult.getFriendProfileDto) {
//         console.error("mock GetFriendProfileDto not provided");
//         return res(ctx.status(500), ctx.json(null));
//       }

//       return res(ctx.status(200), ctx.json<GetFriendProfileDto>(mockResult.getFriendProfileDto));
//     }),

//     // remove friend
//     http.delete(friendshipControllerPaths.removeFriend, (_, res, ctx) => {
//       return res(ctx.status(200));
//     }),
//   ];

//   return setupServer(
//     ...[...externHandlers, ...userControllerHandlers, ...webGameControllerHandlers, ...friendshipControllerHandlers]
//   );
// };

// const createPagedResult = <T>(data: T[]): PagedResult<T> => {
//   return {
//     items: data,
//     totalPages: 1,
//     itemsFrom: 1,
//     itemsTo: data.length,
//     totalItemsCount: data.length,
//   };
// };
