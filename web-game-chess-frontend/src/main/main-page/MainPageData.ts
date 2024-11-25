import { TimingTypeName } from "../../shared/utils/objects/constantLists";
import { GameSearchInterface } from "../../shared/utils/objects/interfacesEnums";
import { GetAllFriendsByStatusDto } from "../../shared/utils/types/friendshipDtos";
import { GetByEmailDto } from "../../shared/utils/types/userDtos";

// options of offline game creation
export type OfflineGameOptions = {
  engineLevel?: number;
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

// prop functions
export type SetInterfaceById = (interfaceId: GameSearchInterface) => void;
