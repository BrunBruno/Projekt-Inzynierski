import { useNavigate } from "react-router-dom";
import ActionButton from "../../../shared/components/action-button/ActionButton";
import classes from "./BarSection.module.scss";
import { FriendshipStatus } from "../../../shared/utils/objects/entitiesEnums";
import { delayAction } from "../../../shared/utils/functions/events";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { barSectionIcons } from "./BarSectionIcons";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

type BarSectionProps = {
  // to provide username to filters users
  setSelectedUsername: Dispatch<SetStateAction<string>>;
  // type of selected list
  selectedList: number;
  // to select list based on friendship status
  setSelectedList: Dispatch<SetStateAction<number>>;
};

function BarSection({ setSelectedUsername, selectedList, setSelectedList }: BarSectionProps) {
  ///

  const navigate = useNavigate();

  // to filter friends by username
  const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const username = target.value.toLocaleLowerCase();
    setSelectedUsername(username);
  };
  //*/

  // to change displayed list
  const onSelectList = (listType: number) => {
    setSelectedList(listType);
  };
  //*/

  return (
    <section className={classes.bar}>
      <div className={classes.bar__content}>
        {/* list options */}
        <div className={classes.bar__content__intro}>
          <div className={classes.panel}>
            <div
              data-testid="users-page-select-list-button-all"
              className={`
                ${classes.option} 
                ${selectedList === FriendshipStatus.all ? classes.active : ""}`}
              onClick={() => {
                onSelectList(FriendshipStatus.all);
              }}
            >
              <IconCreator icons={barSectionIcons} iconName={"all"} />
            </div>
            <div
              data-testid="users-page-select-list-button-accepted"
              className={`
                ${classes.option} 
                ${selectedList === FriendshipStatus.accepted ? classes.active : ""}`}
              onClick={() => {
                onSelectList(FriendshipStatus.accepted);
              }}
            >
              <IconCreator icons={barSectionIcons} iconName={"accepted"} />
            </div>
            <div
              data-testid="users-page-select-list-button-pending"
              className={`
                ${classes.option} 
                ${selectedList === FriendshipStatus.pending ? classes.active : ""}`}
              onClick={() => {
                onSelectList(FriendshipStatus.pending);
              }}
            >
              <IconCreator icons={barSectionIcons} iconName={"pending"} />
            </div>
            <div
              data-testid="users-page-select-list-button-rejected"
              className={`
                ${classes.option} 
                ${selectedList === FriendshipStatus.rejected ? classes.active : ""}`}
              onClick={() => {
                onSelectList(FriendshipStatus.rejected);
              }}
            >
              <IconCreator icons={barSectionIcons} iconName={"rejected"} />
            </div>
          </div>
        </div>
        {/* --- */}

        {/* search panel */}
        <div className={classes.bar__content__search}>
          <input
            type="text"
            className={classes["search-input"]}
            placeholder="Enter user name ..."
            onChange={(event) => {
              delayAction(() => {
                onSearch(event);
              }, 200);
            }}
          />
        </div>
        {/* --- */}

        {/* return button */}
        <div className={classes.bar__content__outro}>
          <div
            className={classes["action-button"]}
            onClick={() => {
              navigate("/main");
            }}
          >
            <ActionButton text="Home page" />
          </div>
        </div>
        {/* --- */}
      </div>
    </section>
  );
}

export default BarSection;
