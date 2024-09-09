import { useEffect, useState } from "react";
import classes from "./UserSection.module.scss";
import { GetEloDto, GetFullUserDto } from "../../../shared/utils/types/userDtos";
import LoadingPage from "../../../shared/components/loading-page/LoadingPage";
import axios from "axios";
import { getAuthorization, userControllerPaths } from "../../../shared/utils/services/ApiService";
import { TimingTypes } from "../../../shared/utils/enums/entitiesEnums";
import { UpdateProfileModel } from "../../../shared/utils/types/userModels";
import StatsRow from "./stats-row/StatsRow";
import { usePopup } from "../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../shared/utils/functions/displayError";
import AvatarImage from "../../../shared/components/avatar-image/AvatarImage";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { userSectionIcons } from "./UserSectionIcons";
import { timingTypesIcons } from "../../../shared/svgs/TimingTypesIcons";
import { mainColor } from "../../../shared/utils/enums/colorMaps";

type UserSectionProps = {
  // to obtain game timing history by selection timing type
  // sends right column view to type history chart
  getTypeHistory: (type: number) => void;
  // to view send to friend list
  setFriendSection: () => void;
};

function UserSection({ getTypeHistory, setFriendSection }: UserSectionProps) {
  ///

  const [user, setUser] = useState<GetFullUserDto | null>(null);
  const [elo, setElo] = useState<GetEloDto | null>(null);

  const [name, setName] = useState<string>("");
  const [bio, setBio] = useState<string>("");

  const { showPopup } = usePopup();

  // to gat user data
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
  //*/

  // to change and update user personal data
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
  //*/

  if (!user || !elo) return <LoadingPage text="Loading data" />;

  return (
    <section className={classes.user}>
      {/* user profile */}
      <div className={classes.user__profile}>
        <div className={classes.user__profile__avatar}>
          <AvatarImage username={user.username} imageUrl={user.imageUrl} imageClass={classes["avatar-img"]} />

          <div className={classes["set-img"]}>
            <IconCreator icons={userSectionIcons} iconName="image" />
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
          <div className={classes["icon-con"]}>
            <div className={`${classes.icon} ${classes["country"]}`}>
              <img src={`https://flagsapi.com/${user.country}/flat/64.png`} />
            </div>
            <span>{user.country}</span>
          </div>
          <div className={classes["icon-con"]}>
            <div
              className={`${classes.icon} ${classes["friends"]}`}
              onClick={() => {
                setFriendSection();
              }}
            >
              <IconCreator icons={userSectionIcons} iconName="friends" />
            </div>
            <span>Friends</span>
          </div>
          <div className={classes["icon-con"]}>
            <div className={`${classes.icon} ${classes["settings"]}`}>
              <IconCreator icons={userSectionIcons} iconName="settings" />
            </div>
            <span>Settings</span>
          </div>
        </div>
      </div>
      {/* --- */}

      {/* user stats */}
      <div className={classes.user__data}>
        <div className={classes.user__data__stats}>
          <div className={classes.user__data__stats__header}>
            Total games played: <span>{user.wdlTotal.total}</span>
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
              getTypeHistory(TimingTypes.bullet);
            }}
          >
            <IconCreator
              icons={timingTypesIcons}
              iconName="bullet"
              iconClass={classes["elo-icon"]}
              color={mainColor.c5}
            />
            <span>{elo.bullet}</span>
          </div>
          <div
            className={classes.user__data__elo__type}
            onClick={() => {
              getTypeHistory(TimingTypes.blitz);
            }}
          >
            <IconCreator
              icons={timingTypesIcons}
              iconName="blitz"
              iconClass={classes["elo-icon"]}
              color={mainColor.c5}
            />
            <span>{elo.blitz}</span>
          </div>
          <div
            className={classes.user__data__elo__type}
            onClick={() => {
              getTypeHistory(TimingTypes.rapid);
            }}
          >
            <IconCreator
              icons={timingTypesIcons}
              iconName="rapid"
              iconClass={classes["elo-icon"]}
              color={mainColor.c5}
            />
            <span>{elo.rapid}</span>
          </div>
          <div
            className={classes.user__data__elo__type}
            onClick={() => {
              getTypeHistory(TimingTypes.classic);
            }}
          >
            <IconCreator
              icons={timingTypesIcons}
              iconName="classic"
              iconClass={classes["elo-icon"]}
              color={mainColor.c5}
            />
            <span>{elo.classic}</span>
          </div>
          <div
            className={classes.user__data__elo__type}
            onClick={() => {
              getTypeHistory(TimingTypes.daily);
            }}
          >
            <IconCreator
              icons={timingTypesIcons}
              iconName="daily"
              iconClass={classes["elo-icon"]}
              color={mainColor.c5}
            />
            <span>{elo.daily}</span>
          </div>
        </div>
      </div>
      {/* --- */}
    </section>
  );
}

export default UserSection;
