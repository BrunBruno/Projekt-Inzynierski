import axios from "axios";
import classes from "./AccountPage.module.scss";
import HistorySection from "./history-section/HistorySection";
import UserSection from "./user-section/UserSection";
import { GetTypeHistoryModel } from "../../shared/utils/types/gameModels";
import { gameController, getAuthorization } from "../../shared/utils/services/ApiService";
import { Fragment, useEffect, useState } from "react";
import { GetTypeHistoryDto } from "../../shared/utils/types/gameDtos";
import MainNav from "../../shared/components/main-nav/MainNav";
import LoadingPage from "../../shared/components/loading-page/LoadingPage";
import FriendsSection from "./friends-section/FriendsSection";
import MainPopUp from "../../shared/components/main-popup/MainPopUp";
import { getErrMessage } from "../../shared/utils/functions/errors";
import { usePopup } from "../../shared/utils/hooks/usePopUp";
import { PagedResult } from "../../shared/utils/types/abstractDtosAndModels";
import { timingTypeNames } from "../../shared/utils/objects/constantLists";
import { TimingType } from "../../shared/utils/objects/entitiesEnums";
import usePagination from "../../shared/utils/hooks/usePagination";

function AccountPage() {
  ///

  const { showPopup } = usePopup();
  const { pageNumber, pageSize, setDefPageSize, setTotalItemsCount } = usePagination();

  // content of right side of account page
  const [content, setContent] = useState<JSX.Element>(<FriendsSection />);
  // selected history list
  const [selectedHistory, setSelectedHistory] = useState<GetTypeHistoryDto[] | null>(null);

  // to send fired list as section
  const setFriendSection = () => {
    setContent(<FriendsSection />);
  };
  //*/

  // set default page size
  useEffect(() => {
    // todotodo
    setDefPageSize(100);
  }, [selectedHistory]);
  //*/

  // gets timing type history for selected timing
  // to display time line charts
  const getTypeHistory = async (type: TimingType): Promise<void> => {
    try {
      const model: GetTypeHistoryModel = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        type: type,
      };
      /** use pagination here */

      const typeHistoryResponse = await axios.get<PagedResult<GetTypeHistoryDto>>(
        gameController.getTypeHistory(model),
        getAuthorization()
      );

      setSelectedHistory(typeHistoryResponse.data.items);
      setTotalItemsCount(typeHistoryResponse.data.totalItemsCount);

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
