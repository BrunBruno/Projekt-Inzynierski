/* invite options */

import { Guid } from "guid-typescript";
import { TimingTypeName } from "../../../shared/utils/objects/constantLists";

export type InviteBySelectionRef = {
  onInviteBySelection: (friendshipId: Guid, header: TimingTypeName, values: [number, number]) => Promise<void>;
};

export type InviteByEmailRef = {
  onInviteByEmail: (email: string, header: TimingTypeName, values: [number, number]) => Promise<void>;
};

export type InviteByUrlRef = {
  onInviteByUrl: (header: TimingTypeName, values: [number, number]) => Promise<void>;
};
