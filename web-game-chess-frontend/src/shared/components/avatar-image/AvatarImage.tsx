import AvatarIcon from "../../svgs/icons/AvatarIcon";
import classes from "./AvatarImage.module.scss";

type AvatarImageProps = {
  // username
  username: string;
  // profile picture url if exists
  imageUrl: string | null;
  // image container class (if needed)
  containerClass?: string;
  // image class (if needed)
  imageClass?: string;
};

function AvatarImage({ username, imageUrl, containerClass, imageClass }: AvatarImageProps): JSX.Element {
  ///

  return (
    <div className={`${classes["avatar-image"]} ${containerClass}`}>
      {imageUrl ? (
        <img className={`${classes.avatar} ${imageClass}`} src={imageUrl} alt={`${username}-profile-picture`} />
      ) : (
        <AvatarIcon iconClass={`${classes.avatar} ${imageClass}`} />
      )}
    </div>
  );
}

export default AvatarImage;
