import { useNavigate } from "react-router-dom";
import ActionButton from "../../../shared/components/action-button/ActionButton";
import classes from "./BarSection.module.scss";
import BarSectionIcons from "./BarSectionIcons";
import { friendshipStatus } from "../../../shared/utils/enums/entitiesEnums";

type BarSectionProps = {
  setSelectedUsername: React.Dispatch<React.SetStateAction<string>>;
  selectedList: number;
  setSelectedList: React.Dispatch<React.SetStateAction<number>>;
};

let timeOut: number;
function BarSection({
  setSelectedUsername,
  selectedList,
  setSelectedList,
}: BarSectionProps) {
  const navigate = useNavigate();

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const username = target.value.toLocaleLowerCase();
    setSelectedUsername(username);
  };

  const delayAction = (func: () => void, delay: number) => {
    clearTimeout(timeOut);
    timeOut = setTimeout(func, delay);
  };

  const onSelectList = (listType: number) => {
    setSelectedList(listType);
  };

  return (
    <section className={classes.bar}>
      <div className={classes.bar__content}>
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
      </div>
    </section>
  );
}

export default BarSection;
