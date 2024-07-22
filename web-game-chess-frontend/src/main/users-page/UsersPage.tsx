import { useState } from "react";
import classes from "./UsersPage.module.scss";
import BarSection from "./bar-section/BarSection";
import ListSection from "./list-section/ListSection";
import { friendshipStatus } from "../../shared/utils/enums/entitiesEnums";
import MainNav from "../../shared/components/main-nav/MainNav";
import MainPopUp from "../../shared/components/main-popup/MainPopUp";

function UsersPage() {
  const [selectedUsername, setSelectedUsername] = useState<string>("");
  const [selectedList, setSelectedList] = useState<number>(
    friendshipStatus.all
  );

  return (
    <main className={classes["users-main"]}>
      <MainNav />

      <BarSection
        setSelectedUsername={setSelectedUsername}
        selectedList={selectedList}
        setSelectedList={setSelectedList}
      />

      <ListSection
        selectedUsername={selectedUsername}
        selectedList={selectedList}
      />

      <MainPopUp />
    </main>
  );
}

export default UsersPage;
