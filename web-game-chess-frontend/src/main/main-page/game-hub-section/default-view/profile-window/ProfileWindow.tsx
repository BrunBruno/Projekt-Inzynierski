import { useEffect, useState } from "react";
import classes from "./ProfileWindow.module.scss";
import axios from "axios";
import { GetEloDto, GetFullUserDto } from "../../../../../shared/utils/types/userDtos";
import { getAuthorization, userController } from "../../../../../shared/utils/services/ApiService";
import { usePopup } from "../../../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../../../shared/utils/functions/errors";
import AvatarImage from "../../../../../shared/components/avatar-image/AvatarImage";
import IconCreator from "../../../../../shared/components/icon-creator/IconCreator";
import { timingTypeIcons } from "../../../../../shared/svgs/iconsMap/TimingTypeIcons";
import { TimingTypeName } from "../../../../../shared/utils/objects/constantLists";
import { greyColor } from "../../../../../shared/utils/objects/colorMaps";
import { defaultViewIcons } from "../DefaultViewIcons";
import { displayFromLowercase } from "../../../../../shared/utils/functions/enums";

type ProfileWindowProps = {};

function ProfileWindow({}: ProfileWindowProps): JSX.Element {
  ///

  const { showPopup } = usePopup();

  const [userData, setUserData] = useState<GetFullUserDto | null>(null);
  const [eloData, setEloData] = useState<GetEloDto | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get<GetFullUserDto>(userController.getFullUser(), getAuthorization());

        setUserData(response.data);
      } catch (err) {
        showPopup(getErrMessage(err), "warning");
      }
    };

    const getElo = async () => {
      try {
        const response = await axios.get<GetEloDto>(userController.getElo(), getAuthorization());

        setEloData(response.data);
      } catch (err) {
        showPopup(getErrMessage(err), "warning");
      }
    };

    getUser();
    getElo();
  }, []);

  if (!userData || !eloData) return <></>;

  return (
    <div className={classes.profile}>
      <div className={classes.profile__image}>
        <AvatarImage
          profilePicture={userData.profilePicture}
          username={userData.username}
          imageClass={classes["user-avatar"]}
        />

        <p className={classes["user-name"]}>{userData.username}</p>
      </div>

      <div className={classes.profile__games}>
        <IconCreator
          icons={defaultViewIcons}
          iconName={"games"}
          iconClass={classes["block-icon"]}
          color={greyColor.c0}
        />
        <span>Games</span>
        <span>{userData.outcomeTotal.total}</span>
      </div>

      {Object.keys(eloData).map((key: string) => (
        <div key={key} className={classes.profile__elo}>
          <IconCreator
            icons={timingTypeIcons}
            iconName={key as TimingTypeName}
            iconClass={classes["block-icon"]}
            color={greyColor.c0}
          />

          <span>{displayFromLowercase(key)}</span>
          <span>{eloData[key as keyof typeof eloData]}</span>
        </div>
      ))}
    </div>
  );
}

export default ProfileWindow;
