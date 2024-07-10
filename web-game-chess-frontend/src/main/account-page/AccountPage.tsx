import axios from "axios";
import classes from "./AccountPage.module.scss";
import HistorySection from "./history-section/HistorySection";
import UserSection from "./user-section/UserSection";
import { PagedResult } from "../../shared/utils/types/commonTypes";
import { GetTypeHistiryModel } from "../../shared/utils/types/gameModels";
import {
  gameControllerPaths,
  getAuthorization,
} from "../../shared/utils/functions/apiFunctions";
import { useState } from "react";
import { GetTypeHistoryDto } from "../../shared/utils/types/gameDtos";
import MainNav from "../../shared/components/main-nav/MainNav";

const types = ["Bullet", "Blitz", "Rapid", "Classic", "Daily"];

function AccountPage() {
  const [content, setContent] = useState<JSX.Element>(<></>);

  const getTypeHistory = async (type: number) => {
    try {
      const model: GetTypeHistiryModel = {
        pageNumber: 1,
        pageSize: 100,
        type: type,
      };

      const typeHistoryResponse = await axios.get<
        PagedResult<GetTypeHistoryDto>
      >(gameControllerPaths.getTypeHistory(model), getAuthorization());

      setContent(
        <HistorySection
          selectedType={types[type]}
          typeHistory={typeHistoryResponse.data}
        />
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className={classes["account-main"]}>
      <MainNav />
      <UserSection getTypeHistory={getTypeHistory} />
      {content}
    </main>
  );
}

export default AccountPage;
