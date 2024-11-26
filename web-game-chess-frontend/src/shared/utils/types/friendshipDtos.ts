/* friendship controller dtos */

import { Guid } from "guid-typescript";
import { EloDto, UserDto, GameOutcomeDto, UserImage } from "./abstractDtosAndModels";

export type GetAllFriendsByStatusDto = UserDto & {
  friendshipId: Guid;
  isRequestor: boolean;

  elo: EloDto;
  outcomeTotal: GameOutcomeDto;
  outcomeTogether: GameOutcomeDto;
};

export type GetAllNonFriendsDto = UserDto & {
  userId: Guid;

  elo: EloDto;
  outcomeTotal: GameOutcomeDto;
};

export type GetFriendProfileDto = UserDto & {
  bio: string | null;
  joinDate: Date;
  friendsSince: Date | null;

  elo: EloDto;
  outcomeTotal: GameOutcomeDto;
  outcomeTogether: GameOutcomeDto;
};

export type GetFriendshipRankingDto = {
  position: number;
  username: string;
  elo: number;
  gamesPlayed: number;
  typeGamesPlayed: number;
  gamesRatio: string;
  isUser: boolean;
  profile: UserImage | null;
};
