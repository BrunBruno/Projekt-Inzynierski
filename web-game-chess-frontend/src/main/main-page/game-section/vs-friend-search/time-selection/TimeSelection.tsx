import { Guid } from "guid-typescript";
import ActionButton from "../../../../../shared/components/action-button/ActionButton";
import { GetAllFriendsByStatusDto } from "../../../../../shared/utils/types/friendshipDtos";
import { GetByEmailDto } from "../../../../../shared/utils/types/userDtos";
import classes from "./TimeSelection.module.scss";
import { defaultTimeControls, TimeControl } from "./TimeSelectionData";
import IconCreator from "../../../../../shared/components/icon-creator/IconCreator";
import { mainColor } from "../../../../../shared/utils/enums/colorMaps";
import { timingTypesIcons } from "../../../../../shared/svgs/iconsMap/TimingTypesIcons";

type TimeSelectionProps = {
  // user data when friend selected manually
  selectedFriend: GetAllFriendsByStatusDto | null;
  // user data when friend selected by email
  selectedUser: GetByEmailDto | null;
  // if url should be displayed
  selectedByUrl: boolean;
  // to unselect friend
  setSelectedFriend: React.Dispatch<React.SetStateAction<GetAllFriendsByStatusDto | null>>;
  // to unselect friend
  setSelectedUser: React.Dispatch<React.SetStateAction<GetByEmailDto | null>>;
  // to unselect url option
  setSelectedByUrl: React.Dispatch<React.SetStateAction<boolean>>;
  // to invite to private game via click
  onInviteBySelection: (friendshipId: Guid, header: string, values: number[]) => void;
  // to invite to private game by email
  onInviteByEmail: (email: string, header: string, values: number[]) => void;
  // to invite to private game by url
  onInviteByUrl: (header: string, values: number[]) => void;
};

function TimeSelection({
  selectedFriend,
  selectedUser,
  selectedByUrl,
  setSelectedFriend,
  setSelectedUser,
  setSelectedByUrl,
  onInviteBySelection,
  onInviteByEmail,
  onInviteByUrl,
}: TimeSelectionProps) {
  ///

  // to invite user base on selection
  const onInvite = (control: TimeControl, index: number) => {
    if (selectedFriend !== null) {
      onInviteBySelection(selectedFriend.friendshipId, control.header, control.values[index]);
    }

    if (selectedUser !== null) {
      onInviteByEmail(selectedUser.email, control.header, control.values[index]);
    }

    if (selectedByUrl !== false) {
      onInviteByUrl(control.header, control.values[index]);
    }

    clearSelections();
  };

  const clearSelections = () => {
    setSelectedFriend(null);
    setSelectedUser(null);
    setSelectedByUrl(false);
  };
  //*/

  // to display timing type tag
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
  //*/

  return (
    <div className={classes.time}>
      {defaultTimeControls.map((control, index) => (
        <div key={index} className={classes.time__row}>
          <div className={classes.time__row__header}>
            <IconCreator
              icons={timingTypesIcons}
              iconName={control.header.toLocaleLowerCase()}
              iconClass={classes["header-icon"]}
              color={mainColor.c5}
            />
            <span>{control.header}</span>
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
