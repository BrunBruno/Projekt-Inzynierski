import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import classes from "./FriendSelection.module.scss";
import { GetAllFriendsByStatusDto } from "../../../../shared/utils/types/friendshipDtos";
import FriendList from "./friends-list/FriendList";
import { GetByEmailDto } from "../../../../shared/utils/types/userDtos";
import { InviteByEmailRef, InviteBySelectionRef, InviteByUrlRef } from "./FriendSelectionData";
import { Guid } from "guid-typescript";
import InviteBySelection from "./invite-by/InviteBySelection";
import InviteByEmail from "./invite-by/InviteByEmail";
import InviteByUrl from "./invite-by/InviteByUrl";
import { TimingTypeName } from "../../../../shared/utils/objects/constantLists";
import { useLocation } from "react-router-dom";
import { GameSearchInterface, StateOptions } from "../../../../shared/utils/objects/interfacesEnums";
import { InviteToPrivateGameRef } from "../GameHubSectionData";

type FriendSelectionProps = {
  setInterfaceById: (interfaceId: GameSearchInterface) => void;
};

const FriendSelection = forwardRef<InviteToPrivateGameRef, FriendSelectionProps>(
  ({ setInterfaceById }: FriendSelectionProps, ref: ForwardedRef<InviteToPrivateGameRef>) => {
    ///

    const location = useLocation();

    // invite function refs
    const inviteBySelectionRef = useRef<InviteBySelectionRef>(null);
    const inviteByEmailRef = useRef<InviteByEmailRef>(null);
    const inviteByUrlRef = useRef<InviteByUrlRef>(null);

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

    // to invite user base on selection
    const onInviteToPrivateGame = (header: TimingTypeName, values: [number, number]): void => {
      if (selectedFriend !== null) {
        onInviteBySelection(selectedFriend.friendshipId, header, values);
      }

      if (selectedUser !== null) {
        onInviteByEmail(selectedUser.email, header, values);
      }

      if (selectedByUrl !== false) {
        onInviteByUrl(header, values);
      }

      clearSelections();
    };

    useImperativeHandle(ref, () => ({
      onInviteToPrivateGame,
    }));

    const clearSelections = (): void => {
      setSelectedFriend(null);
      setSelectedUser(null);
      setSelectedByUrl(false);
    };
    //*/

    useEffect(() => {
      if (selectedFriend || selectedUser || selectedByUrl) {
        setInterfaceById(GameSearchInterface.vsFriend);
      }
    }, [selectedFriend, selectedUser, selectedByUrl]);

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
            <FriendList selectedUsername={selectedUsername} setSelectedFriend={setSelectedFriend} />
          </div>
          {/* --- */}
        </div>
      </div>
    );
  }
);

export default FriendSelection;
