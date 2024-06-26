import { useState } from "react";
import classes from "./UsersPage.module.scss";
import BarSection from "./bar-section/BarSection";
import ListSection from "./list-section/ListSection";
import { friendshipStatus } from "../../shared/utils/enums/entitiesEnums";

function UsersPage() {
  const [selectedUsername, setSelectedUsername] = useState<string>("");
  const [selectedList, setSelectedList] = useState<number>(
    friendshipStatus.all
  );

  return (
    <main className={classes["users-main"]}>
      <BarSection
        setSelectedUsername={setSelectedUsername}
        selectedList={selectedList}
        setSelectedList={setSelectedList}
      />
      <ListSection
        selectedUsername={selectedUsername}
        selectedList={selectedList}
      />
    </main>
  );
}

export default UsersPage;
