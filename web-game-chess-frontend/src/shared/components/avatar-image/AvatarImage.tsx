import AvatarSvg from "../../svgs/AvatarSvg";
import classes from "./AvatarImage.module.scss";

type AvatarImageProps = {
  username: string;
  imageUrl: string | null;
  containerClass?: string;
  imageClass?: string;
};

function AvatarImage({ username, imageUrl, containerClass, imageClass }: AvatarImageProps) {
  return (
    <div className={`${classes["avatar-image"]} ${containerClass}`}>
      {imageUrl ? (
        <img className={`${classes.avatar} ${imageClass}`} src={imageUrl} alt={`${username}-profile-picture`} />
      ) : (
        <AvatarSvg iconClass={`${classes.avatar} ${imageClass}`} />
      )}
    </div>
  );
}

export default AvatarImage;
