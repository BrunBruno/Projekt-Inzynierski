/* invite options */

import { Guid } from "guid-typescript";

export type InviteBySelectionRef = {
  onInviteBySelection: (friendshipId: Guid, header: string, values: number[]) => Promise<void>;
};

export type InviteByEmailRef = {
  onInviteByEmail: (email: string, header: string, values: number[]) => Promise<void>;
};

export type InviteByUrlRef = {
  onInviteByUrl: (header: string, values: number[]) => Promise<void>;
};
