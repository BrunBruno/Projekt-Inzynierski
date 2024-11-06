import { TimingTypeName } from "../../../shared/utils/objects/constantLists";
import { GetAllFriendsByStatusDto } from "../../../shared/utils/types/friendshipDtos";
import { GetByEmailDto } from "../../../shared/utils/types/userDtos";

export type OffileGameOptions = {
  engineLevel: number;
  enableTiming: boolean;
  enableUndo: boolean;
};

export type PrivateGameOptions = {
  header: TimingTypeName | null;
  values: [number, number] | null;

  selectedFriend?: GetAllFriendsByStatusDto;
  selectedUser?: GetByEmailDto;
  selectedByUrl?: boolean;
};
