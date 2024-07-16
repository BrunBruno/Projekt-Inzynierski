import axios from "axios";
import TimingTypesIcons from "../../../../../shared/svgs/TimingTypesIcons";
import { timingTypesNames } from "../../../../../shared/utils/enums/entitiesEnums";
import GameHubService from "../../../../../shared/utils/services/GameHubService";
import { GetAllInvitationsDto } from "../../../../../shared/utils/types/gameDtos";
import {
  AcceptInvitationModel,
  DeclineInvitationModel,
} from "../../../../../shared/utils/types/gameModels";
import classes from "./InvitationCard.module.scss";
import {
  gameControllerPaths,
  getAuthorization,
} from "../../../../../shared/utils/functions/apiFunctions";

type InvitationCardProps = {
  invitation: GetAllInvitationsDto;
  updateInvitations: () => void;
};

function InvitationCard({
  invitation,
  updateInvitations,
}: InvitationCardProps) {
  ///

  const onAcceptInvitation = () => {
    const model: AcceptInvitationModel = {
      gameId: invitation.gameId,
      inviteeId: invitation.inviteeId,
      invitorId: invitation.invitorId,
    };

    GameHubService.AcceptInvitation(model);
  };

  const onDeclineInvitation = async () => {
    try {
      const model: DeclineInvitationModel = {
        gameId: invitation.gameId,
      };

      await axios.delete(
        gameControllerPaths.declineInvitation(model),
        getAuthorization()
      );

      updateInvitations();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={classes.invitation}>
      <div className={classes.invitation__icon}>
        <TimingTypesIcons
          iconClass={classes["type-icon"]}
          iconName={timingTypesNames[invitation.type].toLowerCase()}
        />
      </div>
      <div className={classes.invitation__title}>
        <span>User </span>
        <b>{invitation.invitorName}</b>
        <span> has invited you to new </span>
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
