import axios from "axios";
import classes from "./AccountPage.module.scss";
import HistorySection from "./history-section/HistorySection";
import UserSection from "./user-section/UserSection";
import { GetTypeHistoryModel } from "../../shared/utils/types/webGameModels";
import { webGameController, getAuthorization, userController } from "../../shared/utils/services/ApiService";
import { Fragment, useEffect, useState } from "react";
import { GetTypeHistoryDto } from "../../shared/utils/types/webGameDtos";
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
import SettingsSection from "./settings-section/SettingsSection";
import { GetEloDto, GetFullUserDto } from "../../shared/utils/types/userDtos";
import { AccountPageInterface } from "../../shared/utils/objects/interfacesEnums";

function AccountPage() {
  ///

  const { showPopup } = usePopup();
  const { pageNumber, pageSize, setDefPageSize, setTotalItemsCount } = usePagination();

  // content of right side of account page
  const [content, setContent] = useState<JSX.Element>(<></>);
  // selected history list
  const [selectedHistory, setSelectedHistory] = useState<GetTypeHistoryDto[] | null>(null);

  // set default page size
  useEffect(() => {
    setDefPageSize(1000); // ???
  }, [selectedHistory]);

  // all current user data
  const [user, setUser] = useState<GetFullUserDto | null>(null);
  const [elo, setElo] = useState<GetEloDto | null>(null);

  // to gat user data
  const getUser = async (): Promise<void> => {
    try {
      const userResponse = await axios.get<GetFullUserDto>(userController.getFullUser(), getAuthorization());

      setUser(userResponse.data);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  const getElo = async (): Promise<void> => {
    try {
      const eloResponse = await axios.get<GetEloDto>(userController.getElo(), getAuthorization());

      setElo(eloResponse.data);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  const fetchData = (): void => {
    getUser();
    getElo();
  };

  // get data on load
  useEffect(() => {
    fetchData();
  }, []);

  // gets timing type history for selected timing
  // to display time line charts
  const getTypeHistory = async (type: TimingType): Promise<void> => {
    /** use pagination here */
    const model: GetTypeHistoryModel = {
      pageNumber: pageNumber,
      pageSize: pageSize,
      type: type,
    };

    try {
      const response = await axios.get<PagedResult<GetTypeHistoryDto>>(
        webGameController.getTypeHistory(model),
        getAuthorization()
      );

      setSelectedHistory(response.data.items);
      setTotalItemsCount(response.data.totalItemsCount);

      setContent(<LoadingPage text="Loading data" />);

      setTimeout(() => {
        setContent(<HistorySection selectedType={timingTypeNames[type - 1]} typeHistory={response.data} />);
      }, 100);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  // for changing displayed content
  const setSelectedContent = (interfaceId: AccountPageInterface, type?: TimingType): void => {
    switch (interfaceId) {
      case AccountPageInterface.settings: {
        setContent(<SettingsSection user={user} />);
        break;
      }

      case AccountPageInterface.friends: {
        setContent(<FriendsSection />);
        break;
      }

      case AccountPageInterface.history: {
        if (type) getTypeHistory(type);
        break;
      }

      default: {
        setContent(<></>);
        break;
      }
    }
  };

  useEffect(() => {
    setSelectedContent(AccountPageInterface.settings);
  }, [user]);

  return (
    <main className={classes["account-main"]}>
      <MainNav />

      <UserSection user={user} elo={elo} fetchData={fetchData} setSelectedContent={setSelectedContent} />

      <Fragment>{content}</Fragment>

      <MainPopUp />
    </main>
  );
}

export default AccountPage;
