import classes from "./ProfilePage.module.scss";
import UserSection from "./user-section/FriendSection";
import MainNav from "../../shared/components/main-nav/MainNav";
import MainPopUp from "../../shared/components/main-popup/MainPopUp";
import GamesSection from "./games-section/GamesSection";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Guid } from "guid-typescript";
import { StateOptions } from "../../shared/utils/objects/interfacesEnums";

function ProfilePage() {
  ///

  const navigate = useNavigate();

  // friendship id from url
  const { friendshipIdStr } = useParams<{ friendshipIdStr: string }>();
  const [friendshipId, setFriendshipId] = useState<Guid | null>(null);

  // set friendship id
  useEffect(() => {
    if (friendshipIdStr) {
      const guid: Guid = Guid.parse(friendshipIdStr).toJSON().value;
      setFriendshipId(guid);
    } else {
      const state: StateOptions = {
        popup: { text: "ERROR GETTING FRIEND", type: "error" },
      };

      navigate("/main", { state: state });
    }
  }, [friendshipIdStr]);

  if (!friendshipId) return <></>;

  return (
    <main className={classes["account-main"]}>
      <MainNav />

      <UserSection friendshipId={friendshipId} />

      <GamesSection games={null} />
      <MainPopUp />
    </main>
  );
}

export default ProfilePage;
