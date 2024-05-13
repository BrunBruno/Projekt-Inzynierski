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
    turn: number;
    createdAt: Date;
    duration: number;
    increment: number;
};

export type GetPlayerDto = {
    name: string;
    elo: number;
    color: number | null;
};
