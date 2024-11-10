import AvatarImage from "../../../shared/components/avatar-image/AvatarImage";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { symbolIcons } from "../../../shared/svgs/iconsMap/SymbolIcons";
import { timingTypeIcons } from "../../../shared/svgs/iconsMap/TimingTypeIcons";
import { getTimePlayed } from "../../../shared/utils/functions/datetime";
import { greyColor, mainColor } from "../../../shared/utils/objects/colorMaps";
import { TimingTypeName, timingTypeNames } from "../../../shared/utils/objects/constantLists";
import { GetFriendProfileDto } from "../../../shared/utils/types/friendshipDtos";
import { GetOtherUserDto } from "../../../shared/utils/types/userDtos";
import classes from "./ProfileSection.module.scss";
import { MouseEvent } from "react";

type ProfileSectionProps = {
  // user data when non friend is selected
  userProfile: GetOtherUserDto | null;
  // user data when friend is selected
  friendProfile: GetFriendProfileDto | null;
  // to close profile page
  closeProfile: () => void;
};

function ProfileSection({ userProfile, friendProfile, closeProfile }: ProfileSectionProps) {
  ///

  const generateProfileModal = (userData: GetOtherUserDto | GetFriendProfileDto): JSX.Element => {
    const mapUserElo = (userData: GetOtherUserDto | GetFriendProfileDto): JSX.Element[] => {
      const elos: JSX.Element[] = [];

      Object.entries(userData.elo).forEach(([key, elo]: [string, number], i: number) => {
        const iconName = timingTypeNames[i].toLocaleLowerCase() as TimingTypeName;
        elos.push(
          <div key={`user-elo-${key}`} className={classes.elo}>
            <IconCreator
              icons={timingTypeIcons}
              iconName={iconName}
              iconClass={classes["elo-svg"]}
              color={mainColor.c9}
            />
            <p className={classes["elo-text"]}>{timingTypeNames[i]}</p>
            <p className={classes["elo-text"]}>{elo}</p>
          </div>
        );
      });

      return elos;
    };

    return (
      <div className={classes.profile__content}>
        <div className={classes.profile__content__bg}>
          {" "}
          <div className={classes.profile__content__bg__box} />
        </div>

        <div className={classes.profile__content__avatar}>
          <AvatarImage
            username={userData.username}
            profilePicture={userData.profilePicture}
            imageClass={classes["avatar-img"]}
            containerClass={classes["avatar-container"]}
          />

          <div className={classes["country"]}>
            <img src={`https://flagsapi.com/${userData.country}/flat/64.png`} className={classes["country-flag"]} />
          </div>

          <div className={classes["years-played"]}>
            <span>{getTimePlayed(new Date(userData.joinDate))}</span>
          </div>
        </div>

        <div className={classes.profile__content__data}>
          <div className={classes["user-info"]}>
            <h1>{userData.username}</h1>
            <h2>{userData.name === null ? "----- -----" : userData.name}</h2>
            <p className={classes["bio"]}>{userData.bio === null ? "" : userData.bio}</p>
          </div>

          <div className={classes["user-elos"]}>{mapUserElo(userData)}</div>

          {/* close button */}
          <div
            className={classes.x}
            onClick={() => {
              closeProfile();
            }}
          >
            <IconCreator icons={symbolIcons} iconName={"x"} iconClass={classes["close-svg"]} color={greyColor.c6} />
          </div>
        </div>
      </div>
    );
  };

  const handleSectionClick = (event: MouseEvent<HTMLElement>): void => {
    const target = event.target as HTMLElement;
    if (target.classList.contains(classes.profile)) {
      closeProfile();
    }
  };

  return (
    <section
      data-testid="users-page-profile-section"
      className={`
        ${classes.profile} 
        ${!userProfile && !friendProfile ? classes["not-selected"] : ""}
      `}
      onClick={(event) => {
        handleSectionClick(event);
      }}
    >
      {/* display user or friend based on list selection */}
      {userProfile !== null ? (
        generateProfileModal(userProfile)
      ) : friendProfile !== null ? (
        generateProfileModal(friendProfile)
      ) : (
        <></>
      )}
    </section>
  );
}

export default ProfileSection;
