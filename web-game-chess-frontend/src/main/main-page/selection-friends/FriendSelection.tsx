import { useEffect, useState } from "react";
import classes from "./FriendSelection.module.scss";
import { GetAllFriendsByStatusDto } from "../../../shared/utils/types/friendshipDtos";
import FriendList from "./friends-list/FriendList";
import { GetByEmailDto } from "../../../shared/utils/types/userDtos";
import InviteBySelection from "./invite-by/InviteBySelection";
import InviteByEmail from "./invite-by/InviteByEmail";
import { useLocation } from "react-router-dom";
import { StateOptions } from "../../../shared/utils/objects/interfacesEnums";
import { PrivateGameOptions } from "../MainPageData";
import { StateProp } from "../../../shared/utils/types/commonTypes";
import InviteByUrl from "./invite-by/InviteByUrl";

type FriendSelectionProps = {
  // private game options state
  privateGameOptionsProp: StateProp<PrivateGameOptions | null>;
};

function FriendSelection({ privateGameOptionsProp }: FriendSelectionProps) {
  ///

  const location = useLocation();

  // for filtering by username
  const [selectedUsername, setSelectedUsername] = useState<string>("");

  // friend selection options
  const [selectedFriend, setSelectedFriend] = useState<GetAllFriendsByStatusDto | null>(null);
  const [selectedUser, setSelectedUser] = useState<GetByEmailDto | null>(null);
  const [selectedByUrl, setSelectedByUrl] = useState<boolean>(false);

  useEffect(() => {
    const locationState = location.state as StateOptions;
    if (!locationState) return;

    // when fired was selected from other page
    if (locationState.selectedFriend) {
      setSelectedFriend(locationState.selectedFriend);
    }
  }, [location.state]);

  // set for timing selection
  useEffect(() => {
    const options: PrivateGameOptions = {
      header: null,
      values: null,
      selectedFriend: selectedFriend === null ? undefined : selectedFriend,
      selectedUser: selectedUser === null ? undefined : selectedUser,
      selectedByUrl: selectedByUrl === null ? undefined : selectedByUrl,
    };

    if (selectedFriend || selectedUser || selectedByUrl) {
      privateGameOptionsProp.set(options);
    }
  }, [selectedFriend, selectedUser, selectedByUrl]);

  return (
    <div data-testid="main-page-vs-friend-section" className={classes.search}>
      <div className={classes.search__split}>
        {/* left side bar */}
        <div className={classes.search__split__bar}>
          <h2 className={classes["invite-title"]}>Invite to play</h2>

          <InviteBySelection setSelectedUsername={setSelectedUsername} />

          <InviteByEmail setSelectedUser={setSelectedUser} />

          <InviteByUrl setSelectedByUrl={setSelectedByUrl} />
        </div>

        {/* right side content */}
        <div className={classes.search__split__list}>
          <FriendList selectedUsername={selectedUsername} setSelectedFriend={setSelectedFriend} />
        </div>
      </div>
    </div>
  );
}

export default FriendSelection;
