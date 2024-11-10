import { useEffect, useState } from "react";
import AvatarIcon from "../../svgs/icons/AvatarIcon";
import { UserImage } from "../../utils/types/abstractDtosAndModels";
import classes from "./AvatarImage.module.scss";
import IconCreator from "../icon-creator/IconCreator";
import { avatarImageIcons } from "./AvatarImageIcons";

type AvatarImageProps = {
  // username
  username: string;
  // profile picture if exists
  profilePicture: UserImage | string | null;
  // image container class (if needed)
  containerClass?: string;
  // image class (if needed)
  imageClass?: string;
  // to show bot image
  isBot?: boolean;
};

function AvatarImage({ username, profilePicture, containerClass, imageClass, isBot }: AvatarImageProps): JSX.Element {
  ///

  // image url
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  // set url if image file provided
  useEffect(() => {
    if (!profilePicture) return;

    if (typeof profilePicture === "string") {
      setImageSrc(profilePicture);
    } else {
      setImageSrc(`data:${profilePicture.contentType};base64,${profilePicture.data}`);
    }
  }, [profilePicture]);
  //*/

  return (
    <div className={`${classes["avatar-image"]} ${containerClass}`}>
      {imageSrc ? (
        <img className={`${classes.avatar} ${imageClass}`} src={imageSrc} alt={`${username}-profile-picture`} />
      ) : isBot ? (
        <IconCreator icons={avatarImageIcons} iconName={"bot"} iconClass={imageClass} />
      ) : (
        <AvatarIcon iconClass={`${classes.avatar} ${imageClass}`} />
      )}
    </div>
  );
}

export default AvatarImage;
