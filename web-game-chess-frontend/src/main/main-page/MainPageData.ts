import { TimingTypeName } from "../../shared/utils/objects/constantLists";
import { GetAllFriendsByStatusDto } from "../../shared/utils/types/friendshipDtos";
import { GetByEmailDto } from "../../shared/utils/types/userDtos";

// options of offlie game creation
export type OfflineGameOptions = {
  header: TimingTypeName | null;
  values: [number, number] | null;

  engineLevel?: number;
  enableTiming?: boolean;
  enableUndo?: boolean;
};

// options of private game creation
export type PrivateGameOptions = {
  header: TimingTypeName | null;
  values: [number, number] | null;

  selectedFriend?: GetAllFriendsByStatusDto;
  selectedUser?: GetByEmailDto;
  selectedByUrl?: boolean;
};
