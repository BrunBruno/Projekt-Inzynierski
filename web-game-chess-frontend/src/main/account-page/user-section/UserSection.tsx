import { useEffect, useState } from "react";
import classes from "./UserSection.module.scss";
import {
  GetEloDto,
  GetFullUserDto,
} from "../../../shared/utils/types/userDtos";
import LoadingPage from "../../../shared/components/loading-page/LoadingPage";
import AvatarSvg from "../../../shared/svgs/AvatarSvg";
import axios from "axios";
import {
  getAuthorization,
  userControllerPaths,
} from "../../../shared/utils/functions/apiFunctions";
import TimingTypesIcons from "../../../shared/svgs/TimingTypesIcons";
import { timingTypes } from "../../../shared/utils/enums/entitiesEnums";
import UserSectionIocns from "./UserSectionIcons";

type UserSectionProps = {
  getTypeHistory: (type: number) => void;
};

function UserSection({ getTypeHistory }: UserSectionProps) {
  const [user, setUser] = useState<GetFullUserDto | null>(null);
  const [elo, setElo] = useState<GetEloDto | null>(null);

  const getUser = async () => {
    try {
      const userResponse = await axios.get<GetFullUserDto>(
        userControllerPaths.getFullUser(),
        getAuthorization()
      );

      setUser(userResponse.data);
    } catch (err) {
      console.log(err);
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
    return <LoadingPage text="Loading data" />;
  }

  return (
    <div className={classes.user}>
      <div className={classes.user__profile}>
        <div className={classes.user__profile__avatar}>
          {user.imageUrl === null ? (
            <AvatarSvg iconClass={classes["avatar-img"]} />
          ) : (
            <img src={user.imageUrl} className={classes["avatar-img"]} />
          )}

          <div className={classes["set-img"]}>
            <UserSectionIocns iconName="image" />
          </div>
        </div>

        <div className={classes.user__profile__info}>
          <p className={classes["user-name"]}>{user.username}</p>

          <input
            type="text"
            className={classes["name"]}
            placeholder="Enter your name..."
            // value={user.name === null ? "" : user.name}
          />

          <textarea
            className={classes["bio"]}
            placeholder="Enter your bio..."
          ></textarea>
        </div>

        <div className={classes.user__profile__icons}>
          <div className={`${classes.icon} ${classes["country"]}`}>
            <img src={`https://flagsapi.com/${user.country}/flat/64.png`} />
          </div>
          <div className={`${classes.icon} ${classes["settings"]}`}>
            <UserSectionIocns iconName="settings" />
          </div>
        </div>
      </div>
      <div className={classes.user__data}>
        <div className={classes.user__data__stats}>
          <div className={classes.user__data__stats__header}>
            <span>Total games plaed: {user.gamesPlayed}</span>
          </div>
          <div className={classes.user__data__stats__row}>
            <h4>Games</h4>
            <p>{user.wins}</p>
            <p>{user.draws}</p>
            <p>{user.loses}</p>
          </div>
          <div className={classes.user__data__stats__row}>
            <h4>Wins</h4>
            <p>{user.winsByCheckMate}</p>
            <p>{user.winsByResignation}</p>
            <p>{user.winsByTimeout}</p>
          </div>
          <div className={classes.user__data__stats__row}>
            <h4>Loses</h4>
            <p>{user.losesByCheckMate}</p>
            <p>{user.losesByResignation}</p>
            <p>{user.losesByTimeout}</p>
          </div>
        </div>
        <div className={classes.user__data__elo}>
          <div
            className={classes.user__data__elo__type}
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
            className={classes.user__data__elo__type}
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
            className={classes.user__data__elo__type}
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
            className={classes.user__data__elo__type}
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
            className={classes.user__data__elo__type}
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
