import { useEffect, useState } from "react";
import classes from "./UserSection.module.scss";
import { GetEloDto, GetFullUserDto } from "../../../shared/utils/types/userDtos";
import LoadingPage from "../../../shared/components/loading-page/LoadingPage";
import axios from "axios";
import { getAuthorization, userControllerPaths } from "../../../shared/utils/services/ApiService";
import TimingTypesIcons from "../../../shared/svgs/TimingTypesIcons";
import { timingTypes } from "../../../shared/utils/enums/entitiesEnums";
import UserSectionIocns from "./UserSectionIcons";
import { UpdateProfileModel } from "../../../shared/utils/types/userModels";
import StatsRow from "./stats-row/StatsRow";
import { usePopup } from "../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../shared/utils/functions/displayError";
import AvatarImage from "../../../shared/components/avatar-image/AvatarImage";

type UserSectionProps = {
  getTypeHistory: (type: number) => void;
  setFriendSection: () => void;
};

function UserSection({ getTypeHistory, setFriendSection }: UserSectionProps) {
  ///

  const [user, setUser] = useState<GetFullUserDto | null>(null);
  const [elo, setElo] = useState<GetEloDto | null>(null);

  const [name, setName] = useState<string>("");
  const [bio, setBio] = useState<string>("");

  const { showPopup } = usePopup();

  const getUser = async () => {
    try {
      const userResponse = await axios.get<GetFullUserDto>(userControllerPaths.getFullUser(), getAuthorization());

      setUser(userResponse.data);

      if (userResponse.data.name !== null) {
        setName(userResponse.data.name);
      }
      if (userResponse.data.bio !== null) {
        setBio(userResponse.data.bio);
      }
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  const getElo = async () => {
    try {
      const eloResponse = await axios.get<GetEloDto>(userControllerPaths.getElo(), getAuthorization());

      setElo(eloResponse.data);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  const fetchData = () => {
    getUser();
    getElo();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateUser = async () => {
    const profileModel: UpdateProfileModel = {
      name: name === "" ? null : name,
      bio: bio === "" ? null : bio,
      imageUrl: null,
    };

    try {
      await axios.put(userControllerPaths.updateProfile(), profileModel, getAuthorization());

      fetchData();
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  if (!user || !elo) {
    return <LoadingPage text="Loading data" />;
  }

  return (
    <section className={classes.user}>
      <div className={classes.user__profile}>
        <div className={classes.user__profile__avatar}>
          <AvatarImage username={user.username} imageUrl={user.imageUrl} imageClass={classes["avatar-img"]} />

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
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
            onBlur={() => {
              updateUser();
            }}
          />

          <textarea
            className={classes["bio"]}
            placeholder="Enter your bio..."
            value={bio}
            onChange={(event) => {
              setBio(event.target.value);
            }}
            onBlur={() => {
              updateUser();
            }}
          ></textarea>
        </div>

        <div className={classes.user__profile__icons}>
          <div className={classes["iocn-con"]}>
            <div className={`${classes.icon} ${classes["country"]}`}>
              <img src={`https://flagsapi.com/${user.country}/flat/64.png`} />
            </div>
            <span>{user.country}</span>
          </div>
          <div className={classes["iocn-con"]}>
            <div
              className={`${classes.icon} ${classes["friends"]}`}
              onClick={() => {
                setFriendSection();
              }}
            >
              <UserSectionIocns iconName="friends" />
            </div>
            <span>Friends</span>
          </div>
          <div className={classes["iocn-con"]}>
            <div className={`${classes.icon} ${classes["settings"]}`}>
              <UserSectionIocns iconName="settings" />
            </div>
            <span>Settings</span>
          </div>
        </div>
      </div>
      <div className={classes.user__data}>
        <div className={classes.user__data__stats}>
          <div className={classes.user__data__stats__header}>
            Total games played: <span>{user.gamesPlayed}</span>
          </div>
          <div className={classes.user__data__stats__row}>
            <StatsRow type={"games"} user={user} />
          </div>
          <div className={classes.user__data__stats__row}>
            <StatsRow type={"wins"} user={user} />
          </div>
          <div className={classes.user__data__stats__row}>
            <StatsRow type={"loses"} user={user} />
          </div>
        </div>
        <div className={classes.user__data__elo}>
          <div className={classes.user__data__elo__header}>Check history</div>
          <div
            className={classes.user__data__elo__type}
            onClick={() => {
              getTypeHistory(timingTypes.bullet);
            }}
          >
            <TimingTypesIcons iconName="bullet" iconClass={classes["elo-icon"]} />
            <span>{elo.bullet}</span>
          </div>
          <div
            className={classes.user__data__elo__type}
            onClick={() => {
              getTypeHistory(timingTypes.blitz);
            }}
          >
            <TimingTypesIcons iconName="blitz" iconClass={classes["elo-icon"]} />
            <span>{elo.blitz}</span>
          </div>
          <div
            className={classes.user__data__elo__type}
            onClick={() => {
              getTypeHistory(timingTypes.rapid);
            }}
          >
            <TimingTypesIcons iconName="rapid" iconClass={classes["elo-icon"]} />
            <span>{elo.rapid}</span>
          </div>
          <div
            className={classes.user__data__elo__type}
            onClick={() => {
              getTypeHistory(timingTypes.classic);
            }}
          >
            <TimingTypesIcons iconName="classic" iconClass={classes["elo-icon"]} />
            <span>{elo.classic}</span>
          </div>
          <div
            className={classes.user__data__elo__type}
            onClick={() => {
              getTypeHistory(timingTypes.daily);
            }}
          >
            <TimingTypesIcons iconName="daily" iconClass={classes["elo-icon"]} />
            <span>{elo.daily}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UserSection;
