import { useEffect, useState } from "react";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { timingTypeIcons } from "../../../shared/svgs/iconsMap/TimingTypeIcons";
import { greyColor, mainColor } from "../../../shared/utils/objects/colorMaps";
import { TimingTypeName, timingTypeNames } from "../../../shared/utils/objects/constantLists";
import { rankingPageIcons } from "../RankingPageIcons";
import classes from "./TableSection.module.scss";
import axios from "axios";
import { friendshipController, getAuthorization, userController } from "../../../shared/utils/services/ApiService";
import { GetUsersRankingModel } from "../../../shared/utils/types/userModels";
import { TimingType } from "../../../shared/utils/objects/entitiesEnums";
import { PagedResult } from "../../../shared/utils/types/abstractDtosAndModels";
import { GetUserRankingDto } from "../../../shared/utils/types/userDtos";
import LoadingPage from "../../../shared/components/loading-page/LoadingPage";
import { GetFriendshipRankingModel } from "../../../shared/utils/types/friendshipModels";
import { GetFriendshipRankingDto } from "../../../shared/utils/types/friendshipDtos";
import { usePopup } from "../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../shared/utils/functions/errors";
import { getEnumValueByKey } from "../../../shared/utils/functions/enums";
import usePagination from "../../../shared/utils/hooks/usePagination";
import { symbolIcons } from "../../../shared/svgs/iconsMap/SymbolIcons";
import AvatarImage from "../../../shared/components/avatar-image/AvatarImage";

const constPageSize: number = 10;

type TableSectionProps = {};

function TableSection({}: TableSectionProps) {
  ///

  const { pageNumber, pageSize, setDefPageSize, setDefPageNumber, setTotalItemsCount } = usePagination();
  const { showPopup } = usePopup();

  const [usersRanking, setUsersRanking] = useState<
    PagedResult<GetUserRankingDto> | PagedResult<GetFriendshipRankingDto> | null
  >(null);

  const [isGlobalList, steIsGlobalList] = useState<boolean>(true);
  const [selectedTiming, setSelectedTiming] = useState<TimingType>(TimingType.bullet);

  useEffect(() => {
    setDefPageSize(constPageSize);
  }, []);

  // get rating based on user selection
  const getUsersRating = async (): Promise<void> => {
    const model: GetUsersRankingModel = {
      pageNumber: pageNumber,
      pageSize: pageSize,
      type: selectedTiming,
    };

    try {
      const response = await axios.get<PagedResult<GetUserRankingDto>>(
        userController.getUsersRanking(model),
        getAuthorization()
      );

      setUsersRanking(response.data);
      setTotalItemsCount(response.data.items.length);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  const getFriendsRating = async (): Promise<void> => {
    const model: GetFriendshipRankingModel = {
      pageNumber: pageNumber,
      pageSize: pageSize,
      type: selectedTiming,
    };

    try {
      const response = await axios.get<PagedResult<GetFriendshipRankingDto>>(
        friendshipController.getFriendshipRanking(model),
        getAuthorization()
      );

      setUsersRanking(response.data);
      setTotalItemsCount(response.data.items.length);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  useEffect(() => {
    if (isGlobalList) {
      getUsersRating();
    } else {
      getFriendsRating();
    }
  }, [isGlobalList, selectedTiming, pageNumber, pageSize]);

  // options setters
  const onSetSelectedList = (isGlobal: boolean): void => {
    setDefPageNumber(1);
    steIsGlobalList(isGlobal);
  };

  const onSetSelectedTiming = (timingName: TimingTypeName): void => {
    const value: TimingType = getEnumValueByKey(TimingType, timingName);

    setDefPageNumber(1);
    setSelectedTiming(value);
  };

  const onChangePage = (addValue: number): void => {
    if (!usersRanking) return;

    setDefPageNumber((prevSize) => {
      const newSize = prevSize + addValue;
      if (newSize < 1 || newSize > usersRanking.totalPages) return prevSize;

      return newSize;
    });
  };

  if (!usersRanking) return <LoadingPage />;

  return (
    <section className={classes.table}>
      <div className={classes["bg-decorator"]}>
        <IconCreator icons={rankingPageIcons} iconName={"background"} iconClass={classes["bg-icon"]} color={"#fff"} />
      </div>
      <div className={classes["bg-decorator"]}>
        <IconCreator icons={rankingPageIcons} iconName={"background"} iconClass={classes["bg-icon"]} color={"#000"} />
      </div>

      <div className={classes.table__content}>
        <IconCreator
          icons={rankingPageIcons}
          iconName={"banner"}
          iconClass={classes["banner-icon"]}
          color={mainColor.c9}
        />
        <IconCreator
          icons={rankingPageIcons}
          iconName={"banner"}
          iconClass={classes["banner-icon"]}
          color={mainColor.c9}
        />

        <div className={classes["banner"]}>
          <div className={classes["decor"]}></div>
          <div className={classes["decor"]}></div>

          <h1 className={classes["title"]}>
            <IconCreator
              icons={rankingPageIcons}
              iconName={"trophy"}
              iconClass={classes["trophy-icon"]}
              color={mainColor.c0}
            />
            <span>LEADERBOARDS</span>
            <IconCreator
              icons={rankingPageIcons}
              iconName={"trophy"}
              iconClass={classes["trophy-icon"]}
              color={mainColor.c0}
            />
          </h1>
        </div>

        <div className={classes.table__content__data}>
          <div className={classes["record-list"]}>
            <div className={classes["table-header"]}>
              <p className={classes["p-column"]}>No.</p>
              <p className={classes["p-column"]}></p>
              <p className={classes["p-column"]}>Username</p>
              <p className={classes["p-column"]}>Elo</p>
              <p className={classes["p-column"]}>Games</p>
              <p className={classes["p-column"]}>Ratio</p>
            </div>

            {usersRanking.items.map((user: GetUserRankingDto | GetFriendshipRankingDto, i: number) => (
              <div
                key={`table-record-${i}-${user.username}`}
                className={`${classes["table-record"]} ${user.isUser ? classes["active-record"] : ""}`}
              >
                <div className={classes["col"]}>
                  <span>
                    <span style={{ color: mainColor.c5 }}>#</span>
                    {user.position}
                  </span>
                </div>
                <div className={classes["col"]}>
                  <AvatarImage username={user.username} profilePicture={user.profile} imageClass={classes.avatar} />
                </div>
                <div className={classes["col"]}>
                  <span>{user.username}</span>
                </div>
                <div className={classes["col"]}>
                  <span>{user.elo}</span>
                </div>
                <div className={classes["col"]}>
                  <span>{user.typeGamesPlayed}</span>
                </div>
                <div className={classes["col"]}>
                  <span>{user.gamesPlayed}</span>
                </div>
              </div>
            ))}

            {usersRanking.items.length < 10 &&
              Array.from({ length: 10 - usersRanking.items.length }).map((_, i) => (
                <div key={`record-placeholder-${i}`} className={classes["record-placeholder"]} />
              ))}

            <div className={classes["table-slider"]}>
              <button
                className={`${classes["slider-button"]} ${classes["down"]}`}
                onClick={() => {
                  onChangePage(-1);
                }}
              >
                <IconCreator
                  icons={symbolIcons}
                  iconName={"arrow"}
                  iconClass={classes["button-arrow"]}
                  color={greyColor.c6}
                />
              </button>

              <div className={classes["indicator"]}>
                {pageNumber} / {usersRanking.totalPages}
              </div>

              <button
                className={`${classes["slider-button"]} ${classes["up"]}`}
                onClick={() => {
                  onChangePage(1);
                }}
              >
                <IconCreator
                  icons={symbolIcons}
                  iconName={"arrow"}
                  iconClass={classes["button-arrow"]}
                  color={greyColor.c6}
                />
              </button>
            </div>
          </div>

          <div className={classes["table-option"]}>
            <div className={classes["user-options"]}>
              <div
                className={`${classes["option"]}  ${isGlobalList ? classes["active-option"] : ""}`}
                onClick={() => {
                  onSetSelectedList(true);
                }}
              >
                <IconCreator
                  icons={rankingPageIcons}
                  iconName={"global"}
                  iconClass={classes["option-icon"]}
                  color={mainColor.c5}
                />
                <span>Global</span>
              </div>

              <div
                className={`${classes["option"]}  ${!isGlobalList ? classes["active-option"] : ""}`}
                onClick={() => {
                  onSetSelectedList(false);
                }}
              >
                <IconCreator
                  icons={rankingPageIcons}
                  iconName={"friends"}
                  iconClass={classes["option-icon"]}
                  color={mainColor.c5}
                />
                <span>Friends</span>
              </div>
            </div>

            <ul className={classes["timing-options"]}>
              {timingTypeNames.map((timing, i) => (
                <li
                  key={`timing-option-${i}`}
                  className={`
                    ${classes["option"]} 
                    ${
                      selectedTiming === getEnumValueByKey(TimingType, timing.toLocaleLowerCase() as TimingTypeName)
                        ? classes["active-option"]
                        : ""
                    }
                  `}
                  onClick={() => {
                    onSetSelectedTiming(timing.toLocaleLowerCase() as TimingTypeName);
                  }}
                >
                  <IconCreator
                    icons={timingTypeIcons}
                    iconName={timing.toLocaleLowerCase() as TimingTypeName}
                    iconClass={classes["option-icon"]}
                    color={mainColor.c5}
                  />
                  <span>{timing}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TableSection;
