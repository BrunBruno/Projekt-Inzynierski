import ActionButton from "../../../../../shared/components/action-button/ActionButton";
import { GetAllFriendsByStatusDto } from "../../../../../shared/utils/types/friendshipDtos";
import classes from "./TimeSelection.module.scss";
import { defaultTimeControls } from "./TimeSelectionObjects";

type TimeSelectionProps = {
  selectedFriend: GetAllFriendsByStatusDto;
  setSelectedFriend: React.Dispatch<
    React.SetStateAction<GetAllFriendsByStatusDto | null>
  >;
  onInviteFriendToGame: (
    friendshipId: string,
    header: string,
    values: number[]
  ) => Promise<void>;
};

function TimeSelection({
  selectedFriend,
  setSelectedFriend,
  onInviteFriendToGame,
}: TimeSelectionProps) {
  return (
    <div className={classes.time}>
      {defaultTimeControls.map((control, index) => (
        <div key={index} className={classes.time__row}>
          <div className={classes.time__row__header}>
            {/* <TimingTypesIcons
                iconName={control.header.toLocaleLowerCase()}
                iconClass={classes["header-icon"]}
              /> */}
            {control.header}
          </div>
          {control.tags.map((tag, i) => (
            <div
              key={i}
              className={classes.time__row__block}
              onClick={() => {
                onInviteFriendToGame(
                  selectedFriend.freindshpId,
                  control.header,
                  control.values[i]
                );
              }}
            >
              {/* {transformTag(tag)} */}
              {tag}
            </div>
          ))}
        </div>
      ))}

      <div
        className={classes.time__cancel}
        onClick={() => {
          setSelectedFriend(null);
        }}
      >
        <ActionButton text="Cancel" />
      </div>
    </div>
  );
}

export default TimeSelection;
