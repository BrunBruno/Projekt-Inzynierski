import { useState } from "react";
import classes from "./UsersPage.module.scss";
import BarSection from "./bar-section/BarSection";
import ListSection from "./list-section/ListSection";
import { FriendshipStatus } from "../../shared/utils/objects/entitiesEnums";
import MainNav from "../../shared/components/main-nav/MainNav";
import MainPopUp from "../../shared/components/main-popup/MainPopUp";
import ProfileSection from "./profile-section/ProfileSection";
import { GetOtherUserDto } from "../../shared/utils/types/userDtos";
import { GetFriendProfileDto } from "../../shared/utils/types/friendshipDtos";

function UsersPage() {
  ///

  // to filter by username
  const [selectedUsername, setSelectedUsername] = useState<string>("");
  // to select displayed list type
  const [selectedList, setSelectedList] = useState<FriendshipStatus>(FriendshipStatus.all);
  // data of other user to show profile
  const [userProfile, setUserProfile] = useState<GetOtherUserDto | null>(null);
  //  data of friend user to show profile
  const [friendProfile, setFriendProfile] = useState<GetFriendProfileDto | null>(null);

  // to hide profile window
  const closeProfile = (): void => {
    setUserProfile(null);
    setFriendProfile(null);
  };

  return (
    <main className={classes["users-main"]}>
      <MainNav />

      <BarSection
        setSelectedUsername={setSelectedUsername}
        selectedList={selectedList}
        setSelectedList={setSelectedList}
      />

      <div className={classes["users-list"]}>
        <ProfileSection userProfile={userProfile} friendProfile={friendProfile} closeProfile={closeProfile} />

        <ListSection
          selectedUsername={selectedUsername}
          selectedList={selectedList}
          setUserProfile={setUserProfile}
          setFriendProfile={setFriendProfile}
        />
      </div>

      <MainPopUp />
    </main>
  );
}

export default UsersPage;
