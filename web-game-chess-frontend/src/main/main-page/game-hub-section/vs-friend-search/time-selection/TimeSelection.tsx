import { Guid } from "guid-typescript";
import ActionButton from "../../../../../shared/components/action-button/ActionButton";
import { GetAllFriendsByStatusDto } from "../../../../../shared/utils/types/friendshipDtos";
import { GetByEmailDto } from "../../../../../shared/utils/types/userDtos";
import classes from "./TimeSelection.module.scss";
import IconCreator from "../../../../../shared/components/icon-creator/IconCreator";
import { mainColor } from "../../../../../shared/utils/objects/colorMaps";
import { timingTypeIcons } from "../../../../../shared/svgs/iconsMap/TimingTypeIcons";
import { TimingTypeName } from "../../../../../shared/utils/objects/constantLists";
import { Dispatch, SetStateAction } from "react";
import { defaultTimeControls, TimeControl } from "../../../../../shared/utils/objects/gameTimingMaps";
import { displayFromLowercase } from "../../../../../shared/utils/functions/enums";

type TimeSelectionProps = {
  // user data when friend selected manually
  selectedFriend: GetAllFriendsByStatusDto | null;
  // user data when friend selected by email
  selectedUser: GetByEmailDto | null;
  // if url should be displayed
  selectedByUrl: boolean;
  // to unselect friend
  setSelectedFriend: Dispatch<SetStateAction<GetAllFriendsByStatusDto | null>>;
  // to unselect friend
  setSelectedUser: Dispatch<SetStateAction<GetByEmailDto | null>>;
  // to unselect url option
  setSelectedByUrl: Dispatch<SetStateAction<boolean>>;
  // to invite to private game via click
  onInviteBySelection: (friendshipId: Guid, header: TimingTypeName, values: [number, number]) => void;
  // to invite to private game by email
  onInviteByEmail: (email: string, header: TimingTypeName, values: [number, number]) => void;
  // to invite to private game by url
  onInviteByUrl: (header: TimingTypeName, values: [number, number]) => void;
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
  const onInvite = (control: TimeControl, index: number): void => {
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

  const clearSelections = (): void => {
    setSelectedFriend(null);
    setSelectedUser(null);
    setSelectedByUrl(false);
  };
  //*/

  // to display timing type name and tag
  const transformTimingTag = (tag: string): JSX.Element => {
    const transformedTag: JSX.Element[] = [];

    for (let i = 0; i < tag.length; i++) {
      const char = tag[i];
      if (char === "|") {
        transformedTag.push(
          <p key={`${tag}-tag-${i}`} className={classes.sep}>
            {char}
          </p>
        );
      } else if (!isNaN(parseInt(char))) {
        transformedTag.push(
          <p key={`${tag}-tag-${i}`} className={classes.num}>
            {char}
          </p>
        );
      } else {
        transformedTag.push(
          <p key={`${tag}-tag-${i}`} className={classes.char}>
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
      {defaultTimeControls.map((control: TimeControl, index: number) => (
        <div key={`time-control-line-${index}`} className={classes.time__row}>
          <div className={classes.time__row__header}>
            <IconCreator
              icons={timingTypeIcons}
              iconName={control.header.toLocaleLowerCase() as TimingTypeName}
              iconClass={classes["header-icon"]}
              color={mainColor.c5}
            />
            <span>{displayFromLowercase(control.header)}</span>
          </div>
          {control.tags.map((tag: string, i: number) => (
            <div
              key={`time-control-option-${index}-${i}`}
              data-testid={`time-control-option-${index}-${i}`}
              className={classes.time__row__block}
              onClick={() => {
                onInvite(control, i);
              }}
            >
              {transformTimingTag(tag)}
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
