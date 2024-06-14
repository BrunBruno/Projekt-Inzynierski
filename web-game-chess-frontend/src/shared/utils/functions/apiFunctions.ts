import {
  GetAllFriendsByStatusModel,
  GetAllNonFriendsModel,
} from "../types/friendshipModels";
import {
  AbortSearchModel,
  CheckIfInGameModel,
  GetFinishedGamesModel,
} from "../types/gameModels";
import { GetRegisterConfModel } from "../types/userModels";

// api paths and function
const baseUrl: string = "http://localhost:5125/api";

const userBaseUrl: string = baseUrl + "/user";

interface UserControllerPaths {
  //POST
  register: () => string;
  logIn: () => string;
  regenerateCode: () => string;
  //PUT
  verifyEmail: () => string;
  //GET
  getUser: () => string;
  isVerified: () => string;
  getRegisterConf: (model: GetRegisterConfModel) => string;
  //DELETE
}

// paths in user controller
export const userControllerPaths: UserControllerPaths = {
  register: (): string => `${userBaseUrl}/sign-up`,

  logIn: (): string => `${userBaseUrl}/sign-in`,

  regenerateCode: (): string => `${userBaseUrl}/regenerate-code`,

  verifyEmail: (): string => `${userBaseUrl}/verify-email`,

  getUser: (): string => `${userBaseUrl}`,

  isVerified: (): string => `${userBaseUrl}/is-verified`,

  getRegisterConf: (model: GetRegisterConfModel): string =>
    `${userBaseUrl}/configuration/?${stringifyModel(model)}`,
};

const gameBaseUrl: string = baseUrl + "/game";

interface GameControllerPaths {
  //POST
  startSearch: () => string;
  createPrivateGame: () => string;
  //PUT
  //GET
  checkIfInGame: (model: CheckIfInGameModel) => string;
  getGame: (gameId: string) => string;
  getPlayer: (gameId: string) => string;
  fetchTime: (gameId: string) => string;
  getEndedGame: (gameId: string) => string;
  getFinishedGames: (model: GetFinishedGamesModel) => string;
  //DELETE
  abortSearch: (model: AbortSearchModel) => string;
}

// paths in game controller
export const gameControllerPaths: GameControllerPaths = {
  startSearch: (): string => `${gameBaseUrl}/search`,

  createPrivateGame: (): string => `${gameBaseUrl}/private`,

  checkIfInGame: (model: CheckIfInGameModel): string =>
    `${gameBaseUrl}/check-if-in-game/?${stringifyModel(model)}`,

  getGame: (gameId: string): string => `${gameBaseUrl}/${gameId}`,

  getPlayer: (gameId: string): string => `${gameBaseUrl}/${gameId}/player`,

  fetchTime: (gameId: string): string => `${gameBaseUrl}/${gameId}/time`,

  getEndedGame: (gameId: string): string => `${gameBaseUrl}/${gameId}/ended`,

  getFinishedGames: (model: GetFinishedGamesModel): string =>
    `${gameBaseUrl}/all-finished?${stringifyModel(model)}`,

  abortSearch: (model: AbortSearchModel): string =>
    `${gameBaseUrl}/abort/?${stringifyModel(model)}`,
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
  //DELETE
  removeFriend: (friendshipId: string) => string;
}

export const friendshipControllerPaths: FriendshipControllerPaths = {
  inviteFriend: (): string => `${friendshipBaseUrl}/invite`,

  respondToFriendRequest: (): string => `${friendshipBaseUrl}/respond`,

  getAllFriendsByStatus: (model: GetAllFriendsByStatusModel): string =>
    `${friendshipBaseUrl}/all-by-status/?${stringifyModel(model)}`,

  getAllNonFriends: (model: GetAllNonFriendsModel): string =>
    `${friendshipBaseUrl}/all-non-friends/?${stringifyModel(model)}`,

  removeFriend: (friendshipId: string): string =>
    `${friendshipBaseUrl}/${friendshipId}`,
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

const stringifyModel = (model: Object): string => {
  const stringifiedModel = Object.entries(model).flatMap(([key, value]) => {
    if (Array.isArray(value)) {
      return value.map((element) => [key, String(element)]);
    }
    return [[key, String(value)]];
  });

  const queryString = new URLSearchParams(stringifiedModel).toString();

  return queryString;
};
