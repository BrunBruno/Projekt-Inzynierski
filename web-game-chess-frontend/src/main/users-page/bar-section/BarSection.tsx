import classes from "./BarSection.module.scss";
import { FriendshipStatus } from "../../../shared/utils/objects/entitiesEnums";
import { delayAction } from "../../../shared/utils/functions/events";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { userPageIcons } from "../UsersPageIcons";
import { symbolIcons } from "../../../shared/svgs/iconsMap/SymbolIcons";
import { greyColor } from "../../../shared/utils/objects/colorMaps";

type BarSectionProps = {
  // to provide username to filters users
  setSelectedUsername: Dispatch<SetStateAction<string>>;
  // type of selected list
  selectedList: FriendshipStatus;
  // to select list based on friendship status
  setSelectedList: Dispatch<SetStateAction<FriendshipStatus>>;
};

function BarSection({ setSelectedUsername, selectedList, setSelectedList }: BarSectionProps) {
  ///

  // to filter friends by username
  const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const username = target.value.toLocaleLowerCase();
    setSelectedUsername(username);
  };

  // to change displayed list
  const onSelectList = (listType: FriendshipStatus) => {
    setSelectedList(listType);
  };

  const renderTitle = (): string => {
    switch (selectedList) {
      case FriendshipStatus.all:
        return "Users";
      case FriendshipStatus.accepted:
        return "Friends";
      case FriendshipStatus.pending:
        return "Pending";
      case FriendshipStatus.rejected:
        return "Blocked";
      default:
        return "";
    }
  };

  return (
    <section className={classes.bar}>
      <div className={classes.bar__content}>
        {/*  */}
        <div className={classes.bar__content__intro}>
          <h2 className={classes["selected-list"]}>{renderTitle()}</h2>
        </div>
        {/*  */}

        {/* search panel */}
        <div className={classes.bar__content__search}>
          <p className={classes["search-tag"]}>Filter users:</p>
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

        {/* list options */}
        <div className={classes.bar__content__options}>
          <div
            data-testid="users-page-select-list-button-all"
            className={`
              ${classes.option} 
              ${selectedList === FriendshipStatus.all ? classes.active : ""}
            `}
            onClick={() => {
              onSelectList(FriendshipStatus.all);
            }}
          >
            <IconCreator icons={userPageIcons} iconName={"add"} iconClass={classes["panel-svg"]} />
            <span>All users</span>
            <IconCreator icons={symbolIcons} iconName="arrow" iconClass={classes["panel-arrow"]} color={greyColor.c7} />
          </div>
          <div
            data-testid="users-page-select-list-button-accepted"
            className={`
              ${classes.option} 
              ${selectedList === FriendshipStatus.accepted ? classes.active : ""}
            `}
            onClick={() => {
              onSelectList(FriendshipStatus.accepted);
            }}
          >
            <IconCreator icons={userPageIcons} iconName={"love"} iconClass={classes["panel-svg"]} />
            <span>Your friends</span>
            <IconCreator icons={symbolIcons} iconName="arrow" iconClass={classes["panel-arrow"]} color={greyColor.c7} />
          </div>

          <div
            data-testid="users-page-select-list-button-pending"
            className={`
              ${classes.option} 
              ${selectedList === FriendshipStatus.pending ? classes.active : ""}
            `}
            onClick={() => {
              onSelectList(FriendshipStatus.pending);
            }}
          >
            <IconCreator icons={userPageIcons} iconName={"pending"} iconClass={classes["panel-svg"]} />
            <span>Pending requests</span>
            <IconCreator icons={symbolIcons} iconName="arrow" iconClass={classes["panel-arrow"]} color={greyColor.c7} />
          </div>

          <div
            data-testid="users-page-select-list-button-rejected"
            className={`
              ${classes.option} 
              ${selectedList === FriendshipStatus.rejected ? classes.active : ""}
            `}
            onClick={() => {
              onSelectList(FriendshipStatus.rejected);
            }}
          >
            <IconCreator icons={userPageIcons} iconName={"decline"} iconClass={classes["panel-svg"]} />
            <span>Declined friendships</span>
            <IconCreator icons={symbolIcons} iconName="arrow" iconClass={classes["panel-arrow"]} color={greyColor.c7} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default BarSection;
