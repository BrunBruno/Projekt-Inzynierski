import { GetFinishedGamesModel } from "../types/gameModels";

// api paths and function
const baseUrl: string = "http://localhost:5125/api";

const userBaseUrl: string = baseUrl + "/user";

interface UserControllerPaths {
  register: string;
  logIn: string;
  regenerateCode: string;
  banUser: string;
  verifyEmail: string;
  getUser: string;
  isEmailVerified: string;
  getDataConfiguration: (configurationId: number) => string;
}

// paths in user controller
export const userControllerPaths: UserControllerPaths = {
  register: `${userBaseUrl}/sign-up`,
  logIn: `${userBaseUrl}/sign-in`,
  regenerateCode: `${userBaseUrl}/regenerate-code`,
  banUser: `${userBaseUrl}/ban`,
  verifyEmail: `${userBaseUrl}/verify-email`,
  getUser: `${userBaseUrl}`,
  isEmailVerified: `${userBaseUrl}/is-verified`,
  getDataConfiguration: (configurationId: number) =>
    `${userBaseUrl}/configuration/${configurationId}`,
};

const gameBaseUrl: string = baseUrl + "/game";

interface GameControllerPaths {
  startSearch: string;
  checkIfInGame: (playerId: string) => string;
  getGame: (gameId: string) => string;
  getPlayer: (gameId: string) => string;
  abortSearch: (playerId: string) => string;
  getFinishedGame: (getFinishedGameModel: GetFinishedGamesModel) => string;
  getEndedGame: (gameId: string) => string;
}

// paths in game controller
export const gameControllerPaths: GameControllerPaths = {
  startSearch: `${gameBaseUrl}/search`,
  checkIfInGame: (playerId: string) => `${gameBaseUrl}/check/${playerId}`,
  getGame: (gameId: string) => `${gameBaseUrl}/${gameId}`,
  getPlayer: (gameId: string) => `${gameBaseUrl}/${gameId}/player`,
  abortSearch: (playerId: string) => `${gameBaseUrl}/abort/${playerId}`,
  getFinishedGame: (getFinishedGameModel: GetFinishedGamesModel) => {
    return `${gameBaseUrl}/finished?${stringifyModel(getFinishedGameModel)}`;
  },
  getEndedGame: (gameId: string) => `${gameBaseUrl}/${gameId}/ended`,
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
