import { TimingTypeName } from "../../../shared/utils/objects/constantLists";

export type InviteToPrivateGameRef = {
  onInviteToPrivateGame: (header: TimingTypeName, values: [number, number]) => void;
};
