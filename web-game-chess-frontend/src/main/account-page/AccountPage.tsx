import axios from "axios";
import classes from "./AccountPage.module.scss";
import HistorySection from "./history-section/HistorySection";
import UserSection from "./user-section/UserSection";
import { PagedResult } from "../../shared/utils/types/commonTypes";
import { GetTypeHistiryModel } from "../../shared/utils/types/gameModels";
import { gameControllerPaths, getAuthorization } from "../../shared/utils/functions/apiFunctions";
import { useState } from "react";
import { GetTypeHistoryDto } from "../../shared/utils/types/gameDtos";
import MainNav from "../../shared/components/main-nav/MainNav";
import LoadingPage from "../../shared/components/loading-page/LoadingPage";
import FriendsSection from "./friends-section/FriendsSection";
import MainPopUp from "../../shared/components/main-popup/MainPopUp";
import { getErrMessage } from "../../shared/utils/functions/displayError";
import { usePopup } from "../../shared/utils/hooks/usePopUp";

const types = ["Bullet", "Blitz", "Rapid", "Classic", "Daily"];

function AccountPage() {
  ///

  const [content, setContent] = useState<JSX.Element>(<FriendsSection />);

  const { showPopup } = usePopup();

  const setFriendSection = () => {
    setContent(<FriendsSection />);
  };

  const getTypeHistory = async (type: number) => {
    try {
      const model: GetTypeHistiryModel = {
        pageNumber: 1,
        pageSize: 100,
        type: type,
      };

      const typeHistoryResponse = await axios.get<PagedResult<GetTypeHistoryDto>>(
        gameControllerPaths.getTypeHistory(model),
        getAuthorization()
      );

      setContent(<LoadingPage text="Loading data" />);

      setTimeout(() => {
        setContent(<HistorySection selectedType={types[type]} typeHistory={typeHistoryResponse.data} />);
      }, 100);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  return (
    <main className={classes["account-main"]}>
      <MainNav />
      <UserSection getTypeHistory={getTypeHistory} setFriendSection={setFriendSection} />
      <>{content}</>

      <MainPopUp />
    </main>
  );
}

export default AccountPage;
