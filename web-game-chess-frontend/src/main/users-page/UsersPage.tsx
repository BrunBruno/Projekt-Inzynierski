import { useState } from "react";
import classes from "./UsersPage.module.scss";
import BarSection from "./bar-section/BarSection";
import ListSection from "./list-section/ListSection";
import { friendshipStatus } from "../../shared/utils/enums/entitiesEnums";
import MainNav from "../../shared/components/main-nav/MainNav";
import MainPopUp from "../../shared/components/main-popup/MainPopUp";
import ProfileSection from "./profile-section/ProfileSection";
import { GetOtherUserDto } from "../../shared/utils/types/userDtos";
import { GetFriendProfileDto } from "../../shared/utils/types/friendshipDtos";

function UsersPage() {
  ///

  const [selectedUsername, setSelectedUsername] = useState<string>("");
  const [selectedList, setSelectedList] = useState<number>(friendshipStatus.all);

  const [userProfile, setUserProfile] = useState<GetOtherUserDto | null>(null);
  const [friendProfile, setFriendProfile] = useState<GetFriendProfileDto | null>(null);

  const closeProfile = () => {
    setUserProfile(null);
    setFriendProfile(null);
  };

  return (
    <main className={classes["users-main"]}>
      <MainNav />

      <ProfileSection userProfile={userProfile} friendProfile={friendProfile} closeProfile={closeProfile} />

      <BarSection
        setSelectedUsername={setSelectedUsername}
        selectedList={selectedList}
        setSelectedList={setSelectedList}
      />

      <ListSection
        selectedUsername={selectedUsername}
        selectedList={selectedList}
        setUserProfile={setUserProfile}
        setFriendProfile={setFriendProfile}
      />

      <MainPopUp />
    </main>
  );
}

export default UsersPage;
