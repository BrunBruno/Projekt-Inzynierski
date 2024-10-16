import { useEffect, useState } from "react";
import AvatarIcon from "../../svgs/icons/AvatarIcon";
import { UserImage } from "../../utils/types/abstractDtosAndModels";
import classes from "./AvatarImage.module.scss";

type AvatarImageProps = {
  // username
  username: string;
  // profile picture if exists
  profilePicture: UserImage | null;
  // image container class (if needed)
  containerClass?: string;
  // image class (if needed)
  imageClass?: string;
};

function AvatarImage({ username, profilePicture, containerClass, imageClass }: AvatarImageProps): JSX.Element {
  ///

  // image url
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  // set url if image file provided
  useEffect(() => {
    if (!profilePicture) return;

    setImageSrc(`data:${profilePicture.contentType};base64,${profilePicture.data}`);
  }, [profilePicture]);

  //*/

  return (
    <div className={`${classes["avatar-image"]} ${containerClass}`}>
      {imageSrc ? (
        <img className={`${classes.avatar} ${imageClass}`} src={imageSrc} alt={`${username}-profile-picture`} />
      ) : (
        <AvatarIcon iconClass={`${classes.avatar} ${imageClass}`} />
      )}
    </div>
  );
}

export default AvatarImage;
