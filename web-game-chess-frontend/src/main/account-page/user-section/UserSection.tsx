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
import WinLoseIcons from "../../../shared/svgs/WinLoseIcons";
import WinTypesIcons from "../../../shared/svgs/WinTypesIcons";
import { UpdateProfileModel } from "../../../shared/utils/types/userModels";
import { PieChart } from "@mui/x-charts";
import {
  dangerColor,
  greyColor,
  mainColor,
  successColor,
} from "../../../shared/utils/enums/colorMaps";

type UserSectionProps = {
  getTypeHistory: (type: number) => void;
  setFriendSection: () => void;
};

function UserSection({ getTypeHistory, setFriendSection }: UserSectionProps) {
  const [user, setUser] = useState<GetFullUserDto | null>(null);
  const [elo, setElo] = useState<GetEloDto | null>(null);

  const [name, setName] = useState<string>("");
  const [bio, setBio] = useState<string>("");

  const getUser = async () => {
    try {
      const userResponse = await axios.get<GetFullUserDto>(
        userControllerPaths.getFullUser(),
        getAuthorization()
      );

      setUser(userResponse.data);

      if (userResponse.data.name !== null) {
        setName(userResponse.data.name);
      }
      if (userResponse.data.bio !== null) {
        setBio(userResponse.data.bio);
      }
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
      await axios.put(
        userControllerPaths.updateProfile(),
        profileModel,
        getAuthorization()
      );

      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

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
            <h4 className={classes.cat}>Games:</h4>
            <div className={classes["data-row"]}>
              <div className={classes["games"]}>
                <span>
                  Wins <WinLoseIcons iconName="win" />
                </span>
                <span>{user.wins}</span>
              </div>
              <div className={classes["games"]}>
                <span>
                  Draws <WinLoseIcons iconName="draw" />
                </span>
                <span>{user.draws}</span>
              </div>
              <div className={classes["games"]}>
                <span>
                  Loses <WinLoseIcons iconName="lose" />
                </span>
                <span>{user.loses}</span>
              </div>
            </div>

            <div className={classes.chart}>
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: user.wins, label: "Win" },
                      { id: 1, value: user.draws, label: "Draw" },
                      { id: 2, value: user.loses, label: "Lose" },
                    ],
                  },
                ]}
                colors={[successColor.mid, greyColor.c6, dangerColor.mid]}
                slotProps={{
                  legend: {
                    hidden: true,
                  },
                }}
              />
            </div>
          </div>
          <div className={classes.user__data__stats__row}>
            <h4>Wins by:</h4>

            <div className={classes["data-row"]}>
              <div className={classes["games"]}>
                <span>
                  Mate <WinTypesIcons iconName="checkmate" />
                </span>
                <span>{user.winsByCheckMate}</span>
              </div>
              <div className={classes["games"]}>
                <span>
                  Resign <WinTypesIcons iconName="resignation" />
                </span>
                <span>{user.winsByResignation}</span>
              </div>
              <div className={classes["games"]}>
                <span>
                  Timeout <WinTypesIcons iconName="outoftime" />
                </span>
                <span>{user.winsByTimeout}</span>
              </div>
            </div>

            <div className={classes.chart}>
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: user.winsByCheckMate, label: "Mate" },
                      { id: 1, value: user.winsByResignation, label: "Resign" },
                      { id: 2, value: user.winsByTimeout, label: "Timeout" },
                    ],
                  },
                ]}
                colors={[mainColor.c5, mainColor.c7, mainColor.c9]}
                slotProps={{
                  legend: {
                    hidden: true,
                  },
                }}
              />
            </div>
          </div>
          <div className={classes.user__data__stats__row}>
            <h4>Loses by:</h4>

            <div className={classes["data-row"]}>
              <div className={classes["games"]}>
                <span>
                  Mate <WinTypesIcons iconName="checkmate" />
                </span>
                <span>{user.losesByCheckMate}</span>
              </div>
              <div className={classes["games"]}>
                <span>
                  Resign <WinTypesIcons iconName="resignation" />
                </span>
                <span>{user.losesByResignation}</span>
              </div>
              <div className={classes["games"]}>
                <span>
                  Timeout <WinTypesIcons iconName="outoftime" />
                </span>
                <span>{user.losesByTimeout}</span>
              </div>
            </div>

            <div className={classes.chart}>
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: user.losesByCheckMate, label: "Mate" },
                      {
                        id: 1,
                        value: user.losesByResignation,
                        label: "Resign",
                      },
                      { id: 2, value: user.losesByTimeout, label: "Timeout" },
                    ],
                  },
                ]}
                colors={[mainColor.c5, mainColor.c7, mainColor.c9]}
                slotProps={{
                  legend: {
                    hidden: true,
                  },
                }}
              />
            </div>
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
