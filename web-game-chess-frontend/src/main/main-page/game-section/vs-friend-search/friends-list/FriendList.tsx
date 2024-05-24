import AvatarSvg from "../../../../../shared/svgs/AvatarSvg";
import { GetAllFriendsByStatusDto } from "../../../../../shared/utils/types/friendshipDtos";
import classes from "./FriendList.module.scss";

type FriendListProps = {
  friends: GetAllFriendsByStatusDto[];
  setSelectedFriend: React.Dispatch<
    React.SetStateAction<GetAllFriendsByStatusDto | null>
  >;
};

function FriendList({ friends, setSelectedFriend }: FriendListProps) {
  return (
    <div className={classes.list}>
      {friends.map((friend) => (
        <div key={friend.freindshpId} className={classes.list__element}>
          <div className={classes.avatar}>
            {friend.imageUrl ? (
              <img src={friend.imageUrl} />
            ) : (
              <AvatarSvg iconClass={classes["user-avatar"]} />
            )}
          </div>
          <div className={classes.data}>
            <h3>{friend.username}</h3>
            <p>({friend.elo})</p>
          </div>
          <div className={classes.invite}>
            <button
              onClick={() => {
                setSelectedFriend(friend);
              }}
            >
              Invite
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FriendList;
