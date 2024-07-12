import ActionButton from "../../../../../shared/components/action-button/ActionButton";
import TimingTypesIcons from "../../../../../shared/svgs/TimingTypesIcons";
import { GetAllFriendsByStatusDto } from "../../../../../shared/utils/types/friendshipDtos";
import { GetByEmailDto } from "../../../../../shared/utils/types/userDtos";
import classes from "./TimeSelection.module.scss";
import { defaultTimeControls, TimeControl } from "./TimeSelectionObjects";

type TimeSelectionProps = {
  selectedFriend: GetAllFriendsByStatusDto | null;
  selectedUser: GetByEmailDto | null;
  setSelectedFriend: React.Dispatch<
    React.SetStateAction<GetAllFriendsByStatusDto | null>
  >;
  setSelectedUser: React.Dispatch<React.SetStateAction<GetByEmailDto | null>>;
  onInviteFriendToGame: (
    friendshipId: string,
    header: string,
    values: number[]
  ) => Promise<void>;
  onInviteByEmail: (
    email: string,
    header: string,
    values: number[]
  ) => Promise<void>;
};

function TimeSelection({
  selectedFriend,
  selectedUser,
  setSelectedFriend,
  setSelectedUser,
  onInviteFriendToGame,
  onInviteByEmail,
}: TimeSelectionProps) {
  const onInvite = (control: TimeControl, index: number) => {
    if (selectedFriend !== null) {
      onInviteFriendToGame(
        selectedFriend.freindshpId,
        control.header,
        control.values[index]
      );
    }

    if (selectedUser !== null) {
      onInviteByEmail(
        selectedUser.email,
        control.header,
        control.values[index]
      );
    }
  };

  const clearSelections = () => {
    setSelectedFriend(null);
    setSelectedUser(null);
  };

  const transformTag = (tag: string): JSX.Element => {
    const transformedTag: JSX.Element[] = [];

    for (let i = 0; i < tag.length; i++) {
      const char = tag[i];
      if (char === "|") {
        transformedTag.push(
          <p key={`tag${i}`} className={classes.sep}>
            {char}
          </p>
        );
      } else if (!isNaN(parseInt(char))) {
        transformedTag.push(
          <p key={`tag${i}`} className={classes.num}>
            {char}
          </p>
        );
      } else {
        transformedTag.push(
          <p key={`tag${i}`} className={classes.char}>
            {char}
          </p>
        );
      }
    }

    return <div className={classes["timing-tag"]}>{transformedTag}</div>;
  };

  return (
    <div className={classes.time}>
      {defaultTimeControls.map((control, index) => (
        <div key={index} className={classes.time__row}>
          <div className={classes.time__row__header}>
            <TimingTypesIcons
              iconName={control.header.toLocaleLowerCase()}
              iconClass={classes["header-icon"]}
            />
            {control.header}
          </div>
          {control.tags.map((tag, i) => (
            <div
              key={i}
              className={classes.time__row__block}
              onClick={() => {
                onInvite(control, i);
              }}
            >
              {transformTag(tag)}
            </div>
          ))}
        </div>
      ))}

      <div
        className={classes.time__cancel}
        onClick={() => {
          clearSelections();
        }}
      >
        <ActionButton text="Cancel" />
      </div>
    </div>
  );
}

export default TimeSelection;
