import { useEffect, useState } from "react";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import AvatarIcon from "../../../shared/svgs/icons/AvatarIcon";
import { timingTypeIcons } from "../../../shared/svgs/iconsMap/TimingTypeIcons";
import { mainColor } from "../../../shared/utils/objects/colorMaps";
import { TimingTypeName, timingTypeNames } from "../../../shared/utils/objects/constantLists";
import { rankingPageIcons } from "../RankingPageIcons";
import classes from "./TableSection.module.scss";
import axios from "axios";
import { getAuthorization, userController } from "../../../shared/utils/services/ApiService";
import { GetUsersRankingModel } from "../../../shared/utils/types/userModels";
import { TimingType } from "../../../shared/utils/objects/entitiesEnums";
import { PagedResult } from "../../../shared/utils/types/abstractDtosAndModels";
import { GetUserRankingDto } from "../../../shared/utils/types/userDtos";
import LoadingPage from "../../../shared/components/loading-page/LoadingPage";

type TableSectionProps = {};

function TableSection({}: TableSectionProps) {
  ///

  const [usersRanking, setUsersRanking] = useState<PagedResult<GetUserRankingDto> | null>(null);

  const getRating = async () => {
    const model: GetUsersRankingModel = {
      pageNumber: 1,
      pageSize: 10,
      type: TimingType.rapid,
      global: true,
    };
    try {
      const response = await axios.get<PagedResult<GetUserRankingDto>>(
        userController.getUsersRanking(model),
        getAuthorization()
      );

      setUsersRanking(response.data);
    } catch (err) {}
  };

  useEffect(() => {
    getRating();
  }, []);

  if (!usersRanking) return <LoadingPage />;

  return (
    <section className={classes.table}>
      <div className={classes["bg-decorator"]}>
        <IconCreator icons={rankingPageIcons} iconName={"background"} iconClass={classes["bg-icon"]} color={"#000"} />
      </div>
      <div className={classes["bg-decorator"]}>
        <IconCreator icons={rankingPageIcons} iconName={"background"} iconClass={classes["bg-icon"]} color={"#000"} />
      </div>

      <div className={classes.table__content}>
        <div className={classes.table__content__data}>
          <div className={classes["banner"]}>
            <div className={classes["decor"]} />
            <div className={classes["decor"]} />
            <h1 className={classes["title"]}>
              <span>TOP USERS</span>
            </h1>
          </div>

          <div className={classes["record-list"]}>
            <div className={classes["table-header"]}>
              <p className={classes["p-column"]}>No.</p>
              <p className={classes["p-column"]}></p>
              <p className={classes["p-column"]}>Username</p>
              <p className={classes["p-column"]}>Elo</p>
              <p className={classes["p-column"]}>Games</p>
              <p className={classes["p-column"]}>Ratio</p>
            </div>

            {usersRanking.items.map((user, i) => (
              <div key={`table-record-${i}`} className={classes["table-record"]}>
                <p>
                  <span>#{user.position}.</span>
                </p>
                <p>
                  <AvatarIcon iconClass={classes.avatar} />
                </p>
                <p>
                  <span>{user.username}</span>
                </p>
                <p>
                  <span>{user.elo}</span>
                </p>
                <p>
                  <span>{user.gamesPlayed}</span>
                </p>
                <p>
                  <span>{user.ratio}</span>
                </p>
              </div>
            ))}

            <div className={classes["table-slider"]}>slider</div>
          </div>

          <div className={classes["table-option"]}>
            <div className={classes["user-options"]}>
              <div className={classes["option"]}>
                <IconCreator
                  icons={rankingPageIcons}
                  iconName={"global"}
                  iconClass={classes["option-icon"]}
                  color={mainColor.c5}
                />
                <span>Global</span>
              </div>
              <div className={classes["option"]}>
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
              {timingTypeNames.map((timing) => (
                <li className={classes["option"]}>
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
