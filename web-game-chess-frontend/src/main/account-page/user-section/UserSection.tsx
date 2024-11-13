import { ChangeEvent, useEffect, useState } from "react";
import classes from "./UserSection.module.scss";
import { GetEloDto, GetFullUserDto } from "../../../shared/utils/types/userDtos";
import LoadingPage from "../../../shared/components/loading-page/LoadingPage";
import axios from "axios";
import { AuthorizationOptions, getAuthorization, userController } from "../../../shared/utils/services/ApiService";
import { UpdateProfileModel } from "../../../shared/utils/types/userModels";
import StatsRow from "./stats-row/StatsRow";
import { usePopup } from "../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../shared/utils/functions/errors";
import AvatarImage from "../../../shared/components/avatar-image/AvatarImage";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { userSectionIcons } from "./UserSectionIcons";
import { mainColor } from "../../../shared/utils/objects/colorMaps";
import { timingTypeIcons } from "../../../shared/svgs/iconsMap/TimingTypeIcons";
import { TimingType } from "../../../shared/utils/objects/entitiesEnums";
import { AccountPageInterface } from "../../../shared/utils/objects/interfacesEnums";

type UserSectionProps = {
  // user data
  user: GetFullUserDto | null;
  elo: GetEloDto | null;

  // get data
  fetchData: () => void;

  // to change selected content
  setSelectedContent: (interfaceId: AccountPageInterface, type?: TimingType) => void;
};

function UserSection({ user, elo, fetchData, setSelectedContent }: UserSectionProps) {
  ///

  const { showPopup } = usePopup();

  // states for setting changeable data
  const [name, setName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  useEffect(() => {
    if (!user) return;

    if (user.name !== null) {
      setName(user.name);
    }

    if (user.bio !== null) {
      setBio(user.bio);
    }
  }, [user]);

  // to change and update user personal data
  const updateUser = async (): Promise<void> => {
    const model: UpdateProfileModel = {
      name: name === "" ? null : name,
      bio: bio === "" ? null : bio,
      imageFile: profilePicture === null ? null : profilePicture,
    };

    try {
      const options: AuthorizationOptions = {
        contentType: "multipart/form-data",
      };

      await axios.put(userController.updateProfile(), model, getAuthorization(options));

      setName("");
      setBio("");
      setProfilePicture(null);

      // refresh data
      fetchData();
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };
  //*/

  // handle file input and update profile picture
  const handleProfilePicture = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const imageFile = files[0];
    if (imageFile.type === "image/jpeg" || imageFile.type === "image/png" || imageFile.type === "image/jpg") {
      setProfilePicture(imageFile);
    }
  };

  useEffect(() => {
    if (profilePicture) {
      updateUser();
    }
  }, [profilePicture]);
  //*/

  return (
    <section className={classes.user}>
      {/* user profile */}
      {!user ? (
        <div className={classes.user__profile}>
          <LoadingPage />
        </div>
      ) : (
        <div className={classes.user__profile}>
          <div className={classes.user__profile__avatar}>
            <AvatarImage
              username={user.username}
              profilePicture={user.profilePicture}
              imageClass={classes["avatar-img"]}
            />

            <label className={classes["set-img"]}>
              <IconCreator icons={userSectionIcons} iconName={"image"} />
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                className={classes["set-img-input"]}
                onChange={(event) => {
                  handleProfilePicture(event);
                }}
              />
            </label>
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
                data-testid="set-friends-button"
                className={`${classes.icon} ${classes["friends"]}`}
                onClick={() => {
                  setSelectedContent(AccountPageInterface.friends);
                }}
              >
                <IconCreator icons={userSectionIcons} iconName={"friends"} />
              </div>
              <span>Friends</span>
            </div>

            <div className={classes["icon-con"]}>
              <div
                className={`${classes.icon} ${classes["settings"]}`}
                onClick={() => {
                  setSelectedContent(AccountPageInterface.settings);
                }}
              >
                <IconCreator icons={userSectionIcons} iconName="settings" />
              </div>
              <span>Settings</span>
            </div>
          </div>
        </div>
      )}
      {/* --- */}

      {/* user stats */}
      <div className={classes.user__data}>
        {!user ? (
          <div className={classes.user__data__stats}>
            {Array.from({ length: 10 }).map((_, i: number) => (
              <p key={i} className={classes["loading-block"]} />
            ))}
          </div>
        ) : (
          <div className={classes.user__data__stats}>
            <div className={classes.user__data__stats__header}>
              Total games played: <span>{user.outcomeTotal.total}</span>
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
        )}

        {/* history view setter */}
        {!elo ? (
          <div className={classes.user__data__elo} />
        ) : (
          <div className={classes.user__data__elo}>
            <div className={classes.user__data__elo__header}>
              <span>Check history</span>
            </div>
            <div
              data-testid="set-history-bullet-button"
              className={classes.user__data__elo__type}
              onClick={() => {
                setSelectedContent(AccountPageInterface.history, TimingType.bullet);
              }}
            >
              <div className={classes["elo-points"]}>
                <IconCreator
                  icons={timingTypeIcons}
                  iconName={"bullet"}
                  iconClass={classes["elo-icon"]}
                  color={mainColor.c5}
                />
                <span>{elo.bullet}</span>{" "}
              </div>
            </div>

            <div
              data-testid="set-history-blitz-button"
              className={classes.user__data__elo__type}
              onClick={() => {
                setSelectedContent(AccountPageInterface.history, TimingType.blitz);
              }}
            >
              <div className={classes["elo-points"]}>
                <IconCreator
                  icons={timingTypeIcons}
                  iconName={"blitz"}
                  iconClass={classes["elo-icon"]}
                  color={mainColor.c5}
                />
                <span>{elo.blitz}</span>{" "}
              </div>
            </div>

            <div
              data-testid="set-history-rapid-button"
              className={classes.user__data__elo__type}
              onClick={() => {
                setSelectedContent(AccountPageInterface.history, TimingType.rapid);
              }}
            >
              <div className={classes["elo-points"]}>
                <IconCreator
                  icons={timingTypeIcons}
                  iconName={"rapid"}
                  iconClass={classes["elo-icon"]}
                  color={mainColor.c5}
                />
                <span>{elo.rapid}</span>{" "}
              </div>
            </div>

            <div
              data-testid="set-history-classic-button"
              className={classes.user__data__elo__type}
              onClick={() => {
                setSelectedContent(AccountPageInterface.history, TimingType.classic);
              }}
            >
              <div className={classes["elo-points"]}>
                <IconCreator
                  icons={timingTypeIcons}
                  iconName={"classic"}
                  iconClass={classes["elo-icon"]}
                  color={mainColor.c5}
                />
                <span>{elo.classic}</span>{" "}
              </div>
            </div>

            <div
              data-testid="set-history-daily-button"
              className={classes.user__data__elo__type}
              onClick={() => {
                setSelectedContent(AccountPageInterface.history, TimingType.daily);
              }}
            >
              <div className={classes["elo-points"]}>
                <IconCreator
                  icons={timingTypeIcons}
                  iconName={"daily"}
                  iconClass={classes["elo-icon"]}
                  color={mainColor.c5}
                />
                <span>{elo.daily}</span>{" "}
              </div>
            </div>
          </div>
        )}
        {/* --- */}
      </div>
      {/* --- */}
    </section>
  );
}

export default UserSection;
