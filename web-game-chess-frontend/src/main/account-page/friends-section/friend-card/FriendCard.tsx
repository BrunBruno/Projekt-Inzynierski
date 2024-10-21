import { useNavigate } from "react-router-dom";
import AvatarImage from "../../../../shared/components/avatar-image/AvatarImage";
import { GetAllFriendsByStatusDto } from "../../../../shared/utils/types/friendshipDtos";
import classes from "./FriendCard.module.scss";
import { GameSearchInterface, StateOptions } from "../../../../shared/utils/objects/interfacesEnums";
import { Dispatch, SetStateAction, MouseEvent } from "react";

type FriendCardProps = {
  // friend data
  friend: GetAllFriendsByStatusDto;
  // to select friend
  setSelectedFriend: Dispatch<SetStateAction<HTMLElement | null>>;
  // to clear selection
  clearSelection: () => void;
};

function FriendCard({ friend, setSelectedFriend, clearSelection }: FriendCardProps) {
  ///

  const navigate = useNavigate();

  //todotodo
  const checkProfile = () => {};

  // to navigate to vs-friend search
  const onInviteFriendToGame = async (): Promise<void> => {
    // pass the friend to invite to game
    const state: StateOptions = {
      interface: GameSearchInterface.vsFriend,
      selectedFriend: friend,
    };

    navigate(`/main`, { state: state });
  };
  //*/

  // to activate card
  const setActive = (event: MouseEvent<HTMLDivElement>): void => {
    const target = event.target as HTMLElement;

    setSelectedFriend(target);

    clearSelection();

    target.classList.add(classes.active);
  };
  //*/

  return (
    <div
      className={classes.friend}
      onMouseEnter={(event) => {
        setActive(event);
      }}
      onMouseLeave={() => {
        clearSelection();
      }}
    >
      {/* card content */}
      <div className={classes.friend__content}>
        <div className={classes.friend__content__avatar}>
          <AvatarImage username={friend.username} profilePicture={friend.profilePicture} imageClass={classes.avatar} />

          <div className={classes["country"]}>
            <img src={`https://flagsapi.com/${friend.country}/flat/64.png`} className={classes["country-flag"]} />
          </div>
        </div>
        <div className={classes.friend__content__name}>
          <span>{friend.username}</span> <span>{friend.name === null ? "---" : friend.name}</span>
        </div>
        <div className={classes.friend__content__data}>
          <span>{friend.wdlTotal.wins}</span>
          {" | "}
          <span>{friend.wdlTotal.draws}</span>
          {" | "}
          <span>{friend.wdlTotal.loses}</span>
        </div>{" "}
      </div>
      {/* --- */}

      {/* friend related actions */}
      <div className={classes.friend__actions}>
        <button
          className={classes["card-button"]}
          onClick={() => {
            checkProfile();
          }}
        >
          <span>Profile</span>
        </button>

        <button
          className={classes["card-button"]}
          onClick={() => {
            onInviteFriendToGame();
          }}
        >
          <span>Play</span>
        </button>
      </div>
      {/* --- */}
    </div>
  );
}

export default FriendCard;
