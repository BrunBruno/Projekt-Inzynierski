import GameHubService from "../../../../../shared/utils/services/GameHubService";
import { GetAllInvitationsDto } from "../../../../../shared/utils/types/gameDtos";
import { AcceptInvitationModel, DeclineInvitationModel } from "../../../../../shared/utils/types/gameModels";
import classes from "./InvitationCard.module.scss";
import { timingTypesNames } from "../../../../../shared/utils/enums/commonConstLists";
import { usePopup } from "../../../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../../../shared/utils/functions/displayError";
import IconCreator from "../../../../../shared/components/icon-creator/IconCreator";
import { timingTypesIcons } from "../../../../../shared/svgs/TimingTypesIcons";
import { mainColor } from "../../../../../shared/utils/enums/colorMaps";
import { timeSpanLongerThan } from "../../../../../shared/utils/functions/dateTimeRelated";

type InvitationCardProps = {
  // invitation data
  invitation: GetAllInvitationsDto;
  // to refresh invitation list
  updateInvitations: () => void;
};

function InvitationCard({ invitation, updateInvitations }: InvitationCardProps) {
  ///

  const { showPopup } = usePopup();

  // to accept previous invitation
  const onAcceptInvitation = async (): Promise<void> => {
    if (!invitation) return;

    try {
      const model: AcceptInvitationModel = {
        gameId: invitation.gameId,
        inviteeId: invitation.inviteeId,
        inviterId: invitation.inviterId,
      };

      await GameHubService.AcceptInvitation(model);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };
  //*/

  // to decline previous invitations
  const onDeclineInvitation = async (): Promise<void> => {
    try {
      const model: DeclineInvitationModel = {
        gameId: invitation.gameId,
        friendId: invitation.inviterId,
      };

      await GameHubService.DeclineInvitation(model);

      updateInvitations();

      showPopup("Invitation deleted.", "success");
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };
  //*/

  return (
    <div className={classes.invitation}>
      <div className={classes.invitation__icon}>
        <IconCreator
          icons={timingTypesIcons}
          iconName={timingTypesNames[invitation.type].toLowerCase()}
          color={mainColor.c5}
        />
      </div>
      <div className={classes.invitation__title}>
        <span>User </span>
        <b>{invitation.inviterName}</b>
        <span> has invited you to new </span>
        <br />
        <b>{timingTypesNames[invitation.type]}</b>
        <span> game.</span>
      </div>

      <div className={classes.invitation__actions}>
        {timeSpanLongerThan(new Date(invitation.createdAt), new Date(), 60 * 60 * 24) ? (
          <p className={classes["inv-expired"]}>Expired...</p>
        ) : (
          <>
            <button
              className={classes["inv-button"]}
              onClick={() => {
                onAcceptInvitation();
              }}
            >
              Accept
            </button>
            <button
              className={classes["inv-button"]}
              onClick={() => {
                onDeclineInvitation();
              }}
            >
              Decline
            </button>
          </>
        )}
      </div>

      <div className={classes.invitation__date}>
        <span>{new Date(invitation.createdAt).toLocaleString()}</span>
      </div>
    </div>
  );
}

export default InvitationCard;
