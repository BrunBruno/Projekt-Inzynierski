import { useEffect, useState } from "react";
import classes from "./UserSection.module.scss";
import { GetEloDto, GetUserDto } from "../../../shared/utils/types/userDtos";
import LoadingPage from "../../../shared/components/loading-page/LoadingPage";
import AvatarSvg from "../../../shared/svgs/AvatarSvg";
import axios from "axios";
import {
  getAuthorization,
  userControllerPaths,
} from "../../../shared/utils/functions/apiFunctions";
import TimingTypesIcons from "../../../shared/svgs/TimingTypesIcons";
import { timingTypes } from "../../../shared/utils/enums/entitiesEnums";

type UserSectionProps = {
  getTypeHistory: (type: number) => void;
};

function UserSection({ getTypeHistory }: UserSectionProps) {
  const [user, setUser] = useState<GetUserDto | null>(null);
  const [elo, setElo] = useState<GetEloDto | null>(null);

  const getUser = () => {
    const userInfo = localStorage.getItem("userInfo");

    if (userInfo) {
      try {
        const parsedUserInfo: GetUserDto = JSON.parse(userInfo);
        setUser(parsedUserInfo);
      } catch (err) {
        setUser(null);
      }
    }
  };

  const getElo = async () => {
    try {
      const eloResponse = await axios.get<GetEloDto>(
        userControllerPaths.getElo(),
        getAuthorization()
      );

      setElo(eloResponse.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUser();
    getElo();
  }, []);

  if (!user || !elo) {
    return <LoadingPage />;
  }

  return (
    <div className={classes.user}>
      <div className={classes.user__profile}>
        <div className={classes.user__profile__avatar}>
          {user.imageUrl === null ? (
            <AvatarSvg iconClass={classes["avatar-svg"]} />
          ) : (
            <img src={user.imageUrl} />
          )}

          <div className={classes["user-name"]}>
            <p>{user.userName}</p>
            <p>{user.fullName === null ? "----- -----" : user.fullName}</p>
          </div>
        </div>
        <div className={classes.user__profile__elo}>
          <div
            className={classes.user__profile__elo__type}
            onClick={() => {
              getTypeHistory(timingTypes.bullet);
            }}
          >
            <TimingTypesIcons
              iconName="bullet"
              iconClass={classes["elo-icon"]}
            />
            {elo.bullet}
          </div>
          <div
            className={classes.user__profile__elo__type}
            onClick={() => {
              getTypeHistory(timingTypes.blitz);
            }}
          >
            <TimingTypesIcons
              iconName="blitz"
              iconClass={classes["elo-icon"]}
            />
            {elo.blitz}
          </div>
          <div
            className={classes.user__profile__elo__type}
            onClick={() => {
              getTypeHistory(timingTypes.rapid);
            }}
          >
            <TimingTypesIcons
              iconName="rapid"
              iconClass={classes["elo-icon"]}
            />
            {elo.rapid}
          </div>
          <div
            className={classes.user__profile__elo__type}
            onClick={() => {
              getTypeHistory(timingTypes.classic);
            }}
          >
            <TimingTypesIcons
              iconName="classic"
              iconClass={classes["elo-icon"]}
            />
            {elo.classic}
          </div>
          <div
            className={classes.user__profile__elo__type}
            onClick={() => {
              getTypeHistory(timingTypes.daily);
            }}
          >
            <TimingTypesIcons
              iconName="daily"
              iconClass={classes["elo-icon"]}
            />
            {elo.daily}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserSection;
