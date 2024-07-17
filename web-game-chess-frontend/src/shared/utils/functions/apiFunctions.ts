import {
  GetAllFriendsByStatusModel,
  GetAllNonFriendsModel,
} from "../types/friendshipModels";
import {
  AbortSearchModel,
  CheckIfInGameModel,
  DeclineInvitationModel,
  GetAllInvitationsModel,
  GetFinishedGamesModel,
  GetTypeHistiryModel,
} from "../types/gameModels";
import {
  CheckIfEmailExistsModel,
  GetRegisterConfModel,
} from "../types/userModels";

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
  updateProfile: () => string;
  //GET
  getUser: () => string;
  getFullUser: () => string;
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

  getElo: (): string => `${userBaseUrl}/elo`,

  isVerified: (): string => `${userBaseUrl}/is-verified`,

  getByEmail: (model: CheckIfEmailExistsModel): string =>
    `${userBaseUrl}/by-email/?${stringifyModel(model)}`,

  getRegisterConf: (model: GetRegisterConfModel): string =>
    `${userBaseUrl}/configuration/?${stringifyModel(model)}`,
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
  getGame: (gameId: string) => string;
  getPlayer: (gameId: string) => string;
  fetchTime: (gameId: string) => string;
  getEndedGame: (gameId: string) => string;
  getGameTiming: (gameId: string) => string;
  getFinishedGames: (model: GetFinishedGamesModel) => string;
  getTypeHistory: (model: GetTypeHistiryModel) => string;
  getAllInvitations: (model: GetAllInvitationsModel) => string;
  //DELETE
  abortSearch: (model: AbortSearchModel) => string;
  declineInvitation: (model: DeclineInvitationModel) => string;
}

// paths in game controller
export const gameControllerPaths: GameControllerPaths = {
  startSearch: (): string => `${gameBaseUrl}/search`,

  createPrivateGame: (): string => `${gameBaseUrl}/private`,

  createGameByEmail: (): string => `${gameBaseUrl}/by-email`,

  checkIfInGame: (model: CheckIfInGameModel): string =>
    `${gameBaseUrl}/check-if-in-game/?${stringifyModel(model)}`,

  getGame: (gameId: string): string => `${gameBaseUrl}/${gameId}`,

  getPlayer: (gameId: string): string => `${gameBaseUrl}/${gameId}/player`,

  fetchTime: (gameId: string): string => `${gameBaseUrl}/${gameId}/time`,

  getEndedGame: (gameId: string): string => `${gameBaseUrl}/${gameId}/ended`,

  getGameTiming: (gameId: string): string => `${gameBaseUrl}/${gameId}/timing`,

  getFinishedGames: (model: GetFinishedGamesModel): string =>
    `${gameBaseUrl}/all-finished?${stringifyModel(model)}`,

  getTypeHistory: (model: GetTypeHistiryModel): string =>
    `${gameBaseUrl}/type-history?${stringifyModel(model)}`,

  getAllInvitations: (model: GetAllInvitationsModel): string =>
    `${gameBaseUrl}/invitations?${stringifyModel(model)}`,

  abortSearch: (model: AbortSearchModel): string =>
    `${gameBaseUrl}/abort?${stringifyModel(model)}`,

  declineInvitation: (model: DeclineInvitationModel): string =>
    `${gameBaseUrl}/decline?${stringifyModel(model)}`,
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
    `${friendshipBaseUrl}/all-by-status?${stringifyModel(model)}`,

  getAllNonFriends: (model: GetAllNonFriendsModel): string =>
    `${friendshipBaseUrl}/all-non-friends?${stringifyModel(model)}`,

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

// converts object to query string
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
