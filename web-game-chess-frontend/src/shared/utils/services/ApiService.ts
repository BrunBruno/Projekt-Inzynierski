import { Guid } from "guid-typescript";
import { GetAllFriendsByStatusModel, GetAllNonFriendsModel } from "../types/friendshipModels";
import {
  AbortSearchModel,
  CheckIfInGameModel,
  GetAllInvitationsModel,
  GetFinishedGamesModel,
  GetTypeHistiryModel,
} from "../types/gameModels";
import { CheckIfEmailExistsModel, GetOtherUserModel, GetRegisterConfModel } from "../types/userModels";

// api paths and function
// const baseUrl: string = "http://localhost:5125/api";
const baseUrl: string = "http://192.168.1.46:5125/api";

const userBaseUrl: string = baseUrl + "/user";

interface UserControllerPaths {
  //POST
  register: () => string;
  logIn: () => string;
  regenerateCode: () => string;
  //PUT
  verifyEmail: () => string;
  updateProfile: () => string;
  //GET
  getUser: () => string;
  getFullUser: () => string;
  getOtherUser: (model: GetOtherUserModel) => string;
  getElo: () => string;
  isVerified: () => string;
  getByEmail: (model: CheckIfEmailExistsModel) => string;
  getRegisterConf: (model: GetRegisterConfModel) => string;
  //DELETE
}

// paths in user controller
export const userControllerPaths: UserControllerPaths = {
  register: (): string => `${userBaseUrl}/sign-up`,

  logIn: (): string => `${userBaseUrl}/sign-in`,

  regenerateCode: (): string => `${userBaseUrl}/regenerate-code`,

  verifyEmail: (): string => `${userBaseUrl}/verify-email`,

  updateProfile: (): string => `${userBaseUrl}/profile`,

  getUser: (): string => `${userBaseUrl}`,

  getFullUser: (): string => `${userBaseUrl}/full`,

  getOtherUser: (model): string => `${userBaseUrl}/other/?${stringifyModel(model)}`,

  getElo: (): string => `${userBaseUrl}/elo`,

  isVerified: (): string => `${userBaseUrl}/is-verified`,

  getByEmail: (model: CheckIfEmailExistsModel): string => `${userBaseUrl}/by-email/?${stringifyModel(model)}`,

  getRegisterConf: (model: GetRegisterConfModel): string => `${userBaseUrl}/configuration/?${stringifyModel(model)}`,
};

const gameBaseUrl: string = baseUrl + "/game";

interface GameControllerPaths {
  //POST
  startSearch: () => string;
  createPrivateGame: () => string;
  createGameByEmail: () => string;
  //PUT
  //GET
  checkIfInGame: (model: CheckIfInGameModel) => string;
  getGame: (gameId: Guid) => string;
  getPlayer: (gameId: Guid) => string;
  fetchTime: (gameId: Guid) => string;
  getEndedGame: (gameId: Guid) => string;
  getGameTiming: (gameId: Guid) => string;
  getFinishedGames: (model: GetFinishedGamesModel) => string;
  getTypeHistory: (model: GetTypeHistiryModel) => string;
  getAllInvitations: (model: GetAllInvitationsModel) => string;
  //DELETE
  abortSearch: (model: AbortSearchModel) => string;
}

// paths in game controller
export const gameControllerPaths: GameControllerPaths = {
  startSearch: (): string => `${gameBaseUrl}/search`,

  createPrivateGame: (): string => `${gameBaseUrl}/private`,

  createGameByEmail: (): string => `${gameBaseUrl}/by-email`,

  checkIfInGame: (model: CheckIfInGameModel): string => `${gameBaseUrl}/check-if-in-game/?${stringifyModel(model)}`,

  getGame: (gameId: Guid): string => `${gameBaseUrl}/${gameId}`,

  getPlayer: (gameId: Guid): string => `${gameBaseUrl}/${gameId}/player`,

  fetchTime: (gameId: Guid): string => `${gameBaseUrl}/${gameId}/time`,

  getEndedGame: (gameId: Guid): string => `${gameBaseUrl}/${gameId}/ended`,

  getGameTiming: (gameId: Guid): string => `${gameBaseUrl}/${gameId}/timing`,

  getFinishedGames: (model: GetFinishedGamesModel): string => `${gameBaseUrl}/all-finished?${stringifyModel(model)}`,

  getTypeHistory: (model: GetTypeHistiryModel): string => `${gameBaseUrl}/type-history?${stringifyModel(model)}`,

  getAllInvitations: (model: GetAllInvitationsModel): string => `${gameBaseUrl}/invitations?${stringifyModel(model)}`,

  abortSearch: (model: AbortSearchModel): string => `${gameBaseUrl}/abort?${stringifyModel(model)}`,
};

const friendshipBaseUrl: string = baseUrl + "/friendship";

interface FriendshipControllerPaths {
  //POST
  inviteFriend: () => string;
  //PUT
  respondToFriendRequest: () => string;
  //GET
  getAllFriendsByStatus: (model: GetAllFriendsByStatusModel) => string;
  getAllNonFriends: (model: GetAllNonFriendsModel) => string;
  getFriendProfile: (friendshipId: Guid) => string;
  //DELETE
  removeFriend: (friendshipId: Guid) => string;
}

export const friendshipControllerPaths: FriendshipControllerPaths = {
  inviteFriend: (): string => `${friendshipBaseUrl}/invite`,

  respondToFriendRequest: (): string => `${friendshipBaseUrl}/respond`,

  getAllFriendsByStatus: (model: GetAllFriendsByStatusModel): string =>
    `${friendshipBaseUrl}/all-by-status?${stringifyModel(model)}`,

  getAllNonFriends: (model: GetAllNonFriendsModel): string =>
    `${friendshipBaseUrl}/all-non-friends?${stringifyModel(model)}`,

  getFriendProfile: (friendshipId: Guid): string => `${friendshipBaseUrl}/${friendshipId}`,

  removeFriend: (friendshipId: Guid): string => `${friendshipBaseUrl}/${friendshipId}`,
};

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
