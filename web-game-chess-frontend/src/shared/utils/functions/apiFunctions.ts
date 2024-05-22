import { GetFinishedGamesModel } from "../types/gameModels";

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
  getRegisterConf: (configurationId: number) => string;
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
  getRegisterConf: (configurationId: number) =>
    `${userBaseUrl}/configuration/${configurationId}`,
};

const gameBaseUrl: string = baseUrl + "/game";

interface GameControllerPaths {
  //POST
  startSearch: () => string;
  //PUT
  //GET
  checkIfInGame: (playerId: string) => string;
  getGame: (gameId: string) => string;
  getPlayer: (gameId: string) => string;
  getEndedGame: (gameId: string) => string;
  getFinishedGames: (getFinishedGameModel: GetFinishedGamesModel) => string;
  //DELETE
  abortSearch: (playerId: string) => string;
}

// paths in game controller
export const gameControllerPaths: GameControllerPaths = {
  startSearch: () => `${gameBaseUrl}/start-search`,
  checkIfInGame: (playerId: string) =>
    `${gameBaseUrl}/check-if-in-game/${playerId}`,
  getGame: (gameId: string) => `${gameBaseUrl}/${gameId}`,
  getPlayer: (gameId: string) => `${gameBaseUrl}/${gameId}/player`,
  getEndedGame: (gameId: string) => `${gameBaseUrl}/${gameId}/ended`,
  getFinishedGames: (getFinishedGameModel: GetFinishedGamesModel) =>
    `${gameBaseUrl}/all-finished?${stringifyModel(getFinishedGameModel)}`,
  abortSearch: (playerId: string) => `${gameBaseUrl}/abort/${playerId}`,
};

const friendshipBaseUrl: string = baseUrl + "/friendship";

interface FriendshipControllerPaths {
  //POST
  invite: () => string;
  //PUT
  accept: () => string;
  //GET
  getAllPending: () => string;
  getAllAccepted: () => string;
  //DELETE
  reject: () => string;
}

export const friendshipControllerPaths: FriendshipControllerPaths = {
  invite: (): string => `${friendshipBaseUrl}`,
  accept: (): string => `${friendshipBaseUrl}`,
  getAllPending: (): string => `${friendshipBaseUrl}`,
  getAllAccepted: (): string => `${friendshipBaseUrl}`,
  reject: (): string => `${friendshipBaseUrl}`,
};

type headers = {
  headers: {
    Authorization: string;
  };
};

// get authorization token for api calls
export const getAuthorization = (): headers => {
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
