/* api paths and function */

import { Guid } from "guid-typescript";
import {
  GetAllFriendsByStatusModel,
  GetAllNonFriendsModel,
  GetFriendshipRankingModel,
  GetGamesOfFriendshipModel,
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
import { GetAllEngineGamesModel } from "../types/engineGameModels";

const baseUrl: string = `https://projekt-inzynierski.onrender.com/api`;

// user controller
const userBaseUrl: string = baseUrl + "/user";

interface UserController {
  registerUser: () => string;
  logInUser: () => string;
  regenerateCode: () => string;
  verifyEmail: () => string;
  sendResetPasswordCode: () => string;
  resetPassword: () => string;
  changePassword: () => string;
  updateProfile: () => string;
  updateProfileVisibility: () => string;
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
  updateProfileVisibility: () => `${userBaseUrl}/visibility`,

  // to change user settings
  updateUserSettings: () => `${userBaseUrl}/settings`,

  // gets basic user info
  getUser: () => `${userBaseUrl}`,

  // gets complete user info for account page
  getFullUser: () => `${userBaseUrl}/full`,

  // gets user info for other users
  getOtherUser: (userId: Guid) => `${userBaseUrl}/${getIdValue(userId)}/other`,

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
  checkIfUpdateRequired: (gameId: Guid) => `${webGameBaseUrl}/${getIdValue(gameId)}/update-required`,

  // gets all data for one game
  getGame: (gameId: Guid) => `${webGameBaseUrl}/${getIdValue(gameId)}`,

  // gets all data of player
  getPlayer: (gameId: Guid) => `${webGameBaseUrl}/${getIdValue(gameId)}/player`,

  // gets time left for users
  fetchTime: (gameId: Guid) => `${webGameBaseUrl}/${getIdValue(gameId)}/time`,

  // gets opponent data from previous game
  getOpponent: (gameId: Guid) => `${webGameBaseUrl}/${getIdValue(gameId)}/opponent`,

  // gets game timing type and configuration
  getGameTiming: (gameId: Guid) => `${webGameBaseUrl}/${getIdValue(gameId)}/timing`,

  // gets all ongoing games for user
  getAllActiveGames: (model: GetAllActiveGamesModel) => `${webGameBaseUrl}/all-ongoing?${stringifyModel(model)}`,

  // gets all finished games for user
  getAllFinishedGames: (model: GetAllFinishedGamesModel) => `${webGameBaseUrl}/all-finished?${stringifyModel(model)}`,

  // get all previous games for chosen timing type
  getTypeHistory: (model: GetTypeHistoryModel) => `${webGameBaseUrl}/type-history?${stringifyModel(model)}`,

  // gets all previous invitations, that were untouched
  getAllInvitations: (model: GetAllInvitationsModel) => `${webGameBaseUrl}/invitations?${stringifyModel(model)}`,

  // gets all messages for current game
  getAllMessages: (gameId: Guid) => `${webGameBaseUrl}/${getIdValue(gameId)}/messages`,

  // gets daily stats
  getTotalGamesStats: () => `${webGameBaseUrl}/stats`,

  // removes player
  abortSearch: (model: AbortWebGameSearchModel) => `${webGameBaseUrl}/abort?${stringifyModel(model)}`,

  // removes private games / removes players / removes rematches
  cancelPrivateGame: (gameId: Guid) => `${webGameBaseUrl}/${getIdValue(gameId)}/cancel`,
};

// friendship controller
const friendshipBaseUrl: string = baseUrl + "/friendship";

interface FriendshipController {
  inviteFriend: () => string;
  blockUser: () => string;
  respondToFriendRequest: (friendshipId: Guid) => string;
  getAllFriendsByStatus: (model: GetAllFriendsByStatusModel) => string;
  getAllNonFriends: (model: GetAllNonFriendsModel) => string;
  getFriendProfile: (friendshipId: Guid) => string;
  getFriendshipRanking: (model: GetFriendshipRankingModel) => string;
  getGamesOfFriendship: (model: GetGamesOfFriendshipModel) => string;
  removeFriend: (friendshipId: Guid) => string;
}

export const friendshipController: FriendshipController = {
  // creates new friendship, with pending status
  inviteFriend: () => `${friendshipBaseUrl}/invite`,

  // creates new friendship, with rejected status
  blockUser: () => `${friendshipBaseUrl}/block`,

  // changes status of pending friendship
  respondToFriendRequest: (friendshipId: Guid) => `${friendshipBaseUrl}/${getIdValue(friendshipId)}/respond`,

  // gets all users with chosen relation to user
  getAllFriendsByStatus: (model: GetAllFriendsByStatusModel) =>
    `${friendshipBaseUrl}/all-by-status?${stringifyModel(model)}`,

  // gets all users that are not in relation with user
  getAllNonFriends: (model: GetAllNonFriendsModel) => `${friendshipBaseUrl}/all-non?${stringifyModel(model)}`,

  // get user data for other user with established friendship
  getFriendProfile: (friendshipId: Guid) => `${friendshipBaseUrl}/${getIdValue(friendshipId)}/profile`,

  // to get ranking among user friends
  getFriendshipRanking: (model: GetFriendshipRankingModel) => `${friendshipBaseUrl}/ranking?${stringifyModel(model)}`,

  // to get all games of friendship
  getGamesOfFriendship: (model: GetGamesOfFriendshipModel) =>
    `${friendshipBaseUrl}/${model.friendshipId}/games?${stringifyModel(model)}`,

  // removes friendships
  removeFriend: (friendshipId: Guid) => `${friendshipBaseUrl}/${getIdValue(friendshipId)}`,
};

// engine controller
const engineBaseUrl: string = baseUrl + "/enginegame";

interface EngineGameController {
  startEngineGame: () => string;
  makeEngineGameMove: (gameId: Guid) => string;
  endEngineGame: (gameId: Guid) => string;
  changeEngineLevel: (gameId: Guid) => string;
  undoMove: (gameId: Guid) => string;
  updateEngineSettings: () => string;
  getEngineGame: (gameId: Guid) => string;
  getWinner: (gameId: Guid) => string;
  getEngineGameMove: (gameId: Guid) => string;
  getAllEngineGameMessages: (gameId: Guid) => string;
  getAllEngineGames: (model: GetAllEngineGamesModel) => string;
}

export const engineGameController: EngineGameController = {
  // creates new game with engine
  startEngineGame: () => `${engineBaseUrl}/start`,

  // creates done move by player or engine
  makeEngineGameMove: (gameId: Guid) => `${engineBaseUrl}/${getIdValue(gameId)}/make-move`,

  // to finish game with engine
  endEngineGame: (gameId: Guid) => `${engineBaseUrl}/${getIdValue(gameId)}/end-game`,

  // changes engine level
  changeEngineLevel: (gameId: Guid) => `${engineBaseUrl}/${getIdValue(gameId)}/change-engine`,

  // to remove last done moves
  undoMove: (gameId: Guid) => `${engineBaseUrl}/${getIdValue(gameId)}/undo-move`,

  // to update engine games related settings
  updateEngineSettings: () => `${engineBaseUrl}/update-settings`,

  // to get all game data
  getEngineGame: (gameId: Guid) => `${engineBaseUrl}/${getIdValue(gameId)}`,

  // to get engine game winner
  getWinner: (gameId: Guid) => `${engineBaseUrl}/${getIdValue(gameId)}/winner`,

  // to get move done by engine
  getEngineGameMove: (gameId: Guid) => `${engineBaseUrl}/${getIdValue(gameId)}/engine-move`,

  // to get all messages from current game
  getAllEngineGameMessages: (gameId: Guid) => `${engineBaseUrl}/${getIdValue(gameId)}/all-messages`,

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

// to get id in any case
export const getIdValue = (id: any): string => {
  if (typeof id === "object" && "value" in id) return id.value ?? (id as string);
  return id as string;
};
