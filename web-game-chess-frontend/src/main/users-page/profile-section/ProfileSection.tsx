import AvatarImage from "../../../shared/components/avatar-image/AvatarImage";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { symbolIcons } from "../../../shared/svgs/iconsMap/SymbolIcons";
import { greyColor } from "../../../shared/utils/objects/colorMaps";
import { GetFriendProfileDto } from "../../../shared/utils/types/friendshipDtos";
import { GetOtherUserDto } from "../../../shared/utils/types/userDtos";
import classes from "./ProfileSection.module.scss";

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

  return (
    <section data-testid="users-page-profile-section" className={classes.profile}>
      {/* display user or friend based on list selection */}
      {userProfile !== null ? (
        <div className={classes.profile__content}>
          <div className={classes.profile__content__bg} />

          <AvatarImage
            username={userProfile.username}
            imageUrl={userProfile.imageUrl}
            containerClass={classes.profile__content__avatar}
            imageClass={classes["avatar-img"]}
          />

          <div className={classes.profile__content__data}>
            <h1>{userProfile.username}</h1>
            <h2>{userProfile.name === null ? "----- -----" : userProfile.name}</h2>
            <p className={classes["bio"]}>{userProfile.bio === null ? "" : userProfile.bio}</p>

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
      ) : friendProfile !== null ? (
        <div className={classes.profile__content}>
          <div className={classes.profile__content__bg} />

          <AvatarImage
            username={friendProfile.username}
            imageUrl={friendProfile.imageUrl}
            containerClass={classes.profile__content__avatar}
            imageClass={classes["avatar-img"]}
          />

          <div className={classes.profile__content__data}>
            <h1>{friendProfile.username}</h1>
            <h2>{friendProfile.name === null ? "----- -----" : friendProfile.name}</h2>
            <p className={classes["bio"]}>{friendProfile.bio === null ? "" : friendProfile.bio}</p>
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
      ) : (
        <></>
      )}
      {/* --- */}
    </section>
  );
}

export default ProfileSection;
