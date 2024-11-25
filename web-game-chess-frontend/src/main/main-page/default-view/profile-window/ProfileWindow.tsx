import { useEffect, useState } from "react";
import classes from "./ProfileWindow.module.scss";
import axios from "axios";
import { GetEloDto, GetFullUserDto } from "../../../../shared/utils/types/userDtos";
import { getAuthorization, userController } from "../../../../shared/utils/services/ApiService";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../../shared/utils/functions/errors";
import AvatarImage from "../../../../shared/components/avatar-image/AvatarImage";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { timingTypeIcons } from "../../../../shared/svgs/iconsMap/TimingTypeIcons";
import { TimingTypeName } from "../../../../shared/utils/objects/constantLists";
import { greyColor } from "../../../../shared/utils/objects/colorMaps";
import { defaultViewIcons } from "../DefaultViewIcons";
import { displayFromLowercase } from "../../../../shared/utils/functions/enums";
import { useNavigate } from "react-router-dom";

type ProfileWindowProps = {};

function ProfileWindow({}: ProfileWindowProps): JSX.Element {
  ///

  const navigate = useNavigate();
  const { showPopup } = usePopup();

  // user data
  const [userData, setUserData] = useState<GetFullUserDto | null>(null);
  const [eloData, setEloData] = useState<GetEloDto | null>(null);

  // for getting user data onload
  useEffect(() => {
    const getUserData = async (): Promise<void> => {
      try {
        const userResponse = await axios.get<GetFullUserDto>(userController.getFullUser(), getAuthorization());
        const eloResponse = await axios.get<GetEloDto>(userController.getElo(), getAuthorization());

        setUserData(userResponse.data);
        setEloData(eloResponse.data);
      } catch (err) {
        showPopup(getErrMessage(err), "warning");
      }
    };

    getUserData();
  }, []);

  if (!userData || !eloData) return <></>;

  return (
    <div className={classes.profile}>
      <div
        className={classes.profile__image}
        onClick={() => {
          navigate("account");
        }}
      >
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
        <span>{userData.onlineOutcomeTotal.total}</span>
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
