/* friendship controller dtos */

import { Guid } from "guid-typescript";
import { EloDto, UserDto, GameOutcomeDto } from "./abstractDtosAndModels";

export type GetAllFriendsByStatusDto = UserDto & {
  friendshipId: Guid;
  elo: EloDto;
  isRequestor: boolean;
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
