import AvatarSvg from "../../../../shared/svgs/AvatarSvg";
import classes from "./VsFriendSearch.module.scss";

type VsFriendSearchProps = {};

function VsFriendSearch({}: VsFriendSearchProps) {
  const handleCopyOnClick = async (
    event: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) => {
    try {
      const target = event.target as HTMLElement;
      const linkToCopy = target.innerText;

      await navigator.clipboard.writeText(linkToCopy);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={classes.search}>
      <div className={classes.search__split}>
        <div className={classes.search__split__bar}>
          <h2>Invate to play</h2>

          <p className={classes.text}>Search among friends:</p>
          <input placeholder="username" />

          <p className={classes.sep}>or</p>
          <p className={classes.text}>Send this link to friend:</p>
          <p
            className={classes.link}
            onClick={(event) => {
              handleCopyOnClick(event);
            }}
          >
            https://some/link
            <span>copy</span>
          </p>
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
