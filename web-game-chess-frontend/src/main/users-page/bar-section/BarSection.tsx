import { useNavigate } from "react-router-dom";
import ActionButton from "../../../shared/components/action-button/ActionButton";
import classes from "./BarSection.module.scss";
import BarSectionIcons from "./BarSectionIcons";
import { friendshipStatus } from "../../../shared/utils/enums/entitiesEnums";
import { delayAction } from "../../../shared/utils/functions/eventsRelated";

type BarSectionProps = {
  // to provide username to filters users
  setSelectedUsername: React.Dispatch<React.SetStateAction<string>>;
  // type of selected list
  selectedList: number;
  // to select list based on friendship status
  setSelectedList: React.Dispatch<React.SetStateAction<number>>;
};

function BarSection({ setSelectedUsername, selectedList, setSelectedList }: BarSectionProps) {
  ///

  const navigate = useNavigate();

  // to filter friends by username
  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
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
              className={`
                ${classes.option} 
                ${selectedList === friendshipStatus.all ? classes.active : ""}`}
              onClick={() => {
                onSelectList(friendshipStatus.all);
              }}
            >
              <BarSectionIcons iconName="all" />
            </div>
            <div
              className={`
                ${classes.option} 
                ${selectedList === friendshipStatus.accepted ? classes.active : ""}`}
              onClick={() => {
                onSelectList(friendshipStatus.accepted);
              }}
            >
              <BarSectionIcons iconName="accepted" />
            </div>
            <div
              className={`
                ${classes.option} 
                ${selectedList === friendshipStatus.pending ? classes.active : ""}`}
              onClick={() => {
                onSelectList(friendshipStatus.pending);
              }}
            >
              <BarSectionIcons iconName="pending" />
            </div>
            <div
              className={`
                ${classes.option} 
                ${selectedList === friendshipStatus.rejected ? classes.active : ""}`}
              onClick={() => {
                onSelectList(friendshipStatus.rejected);
              }}
            >
              <BarSectionIcons iconName="rejected" />
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
