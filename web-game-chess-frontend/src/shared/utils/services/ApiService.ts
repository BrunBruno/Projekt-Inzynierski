/* api paths and function */

import { Guid } from "guid-typescript";
import {
  GetAllFriendsByStatusModel,
  GetAllNonFriendsModel,
  GetFriendshipRankingModel,
} from "../types/friendshipModels";
import {
  AbortWebGameSearchModel,
  CheckIfInWebGameModel,
  GetAllInvitationsModel,
  GetAllFinishedGamesModel,
  GetTypeHistoryModel,
  GetAllActiveGamesModel,
} from "../types/webGameModels";
import { GetByEmailModel, GetRegisterConfModel, GetUsersRankingModel } from "../types/userModels";
import { host } from "../../../../globals";
import { GetAllEngineGamesModel } from "../types/engineGameModels";

const baseUrl: string = `http://${host}:5125/api`;

// user controller
const userBaseUrl: string = baseUrl + "/user";

interface UserControllerPaths {
  //POST
  registerUser: string;
  logInUser: string;
  regenerateCode: string;
  //PUT
  verifyEmail: string;
  sendResetPasswordCode: string;
  resetPassword: string;
  changePassword: string;
  updateProfile: string;
  updateUserData: string;
  updateUserSettings: string;
  //GET
  getUser: string;
  getFullUser: string;
  getOtherUser: string;
  getElo: string;
  isVerified: string;
  getByEmail: string;
  getRegisterConf: string;
  getUsersRanking: string;
  //DELETE
}

// paths in user controller
export const userControllerPaths: UserControllerPaths = {
  // static
  registerUser: `${userBaseUrl}/sign-up`,
  logInUser: `${userBaseUrl}/sign-in`,
  regenerateCode: `${userBaseUrl}/regenerate-code`,
  verifyEmail: `${userBaseUrl}/verify-email`,
  sendResetPasswordCode: `${userBaseUrl}/send-password-code`,
  resetPassword: `${userBaseUrl}/reset-password`,
  changePassword: `${userBaseUrl}/change-password`,
  updateProfile: `${userBaseUrl}/profile`,
  updateUserData: `${userBaseUrl}/data`,
  updateUserSettings: `${userBaseUrl}/settings`,
  getUser: `${userBaseUrl}`,
  getFullUser: `${userBaseUrl}/full`,
  getOtherUser: `${userBaseUrl}/other`,
  getElo: `${userBaseUrl}/elo`,
  isVerified: `${userBaseUrl}/is-verified`,
  getByEmail: `${userBaseUrl}/by-email`,
  getRegisterConf: `${userBaseUrl}/configuration`,
  getUsersRanking: `${userBaseUrl}/ranking`,

  // dynamic
};

interface UserController {
  registerUser: () => string;
  logInUser: () => string;
  regenerateCode: () => string;
  verifyEmail: () => string;
  sendResetPasswordCode: () => string;
  resetPassword: () => string;
  changePassword: () => string;
  updateProfile: () => string;
  updateUserData: () => string;
  updateUserSettings: () => string;
  getUser: () => string;
  getFullUser: () => string;
  getOtherUser: (userId: Guid) => string;
  getElo: () => string;
  isVerified: () => string;
  getByEmail: (model: GetByEmailModel) => string;
  getRegisterConf: (model: GetRegisterConfModel) => string;
  getUsersRanking: (model: GetUsersRankingModel) => string;
}

export const userController: UserController = {
  // registers user and sends email verification code
  registerUser: () => `${userBaseUrl}/sign-up`,

  // creates Jwt token
  logInUser: () => `${userBaseUrl}/sign-in`,

  // removes old code and sends new one
  regenerateCode: () => `${userBaseUrl}/regenerate-code`,

  // verifies email address
  verifyEmail: () => `${userBaseUrl}/verify-email`,

  // sends reset password code
  sendResetPasswordCode: () => `${userBaseUrl}/send-password-code`,

  // resets user password
  resetPassword: () => `${userBaseUrl}/reset-password`,

  // to update user password
  changePassword: () => `${userBaseUrl}/change-password`,

  // updates updatable data for user
  updateProfile: () => `${userBaseUrl}/profile`,

  // to change user data
  updateUserData: () => `${userBaseUrl}/data`,

  // to change user settings
  updateUserSettings: () => `${userBaseUrl}/settings`,

  // gets basic user info
  getUser: () => `${userBaseUrl}`,

  // gets complete user info for account page
  getFullUser: () => `${userBaseUrl}/full`,

  // gets user info for other users
  getOtherUser: (userId) => `${userBaseUrl}/${userId}/other`,

  // gets elo info
  getElo: () => `${userBaseUrl}/elo`,

  // checks if user email is verified
  isVerified: () => `${userBaseUrl}/is-verified`,

  // gets user data by email address
  getByEmail: (model: GetByEmailModel) => `${userBaseUrl}/by-email?${stringifyModel(model)}`,

  // gets registration configurations
  getRegisterConf: (model: GetRegisterConfModel) => `${userBaseUrl}/configuration?${stringifyModel(model)}`,

  // gets global users ranking
  getUsersRanking: (model: GetUsersRankingModel) => `${userBaseUrl}/ranking?${stringifyModel(model)}`,
};

// game controller
const webGameBaseUrl: string = baseUrl + "/webgame";

interface WebGameControllerPaths {
  //POST
  startSearch: string;
  createPrivateGame: string;
  createGameByEmail: string;
  createGameWithLink: string;
  //PUT
  //GET
  checkIfInGame: string;
  checkIfUpdateRequired: string;
  getGame: string;
  getPlayer: string;
  fetchTime: string;
  getOpponent: string;
  getGameTiming: string;
  getAllActiveGames: string;
  getAllFinishedGames: string;
  getTypeHistory: string;
  getAllInvitations: string;
  getAllMessages: string;
  //DELETE
  abortSearch: string;
  cancelPrivateGame: string;
}

// paths in game controller
export const webGameControllerPaths: WebGameControllerPaths = {
  // static
  startSearch: `${webGameBaseUrl}/search`,
  createPrivateGame: `${webGameBaseUrl}/private`,
  createGameByEmail: `${webGameBaseUrl}/email`,
  createGameWithLink: `${webGameBaseUrl}/link`,
  checkIfInGame: `${webGameBaseUrl}/is-in-game`,
  getAllActiveGames: `${webGameBaseUrl}/all-ongoing`,
  getAllFinishedGames: `${webGameBaseUrl}/all-finished`,
  getTypeHistory: `${webGameBaseUrl}/type-history`,
  getAllInvitations: `${webGameBaseUrl}/invitations`,
  abortSearch: `${webGameBaseUrl}/abort`,

  // dynamic
  getGame: `${webGameBaseUrl}/:gameId`,
  getPlayer: `${webGameBaseUrl}/:gameId/player`,
  fetchTime: `${webGameBaseUrl}/:gameId/time`,
  getOpponent: `${webGameBaseUrl}/:gameId/opponent`,
  getGameTiming: `${webGameBaseUrl}/:gameId/timing`,
  getAllMessages: `${webGameBaseUrl}/:gameId/messages`,
  cancelPrivateGame: `${webGameBaseUrl}/:gameId/cancel`,
  checkIfUpdateRequired: `${webGameBaseUrl}/:gameId/update-required`,
};

interface WebGameController {
  startSearch: () => string;
  createPrivateGame: () => string;
  createGameByEmail: () => string;
  createGameWithLink: () => string;
  checkIfInGame: (model: CheckIfInWebGameModel) => string;
  checkIfUpdateRequired: (gameId: Guid) => string;
  getGame: (gameId: Guid) => string;
  getPlayer: (gameId: Guid) => string;
  fetchTime: (gameId: Guid) => string;
  getOpponent: (gameId: Guid) => string;
  getGameTiming: (gameId: Guid) => string;
  getAllActiveGames: (model: GetAllActiveGamesModel) => string;
  getAllFinishedGames: (model: GetAllFinishedGamesModel) => string;
  getTypeHistory: (model: GetTypeHistoryModel) => string;
  getAllInvitations: (model: GetAllInvitationsModel) => string;
  getAllMessages: (gameId: Guid) => string;
  getTotalGamesStats: () => string;
  abortSearch: (model: AbortWebGameSearchModel) => string;
  cancelPrivateGame: (gameId: Guid) => string;
}

export const webGameController: WebGameController = {
  // creates player if player not exists
  startSearch: () => `${webGameBaseUrl}/search`,

  // creates private game
  createPrivateGame: () => `${webGameBaseUrl}/private`,

  // creates private game by proving opponent email
  createGameByEmail: () => `${webGameBaseUrl}/email`,

  // creates private game with link and returns it
  createGameWithLink: () => `${webGameBaseUrl}/link`,

  // check if player was matched and the game has started
  checkIfInGame: (model: CheckIfInWebGameModel) => `${webGameBaseUrl}/is-in-game?${stringifyModel(model)}`,

  // check if for game created by url the update on players is required
  checkIfUpdateRequired: (gameId: Guid) => `${webGameBaseUrl}/${gameId}/update-required`,

  // gets all data for one game
  getGame: (gameId: Guid) => `${webGameBaseUrl}/${gameId}`,

  // gets all data of player
  getPlayer: (gameId: Guid) => `${webGameBaseUrl}/${gameId}/player`,

  // gets time left for users
  fetchTime: (gameId: Guid) => `${webGameBaseUrl}/${gameId}/time`,

  // gets opponent data from previous game
  getOpponent: (gameId: Guid) => `${webGameBaseUrl}/${gameId}/opponent`,

  // gets game timing type and configuration
  getGameTiming: (gameId: Guid) => `${webGameBaseUrl}/${gameId}/timing`,

  // gets all ongoing games for user
  getAllActiveGames: (model: GetAllActiveGamesModel) => `${webGameBaseUrl}/all-ongoing?${stringifyModel(model)}`,

  // gets all finished games for user
  getAllFinishedGames: (model: GetAllFinishedGamesModel) => `${webGameBaseUrl}/all-finished?${stringifyModel(model)}`,

  // get all previous games for chosen timing type
  getTypeHistory: (model: GetTypeHistoryModel) => `${webGameBaseUrl}/type-history?${stringifyModel(model)}`,

  // gets all previous invitations, that were untouched
  getAllInvitations: (model: GetAllInvitationsModel) => `${webGameBaseUrl}/invitations?${stringifyModel(model)}`,

  // gets all messages for current game
  getAllMessages: (gameId: Guid) => `${webGameBaseUrl}/${gameId}/messages`,

  // gets daily stats
  getTotalGamesStats: () => `${webGameBaseUrl}/stats`,

  // removes player
  abortSearch: (model: AbortWebGameSearchModel) => `${webGameBaseUrl}/abort?${stringifyModel(model)}`,

  // removes private games / removes players / removes rematches
  cancelPrivateGame: (gameId: Guid) => `${webGameBaseUrl}/${gameId}/cancel`,
};

// friendship controller
const friendshipBaseUrl: string = baseUrl + "/friendship";

interface FriendshipControllerPaths {
  //POST
  inviteFriend: string;
  blockUser: string;
  //PUT
  respondToFriendRequest: string;
  //GET
  getAllFriendsByStatus: string;
  getAllNonFriends: string;
  getFriendProfile: string;
  getFriendshipRanking: string;
  //DELETE
  removeFriend: string;
}

export const friendshipControllerPaths: FriendshipControllerPaths = {
  // static
  inviteFriend: `${friendshipBaseUrl}/invite`,
  blockUser: `${friendshipBaseUrl}/block`,
  getAllFriendsByStatus: `${friendshipBaseUrl}/all-by-status`,
  getAllNonFriends: `${friendshipBaseUrl}/all-non`,
  getFriendshipRanking: `${friendshipBaseUrl}/ranking`,

  // dynamic
  respondToFriendRequest: `${friendshipBaseUrl}/:friendshipId/respond`,
  getFriendProfile: `${friendshipBaseUrl}/:friendshipId/profile`,
  removeFriend: `${friendshipBaseUrl}/:friendshipId`,
};

interface FriendshipController {
  inviteFriend: () => string;
  blockUser: () => string;
  respondToFriendRequest: (friendshipId: Guid) => string;
  getAllFriendsByStatus: (model: GetAllFriendsByStatusModel) => string;
  getAllNonFriends: (model: GetAllNonFriendsModel) => string;
  getFriendProfile: (friendshipId: Guid) => string;
  getFriendshipRanking: (model: GetFriendshipRankingModel) => string;
  removeFriend: (friendshipId: Guid) => string;
}

export const friendshipController: FriendshipController = {
  // creates new friendship, with pending status
  inviteFriend: () => `${friendshipBaseUrl}/invite`,

  // creates new friendship, with rejected status
  blockUser: () => `${friendshipBaseUrl}/block`,

  // changes status of pending friendship
  respondToFriendRequest: (friendshipId: Guid) => `${friendshipBaseUrl}/${friendshipId}/respond`,

  // gets all users with chosen relation to user
  getAllFriendsByStatus: (model: GetAllFriendsByStatusModel) =>
    `${friendshipBaseUrl}/all-by-status?${stringifyModel(model)}`,

  // gets all users that are not in relation with user
  getAllNonFriends: (model: GetAllNonFriendsModel) => `${friendshipBaseUrl}/all-non?${stringifyModel(model)}`,

  // get user data for other user with established friendship
  getFriendProfile: (friendshipId: Guid) => `${friendshipBaseUrl}/${friendshipId}/profile`,

  // to get ranking among user friends
  getFriendshipRanking: (model: GetFriendshipRankingModel) => `${friendshipBaseUrl}/ranking?${stringifyModel(model)}`,

  // removes friendships
  removeFriend: (friendshipId: Guid) => `${friendshipBaseUrl}/${friendshipId}`,
};

// engine controller
const engineBaseUrl: string = baseUrl + "/enginegame";

interface EngineGameControllerPaths {
  //POST
  startEngineGame: string;
  makeEngineGameMove: string;
  //PUT
  endEngineGame: string;
  changeEngineLevel: string;
  undoMove: string;
  updateEngineSettings: string;
  //GET
  getEngineGame: string;
  getEngineGameMove: string;
  getAllEngineGameMessages: string;
  getAllEngineGames: string;
  //DELETE
}

export const engineGameControllerPaths: EngineGameControllerPaths = {
  // static
  startEngineGame: `${engineBaseUrl}/start`,
  getAllEngineGames: `${engineBaseUrl}/all-games`,
  updateEngineSettings: `${engineBaseUrl}/update-settings`,

  // dynamic
  getEngineGame: `${engineBaseUrl}/:gameId`,
  makeEngineGameMove: `${engineBaseUrl}/:gameId/make-move`,
  endEngineGame: `${engineBaseUrl}/:gameId/end-game`,
  changeEngineLevel: `${engineBaseUrl}/:gameId/change-engine`,
  undoMove: `${engineBaseUrl}/:gameId/undo-move`,
  getEngineGameMove: `${engineBaseUrl}/:gameId/engine-move`,
  getAllEngineGameMessages: `${engineBaseUrl}/:gameId/all-messages`,
};

interface EngineGameController {
  startEngineGame: () => string;
  makeEngineGameMove: (gameId: Guid) => string;
  endEngineGame: (gameId: Guid) => string;
  changeEngineLevel: (gameId: Guid) => string;
  undoMove: (gameId: Guid) => string;
  updateEngineSettings: () => string;
  getEngineGame: (gameId: Guid) => string;
  getEngineGameMove: (gameId: Guid) => string;
  getAllEngineGameMessages: (gameId: Guid) => string;
  getAllEngineGames: (model: GetAllEngineGamesModel) => string;
}

export const engineGameController: EngineGameController = {
  // creates new game with engine
  startEngineGame: () => `${engineBaseUrl}/start`,

  // creates done move by player or engine
  makeEngineGameMove: (gameId: Guid) => `${engineBaseUrl}/${gameId}/make-move`,

  // to finish game with engine
  endEngineGame: (gameId: Guid) => `${engineBaseUrl}/${gameId}/end-game`,

  // changes engine level
  changeEngineLevel: (gameId: Guid) => `${engineBaseUrl}/${gameId}/change-engine`,

  // to remove last done moves
  undoMove: (gameId: Guid) => `${engineBaseUrl}/${gameId}/undo-move`,

  // to update engine games related settings
  updateEngineSettings: () => `${engineBaseUrl}/update-settings`,

  // to get all game data
  getEngineGame: (gameId: Guid) => `${engineBaseUrl}/${gameId}`,

  // to get move done by engine
  getEngineGameMove: (gameId: Guid) => `${engineBaseUrl}/${gameId}/engine-move`,

  // to get all messages from current game
  getAllEngineGameMessages: (gameId: Guid) => `${engineBaseUrl}/${gameId}/all-messages`,

  // to get all games with engine
  getAllEngineGames: (model: GetAllEngineGamesModel) => `${engineBaseUrl}/all-games?${stringifyModel(model)}`,
};

type Headers = {
  headers: {
    Authorization?: string;
    "Content-Type"?: string;
  };
};

export type AuthorizationOptions = {
  otherToken?: string | null;
  contentType?: string;
};

// get authorization token for api calls
export const getAuthorization = ({ otherToken, contentType }: AuthorizationOptions = {}): Headers => {
  const token = otherToken || localStorage.getItem("token");

  return {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(contentType && { "Content-Type": contentType }),
    },
  };
};

// converts object to query string
const stringifyModel = (model: object) => {
  const stringifiedModel = Object.entries(model).flatMap(([key, value]) => {
    if (Array.isArray(value)) return value.map((element) => [key, String(element)]);

    return [[key, String(value)]];
  });

  const queryString = new URLSearchParams(stringifiedModel).toString();

  return queryString;
};
