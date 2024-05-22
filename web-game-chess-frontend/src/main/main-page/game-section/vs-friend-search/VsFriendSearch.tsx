import AvatarSvg from "../../../../shared/svgs/AvatarSvg";
import classes from "./VsFriendSearch.module.scss";

type VsFriendSearchProps = {};

function VsFriendSearch({}: VsFriendSearchProps) {
  return (
    <div className={classes.search}>
      <div className={classes.search__split}>
        <div className={classes.search__split__bar}>
          <h2>Invate to play</h2>

          <input />
        </div>
        <div className={classes.search__split__list}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={classes.search__split__list__element}>
              <div className={classes.avatar}>
                <AvatarSvg iconClass={classes["user-avatar"]} />
              </div>
              <div className={classes.data}>
                <h3>UsernameUsernameUsernameUsername</h3>
              </div>
              <div className={classes.invite}>
                <button>Invite</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VsFriendSearch;
