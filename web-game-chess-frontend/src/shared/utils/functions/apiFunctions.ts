const userBaseUrl: string = "http://localhost:5125/api/user";

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

const gameBaseUrl: string = "http://localhost:5125/api/game";

interface GameControllerPaths {
    startSearch: string;
    checkIfInGame: (playerId: string) => string;
    getGame: (gameId: string) => string;
    getPlayer: (gameId: string) => string;
    abortSearch: (playerId: string) => string;
}

export const gameControllerPaths: GameControllerPaths = {
    startSearch: `${gameBaseUrl}/search`,
    checkIfInGame: (playerId: string) => `${gameBaseUrl}/check/${playerId}`,
    getGame: (gameId: string) => `${gameBaseUrl}/${gameId}`,
    getPlayer: (gameId: string) => `${gameBaseUrl}/${gameId}/player`,
    abortSearch: (playerId: string) => `${gameBaseUrl}/abort/${playerId}`,
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
