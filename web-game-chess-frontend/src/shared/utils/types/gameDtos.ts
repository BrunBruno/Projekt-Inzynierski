export type SearchGameDto = {
    playerId: string;
    timingId: string;
};

export type CheckIfInGameDto = {
    isInGame: boolean;
    gameId: string | null;
};

export type GetGameDto = {
    position: string;
    createdAt: Date;
    duration: number;
    increment: number;
    whitePlayer: GetGamePlayerDto;
    blackPlayer: GetGamePlayerDto;
};

export type GetGamePlayerDto = {
    name: string;
    elo: number;
};
