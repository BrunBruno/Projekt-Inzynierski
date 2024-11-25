import GameHubService from "../../../../shared/utils/services/GameHubService";
import { GetAllInvitationsDto } from "../../../../shared/utils/types/webGameDtos";
import { AcceptInvitationModel, DeclineInvitationModel } from "../../../../shared/utils/types/webGameModels";
import classes from "./InvitationCard.module.scss";
import { TimingTypeName, timingTypeNames } from "../../../../shared/utils/objects/constantLists";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../../shared/utils/functions/errors";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { mainColor } from "../../../../shared/utils/objects/colorMaps";
import { timingTypeIcons } from "../../../../shared/svgs/iconsMap/TimingTypeIcons";
import { timeSpanLongerThan } from "../../../../shared/utils/functions/datetime";
import { UpdateInvitations } from "../InvitationsData";

type InvitationCardProps = {
  // invitation data
  invitation: GetAllInvitationsDto;
  // to refresh invitation list
  updateInvitations: UpdateInvitations;
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

  return (
    <div className={classes.card}>
      <div className={classes.card__icon}>
        <IconCreator
          icons={timingTypeIcons}
          iconName={timingTypeNames[invitation.type - 1].toLowerCase() as TimingTypeName}
          color={mainColor.c5}
        />
      </div>

      <div className={classes.card__title}>
        <span>User </span>
        <b className={classes["imp-data"]}>{invitation.inviterName}</b>
        <span> has invited you to new </span>
        <br />
        <b className={classes["imp-data"]}>{timingTypeNames[invitation.type - 1]}</b>
        <span> game.</span>
      </div>

      {/* actions */}
      <div className={classes.card__actions}>
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
              <span>Accept</span>
            </button>
            <button
              className={classes["inv-button"]}
              onClick={() => {
                onDeclineInvitation();
              }}
            >
              <span>Decline</span>
            </button>
          </>
        )}
      </div>

      <div className={classes.card__date}>
        <span>{new Date(invitation.createdAt).toLocaleString()}</span>
      </div>
    </div>
  );
}

export default InvitationCard;
