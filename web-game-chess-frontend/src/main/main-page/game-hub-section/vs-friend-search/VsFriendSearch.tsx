import { useRef, useState } from "react";
import classes from "./VsFriendSearch.module.scss";
import { GetAllFriendsByStatusDto } from "../../../../shared/utils/types/friendshipDtos";
import TimeSelection from "./time-selection/TimeSelection";
import FriendList from "./friends-list/FriendList";
import { GetByEmailDto } from "../../../../shared/utils/types/userDtos";
import { InviteByEmailRef, InviteBySelectionRef, InviteByUrlRef } from "./VsFriendSearchData";
import { Guid } from "guid-typescript";
import InviteBySelection from "./invite-by/InviteBySelection";
import InviteByEmail from "./invite-by/InviteByEmail";
import InviteByUrl from "./invite-by/InviteByUrl";
import { TimingTypeName } from "../../../../shared/utils/objects/constantLists";

type VsFriendSearchProps = {};

function VsFriendSearch({}: VsFriendSearchProps) {
  ///

  const inviteBySelectionRef = useRef<InviteBySelectionRef>(null);
  const inviteByEmailRef = useRef<InviteByEmailRef>(null);
  const inviteByUrlRef = useRef<InviteByUrlRef>(null);

  const [selectedUsername, setSelectedUsername] = useState<string>("");

  const [selectedFriend, setSelectedFriend] = useState<GetAllFriendsByStatusDto | null>(null);
  const [selectedUser, setSelectedUser] = useState<GetByEmailDto | null>(null);
  const [selectedByUrl, setSelectedByUrl] = useState<boolean>(false);

  // to invite users to game
  const onInviteBySelection = (friendshipId: Guid, header: TimingTypeName, values: [number, number]): void => {
    if (inviteBySelectionRef.current) {
      inviteBySelectionRef.current.onInviteBySelection(friendshipId, header, values);
    }
  };

  const onInviteByEmail = (email: string, header: TimingTypeName, values: [number, number]): void => {
    if (inviteByEmailRef.current) {
      inviteByEmailRef.current.onInviteByEmail(email, header, values);
    }
  };

  const onInviteByUrl = (header: TimingTypeName, values: [number, number]): void => {
    if (inviteByUrlRef.current) {
      inviteByUrlRef.current.onInviteByUrl(header, values);
    }
  };
  //*/

  return (
    <div data-testid="main-page-vs-friend-section" className={classes.search}>
      <div className={classes.search__split}>
        {/* left side bar */}
        <div className={classes.search__split__bar}>
          <h2 className={classes["invite-title"]}>Invite to play</h2>

          <InviteBySelection ref={inviteBySelectionRef} setSelectedUsername={setSelectedUsername} />

          <InviteByEmail ref={inviteByEmailRef} setSelectedUser={setSelectedUser} />

          <InviteByUrl ref={inviteByUrlRef} setSelectedByUrl={setSelectedByUrl} />
        </div>
        {/* --- */}

        {/* right side content */}
        <div className={classes.search__split__list}>
          {/* display time selection after choice was made */}
          {selectedFriend || selectedUser || selectedByUrl ? (
            <TimeSelection
              selectedFriend={selectedFriend}
              selectedUser={selectedUser}
              selectedByUrl={selectedByUrl}
              setSelectedFriend={setSelectedFriend}
              setSelectedUser={setSelectedUser}
              setSelectedByUrl={setSelectedByUrl}
              onInviteBySelection={onInviteBySelection}
              onInviteByEmail={onInviteByEmail}
              onInviteByUrl={onInviteByUrl}
            />
          ) : (
            <FriendList selectedUsername={selectedUsername} setSelectedFriend={setSelectedFriend} />
          )}
        </div>
        {/* --- */}
      </div>
    </div>
  );
}

export default VsFriendSearch;
