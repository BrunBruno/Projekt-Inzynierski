import axios from "axios";
import classes from "./AccountPage.module.scss";
import HistorySection from "./history-section/HistorySection";
import UserSection from "./user-section/UserSection";
import { GetTypeHistiryModel } from "../../shared/utils/types/gameModels";
import { gameControllerPaths, getAuthorization } from "../../shared/utils/services/ApiService";
import React, { useState } from "react";
import { GetTypeHistoryDto } from "../../shared/utils/types/gameDtos";
import MainNav from "../../shared/components/main-nav/MainNav";
import LoadingPage from "../../shared/components/loading-page/LoadingPage";
import FriendsSection from "./friends-section/FriendsSection";
import MainPopUp from "../../shared/components/main-popup/MainPopUp";
import { getErrMessage } from "../../shared/utils/functions/displayError";
import { usePopup } from "../../shared/utils/hooks/usePopUp";
import { PagedResult } from "../../shared/utils/types/abstracDtosAndModels";
import { timingTypesNames } from "../../shared/utils/enums/commonConstLists";

function AccountPage() {
  ///

  // content of right side of account page
  const [content, setContent] = useState<JSX.Element>(<FriendsSection />);

  const { showPopup } = usePopup();

  // to send fired list as section
  const setFriendSection = () => {
    setContent(<FriendsSection />);
  };
  //*/

  // gets timing type history for selcted timg
  // to display time linechars
  const getTypeHistory = async (type: number) => {
    try {
      const model: GetTypeHistiryModel = {
        pageNumber: 1,
        pageSize: 100,
        type: type,
      };
      /** use pagination here */

      const typeHistoryResponse = await axios.get<PagedResult<GetTypeHistoryDto>>(
        gameControllerPaths.getTypeHistory(model),
        getAuthorization()
      );

      setContent(<LoadingPage text="Loading data" />);

      setTimeout(() => {
        setContent(<HistorySection selectedType={timingTypesNames[type]} typeHistory={typeHistoryResponse.data} />);
      }, 100);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };
  //*/

  return (
    <main className={classes["account-main"]}>
      <MainNav />

      <UserSection getTypeHistory={getTypeHistory} setFriendSection={setFriendSection} />

      <React.Fragment>{content}</React.Fragment>

      <MainPopUp />
    </main>
  );
}

export default AccountPage;
