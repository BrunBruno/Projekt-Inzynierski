import axios from "axios";
import TimingTypesIcons from "../../../../../shared/svgs/TimingTypesIcons";
import GameHubService from "../../../../../shared/utils/services/GameHubService";
import { GetAllInvitationsDto } from "../../../../../shared/utils/types/gameDtos";
import { AcceptInvitationModel, DeclineInvitationModel } from "../../../../../shared/utils/types/gameModels";
import classes from "./InvitationCard.module.scss";
import { gameControllerPaths, getAuthorization } from "../../../../../shared/utils/services/ApiService";
import { timingTypesNames } from "../../../../../shared/utils/enums/commonConstLists";
import { usePopup } from "../../../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../../../shared/utils/functions/displayError";

type InvitationCardProps = {
  // inviation data
  invitation: GetAllInvitationsDto;
  // to refresh invitation list
  updateInvitations: () => void;
};

function InvitationCard({ invitation, updateInvitations }: InvitationCardProps) {
  ///

  const { showPopup } = usePopup();

  // to accept previous invitation
  const onAcceptInvitation = () => {
    const model: AcceptInvitationModel = {
      gameId: invitation.gameId,
      inviteeId: invitation.inviteeId,
      invitorId: invitation.invitorId,
    };

    GameHubService.AcceptInvitation(model);
  };

  // to decline previous invitations
  const onDeclineInvitation = async () => {
    try {
      const model: DeclineInvitationModel = {
        gameId: invitation.gameId,
      };

      await axios.delete(gameControllerPaths.declineInvitation(model), getAuthorization());

      updateInvitations();

      showPopup("Invitation deleted.", "success");
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  return (
    <div className={classes.invitation}>
      <div className={classes.invitation__icon}>
        <TimingTypesIcons iconClass={classes["type-icon"]} iconName={timingTypesNames[invitation.type].toLowerCase()} />
      </div>
      <div className={classes.invitation__title}>
        <span>User </span>
        <b>{invitation.invitorName}</b>
        <span> has invited you to new </span>
        <br />
        <b>{timingTypesNames[invitation.type]}</b>
        <span> game.</span>
      </div>

      <div className={classes.invitation__actions}>
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
      </div>

      <div className={classes.invitation__date}>
        <span>{new Date(invitation.createdAt).toLocaleString()}</span>
      </div>
    </div>
  );
}

export default InvitationCard;
