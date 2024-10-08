/* api paths and function */

import { Guid } from "guid-typescript";
import { GetAllFriendsByStatusModel, GetAllNonFriendsModel } from "../types/friendshipModels";
import {
  AbortSearchModel,
  CheckIfInGameModel,
  GetAllInvitationsModel,
  GetAllFinishedGamesModel,
  GetTypeHistoryModel,
} from "../types/gameModels";
import { GetByEmailModel, GetRegisterConfModel } from "../types/userModels";

const baseUrl: string = "http://localhost:5125/api";
// const baseUrl: string = "http://192.168.1.46:5125/api";

// user controller
const userBaseUrl: string = baseUrl + "/user";

interface UserControllerPaths {
  //POST
  registerUser: () => string;
  logInUser: () => string;
  regenerateCode: () => string;
  //PUT
  verifyEmail: () => string;
  updateProfile: () => string;
  //GET
  getUser: () => string;
  getFullUser: () => string;
  getOtherUser: (userId: Guid) => string;
  getElo: () => string;
  isVerified: () => string;
  getByEmail: (model: GetByEmailModel) => string;
  getRegisterConf: (model: GetRegisterConfModel) => string;
  //DELETE
}

// paths in user controller
export const userControllerPaths: UserControllerPaths = {
  // registers user and sends email verification code
  registerUser: (): string => `${userBaseUrl}/sign-up`,

  // creates Jwt token
  logInUser: (): string => `${userBaseUrl}/sign-in`,

  // removes old code and sends new one
  regenerateCode: (): string => `${userBaseUrl}/regenerate-code`,

  // verifies email address
  verifyEmail: (): string => `${userBaseUrl}/verify-email`,

  // updates updatable data for user
  updateProfile: (): string => `${userBaseUrl}/profile`,

  // gets basic user info
  getUser: (): string => `${userBaseUrl}`,

  // gets complete user info for account page
  getFullUser: (): string => `${userBaseUrl}/full`,

  // gets user info for other users
  getOtherUser: (userId): string => `${userBaseUrl}/other/?${userId}`,

  // gets elo info
  getElo: (): string => `${userBaseUrl}/elo`,

  // checks if user email is verified
  isVerified: (): string => `${userBaseUrl}/is-verified`,

  // gets user data by email address
  getByEmail: (model: GetByEmailModel): string => `${userBaseUrl}/by-email/?${stringifyModel(model)}`,

  // gets registration configurations
  getRegisterConf: (model: GetRegisterConfModel): string => `${userBaseUrl}/configuration/?${stringifyModel(model)}`,
};
//*/

// game controller
const gameBaseUrl: string = baseUrl + "/game";

interface GameControllerPaths {
  //POST
  startSearch: () => string;
  createPrivateGame: () => string;
  createGameByEmail: () => string;
  createGameWithLink: () => string;
  createRematchGame: () => string;
  //PUT
  //GET
  checkIfInGame: (model: CheckIfInGameModel) => string;
  checkIfUpdateRequired: (gameId: Guid) => string;
  getGame: (gameId: Guid) => string;
  getPlayer: (gameId: Guid) => string;
  fetchTime: (gameId: Guid) => string;
  getOpponent: (gameId: Guid) => string;
  getEndedGame: (gameId: Guid) => string;
  getGameTiming: (gameId: Guid) => string;
  getAllFinishedGames: (model: GetAllFinishedGamesModel) => string;
  getTypeHistory: (model: GetTypeHistoryModel) => string;
  getAllInvitations: (model: GetAllInvitationsModel) => string;
  getAllMessages: (gameId: Guid) => string;
  //DELETE
  abortSearch: (model: AbortSearchModel) => string;
  cancelPrivateGame: (gameId: Guid) => string;
}

// paths in game controller
export const gameControllerPaths: GameControllerPaths = {
  // creates player if player not exists
  startSearch: (): string => `${gameBaseUrl}/search`,

  // creates private game
  createPrivateGame: (): string => `${gameBaseUrl}/private`,

  // creates private game by proving opponent email
  createGameByEmail: (): string => `${gameBaseUrl}/by-email`,

  // creates private game with link and returns it
  createGameWithLink: (): string => `${gameBaseUrl}/by-link`,

  // creates new game for two same users that has already played one game
  createRematchGame: (): string => `${gameBaseUrl}/rematch`,

  // check if player was matched and the game has started
  checkIfInGame: (model: CheckIfInGameModel): string => `${gameBaseUrl}/check-if-in-game/?${stringifyModel(model)}`,

  checkIfUpdateRequired: (gameId: Guid): string => `${gameBaseUrl}/${gameId}/check-if-update-required`,

  // gets all data for one game
  getGame: (gameId: Guid): string => `${gameBaseUrl}/${gameId}`,

  // gets all data of player
  getPlayer: (gameId: Guid): string => `${gameBaseUrl}/${gameId}/player`,

  // gets time left for user
  fetchTime: (gameId: Guid): string => `${gameBaseUrl}/${gameId}/time`,

  // gets opponent data from previous game
  getOpponent: (gameId: Guid): string => `${gameBaseUrl}/${gameId}/opponent`,

  // gets ended game info
  getEndedGame: (gameId: Guid): string => `${gameBaseUrl}/${gameId}/ended`,

  // gets game timing type and configuration
  getGameTiming: (gameId: Guid): string => `${gameBaseUrl}/${gameId}/timing`,

  // gets all finished games for user
  getAllFinishedGames: (model: GetAllFinishedGamesModel): string =>
    `${gameBaseUrl}/all-finished?${stringifyModel(model)}`,

  // get all previous games for chosen timing type
  getTypeHistory: (model: GetTypeHistoryModel): string => `${gameBaseUrl}/type-history?${stringifyModel(model)}`,

  // gets all previous invitations, that were untouched
  getAllInvitations: (model: GetAllInvitationsModel): string => `${gameBaseUrl}/invitations?${stringifyModel(model)}`,

  // gets all messages for current game
  getAllMessages: (gameId: Guid): string => `${gameBaseUrl}/${gameId}/messages`,

  // removes player
  abortSearch: (model: AbortSearchModel): string => `${gameBaseUrl}/abort?${stringifyModel(model)}`,

  //
  cancelPrivateGame: (gameId: Guid): string => `${gameBaseUrl}/${gameId}/cancel`,
};
//*/

// friendship controller
const friendshipBaseUrl: string = baseUrl + "/friendship";

interface FriendshipControllerPaths {
  //POST
  inviteFriend: () => string;
  //PUT
  respondToFriendRequest: (friendshipId: Guid) => string;
  //GET
  getAllFriendsByStatus: (model: GetAllFriendsByStatusModel) => string;
  getAllNonFriends: (model: GetAllNonFriendsModel) => string;
  getFriendProfile: (friendshipId: Guid) => string;
  //DELETE
  removeFriend: (friendshipId: Guid) => string;
}

export const friendshipControllerPaths: FriendshipControllerPaths = {
  // creates new friendship, with pending status
  inviteFriend: (): string => `${friendshipBaseUrl}/invite`,

  // changes status of pending friendship
  respondToFriendRequest: (friendshipId: Guid): string => `${friendshipBaseUrl}/${friendshipId}/respond`,

  // gets all users with chosen relation to user
  getAllFriendsByStatus: (model: GetAllFriendsByStatusModel): string =>
    `${friendshipBaseUrl}/all-by-status?${stringifyModel(model)}`,

  // gets all users that are not in relation with user
  getAllNonFriends: (model: GetAllNonFriendsModel): string =>
    `${friendshipBaseUrl}/all-non-friends?${stringifyModel(model)}`,

  // get user data for other user with established friendship
  getFriendProfile: (friendshipId: Guid): string => `${friendshipBaseUrl}/${friendshipId}`,

  // removes friendships
  removeFriend: (friendshipId: Guid): string => `${friendshipBaseUrl}/${friendshipId}`,
};
//*/

type Headers = {
  headers: {
    Authorization: string;
  };
};

// get authorization token for api calls
export const getAuthorization = (): Headers => {
  const token = localStorage.getItem("token");

  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {
        headers: {
          Authorization: ``,
        },
      };
};

// converts object to query string
const stringifyModel = (model: Object): string => {
  const stringifiedModel = Object.entries(model).flatMap(([key, value]) => {
    if (Array.isArray(value)) return value.map((element) => [key, String(element)]);

    return [[key, String(value)]];
  });

  const queryString = new URLSearchParams(stringifiedModel).toString();

  return queryString;
};
