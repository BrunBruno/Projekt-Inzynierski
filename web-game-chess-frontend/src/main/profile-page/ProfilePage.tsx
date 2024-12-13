import classes from "./ProfilePage.module.scss";
import MainNav from "../../shared/components/main-nav/MainNav";
import MainPopUp from "../../shared/components/main-popup/MainPopUp";
import GamesSection from "./games-section/GamesSection";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Guid } from "guid-typescript";
import { StateOptions } from "../../shared/utils/objects/interfacesEnums";
import { PagedResult } from "../../shared/utils/types/abstractDtosAndModels";
import { GetGamesOfFriendshipDto } from "../../shared/utils/types/friendshipDtos";
import { GetGamesOfFriendshipModel } from "../../shared/utils/types/friendshipModels";
import { usePopup } from "../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../shared/utils/functions/errors";
import axios from "axios";
import { friendshipController, getAuthorization } from "../../shared/utils/services/ApiService";
import FriendSection from "./user-section/FriendSection";

function ProfilePage() {
  ///

  const navigate = useNavigate();
  const { showPopup } = usePopup();

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

  const [games, setGames] = useState<PagedResult<GetGamesOfFriendshipDto> | null>(null);

  useEffect(() => {
    const getGames = async (): Promise<void> => {
      if (!friendshipId) return;

      const model: GetGamesOfFriendshipModel = {
        friendshipId: friendshipId,
        pageNumber: 1,
        pageSize: 100,
      }; // tododo

      try {
        const response = await axios.get<PagedResult<GetGamesOfFriendshipDto>>(
          friendshipController.getGamesOfFriendship(model),
          getAuthorization()
        );

        setGames(response.data);
      } catch (err) {
        showPopup(getErrMessage(err), "warning");
      }
    };

    getGames();
  }, [friendshipId]);

  if (!friendshipId) return <></>;

  return (
    <main data-testid="main-profile-page" className={classes["account-main"]}>
      <MainNav />

      <FriendSection friendshipId={friendshipId} />

      <GamesSection games={games} />

      <MainPopUp />
    </main>
  );
}

export default ProfilePage;
