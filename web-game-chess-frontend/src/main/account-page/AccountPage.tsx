import axios from "axios";
import classes from "./AccountPage.module.scss";
import HistorySection from "./history-section/HistorySection";
import UserSection from "./user-section/UserSection";
import { GetTypeHistoryModel } from "../../shared/utils/types/gameModels";
import { gameControllerPaths, getAuthorization } from "../../shared/utils/services/ApiService";
import { Fragment, useState } from "react";
import { GetTypeHistoryDto } from "../../shared/utils/types/gameDtos";
import MainNav from "../../shared/components/main-nav/MainNav";
import LoadingPage from "../../shared/components/loading-page/LoadingPage";
import FriendsSection from "./friends-section/FriendsSection";
import MainPopUp from "../../shared/components/main-popup/MainPopUp";
import { getErrMessage } from "../../shared/utils/functions/errors";
import { usePopup } from "../../shared/utils/hooks/usePopUp";
import { PagedResult } from "../../shared/utils/types/abstractDtosAndModels";
import { timingTypeNames } from "../../shared/utils/objects/constantLists";

function AccountPage() {
  ///

  const { showPopup } = usePopup();

  // content of right side of account page
  const [content, setContent] = useState<JSX.Element>(<FriendsSection />);

  // to send fired list as section
  const setFriendSection = () => {
    setContent(<FriendsSection />);
  };
  //*/

  // gets timing type history for selected timing
  // to display time line charts
  const getTypeHistory = async (type: number) => {
    try {
      const model: GetTypeHistoryModel = {
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
        setContent(<HistorySection selectedType={timingTypeNames[type]} typeHistory={typeHistoryResponse.data} />);
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

      <Fragment>{content}</Fragment>

      <MainPopUp />
    </main>
  );
}

export default AccountPage;
