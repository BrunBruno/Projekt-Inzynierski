import { useNavigate } from "react-router-dom";
import AvatarImage from "../../../../shared/components/avatar-image/AvatarImage";
import { GetAllFriendsByStatusDto } from "../../../../shared/utils/types/friendshipDtos";
import classes from "./FriendCard.module.scss";
import { gameSearchInterface } from "../../../../shared/utils/enums/interfacesEnums";

type FriendCardProps = {
  friend: GetAllFriendsByStatusDto;
  setSelectedFriend: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  clearSelection: () => void;
};

function FriendCard({ friend, setSelectedFriend, clearSelection }: FriendCardProps) {
  ///

  const navigate = useNavigate();

  const checkProfile = () => {};

  const onInviteFriendToGame = async () => {
    navigate(`main/`, {
      state: {
        interface: gameSearchInterface.vsFriend,
      },
    });
  };

  const setActive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    const target = event.target as HTMLElement;

    setSelectedFriend(target);

    clearSelection();

    target.classList.add(classes.active);
  };

  return (
    <div
      className={classes.friend}
      onMouseEnter={(event) => {
        setActive(event);
      }}
    >
      <div className={classes.friend__content}>
        <div className={classes.friend__content__avatar}>
          <AvatarImage username={friend.username} imageUrl={friend.imageUrl} imageClass={classes.avatar} />

          <div className={classes["country"]}>
            <img src={`https://flagsapi.com/${friend.country}/flat/64.png`} />
          </div>
        </div>
        <div className={classes.friend__content__name}>
          <span>{friend.username}</span> <span>{friend.name === null ? "---" : friend.name}</span>
        </div>
        <div className={classes.friend__content__data}>
          <span>{friend.wins}</span>
          {" | "}
          <span>{friend.draws}</span>
          {" | "}
          <span>{friend.loses}</span>
        </div>{" "}
      </div>

      <div className={classes.friend__actions}>
        <button
          onClick={() => {
            checkProfile();
          }}
        >
          Profile
        </button>
        <button
          onClick={() => {
            onInviteFriendToGame();
          }}
        >
          Play
        </button>
      </div>
    </div>
  );
}

export default FriendCard;
