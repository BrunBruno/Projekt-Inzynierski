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
  register: () => `${userBaseUrl}/sign-up`,

  logIn: () => `${userBaseUrl}/sign-in`,

  regenerateCode: () => `${userBaseUrl}/regenerate-code`,

  verifyEmail: () => `${userBaseUrl}/verify-email`,

  getUser: () => `${userBaseUrl}`,

  isVerified: () => `${userBaseUrl}/is-verified`,

  getRegisterConf: (model: GetRegisterConfModel) =>
    `${userBaseUrl}/configuration/?${stringifyModel(model)}`,
};

const gameBaseUrl: string = baseUrl + "/game";

interface GameControllerPaths {
  //POST
  startSearch: () => string;
  //PUT
  //GET
  checkIfInGame: (model: CheckIfInGameModel) => string;
  getGame: (gameId: string) => string;
  getPlayer: (gameId: string) => string;
  getEndedGame: (gameId: string) => string;
  getFinishedGames: (model: GetFinishedGamesModel) => string;
  //DELETE
  abortSearch: (model: AbortSearchModel) => string;
}

// paths in game controller
export const gameControllerPaths: GameControllerPaths = {
  startSearch: () => `${gameBaseUrl}/search`,

  checkIfInGame: (model: CheckIfInGameModel) =>
    `${gameBaseUrl}/check-if-in-game/?${stringifyModel(model)}`,

  getGame: (gameId: string) => `${gameBaseUrl}/${gameId}`,

  getPlayer: (gameId: string) => `${gameBaseUrl}/${gameId}/player`,

  getEndedGame: (gameId: string) => `${gameBaseUrl}/${gameId}/ended`,

  getFinishedGames: (model: GetFinishedGamesModel) =>
    `${gameBaseUrl}/all-finished?${stringifyModel(model)}`,

  abortSearch: (model: AbortSearchModel) =>
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
}

export const friendshipControllerPaths: FriendshipControllerPaths = {
  inviteFriend: (): string => `${friendshipBaseUrl}/invite`,

  respondToFriendRequest: (): string => `${friendshipBaseUrl}/respond`,

  getAllFriendsByStatus: (model: GetAllFriendsByStatusModel): string =>
    `${friendshipBaseUrl}/all-by-status/?${stringifyModel(model)}`,

  getAllNonFriends: (model: GetAllNonFriendsModel): string =>
    `${friendshipBaseUrl}/all-non-friends/?${stringifyModel(model)}`,
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

const stringifyModel = (model: Object) => {
  const stringifiedModel = Object.fromEntries(
    Object.entries(model).map(([key, value]) => [key, String(value)])
  );

  const queryString = new URLSearchParams(stringifiedModel).toString();

  return queryString;
};
