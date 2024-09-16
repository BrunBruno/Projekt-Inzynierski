import axios from "axios";
import classes from "./Invitations.module.scss";
import { GetAllInvitationsDto } from "../../../../shared/utils/types/gameDtos";
import { gameControllerPaths, getAuthorization } from "../../../../shared/utils/services/ApiService";
import { GetAllInvitationsModel } from "../../../../shared/utils/types/gameModels";
import { useEffect, useRef, useState } from "react";
import InvitationCard from "./invitation-card/InvitationCard";
import LoadingPage from "../../../../shared/components/loading-page/LoadingPage";
import { getErrMessage } from "../../../../shared/utils/functions/displayError";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import { PagedResult } from "../../../../shared/utils/types/abstractDtosAndModels";
import InvitationEmptyCard from "./invitation-empty-card/InvitationEmptyCard";

const defaultSize = 10;

type InvitationsProps = {};

function Invitations({}: InvitationsProps) {
  ///

  const listRef = useRef<HTMLDivElement>(null);

  const [invitations, setInvitations] = useState<PagedResult<GetAllInvitationsDto> | null>(null);
  const [pageSize, setPageSize] = useState<number>(defaultSize);

  const { showPopup } = usePopup();

  const getInvitations = async () => {
    try {
      const invitationsModel: GetAllInvitationsModel = {
        pageNumber: 1,
        pageSize: pageSize,
      };

      const invitationsResponse = await axios.get<PagedResult<GetAllInvitationsDto>>(
        gameControllerPaths.getAllInvitations(invitationsModel),
        getAuthorization()
      );

      setInvitations(invitationsResponse.data);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  const updateInvitations = () => {
    getInvitations();
  };

  useEffect(() => {
    updateInvitations();
  }, [pageSize]);

  // increase page size on scroll
  const handleListOnScroll = () => {
    const listElement = listRef.current;
    if (listElement && invitations) {
      if (listElement.scrollHeight - 1.1 * listElement.scrollTop <= listElement.clientHeight) {
        if (pageSize < invitations.totalItemsCount) {
          setPageSize((prevPageSize) => prevPageSize + defaultSize);
        }
      }
    }
  };

  return (
    <div className={classes.invitations}>
      <div className={classes.invitations__header}>
        <span>Your invitations: </span>
        {invitations && (
          <span className={classes["counter"]}>
            <span className={classes["sym"]}>(</span>
            {invitations.itemsTo}
            <span className={classes["sym"]}>/</span>
            {invitations.totalItemsCount}
            <span className={classes["sym"]}>)</span>
          </span>
        )}
      </div>

      {!invitations ? (
        <LoadingPage text="Loading invitations" />
      ) : invitations.items.length === 0 ? (
        <div className={classes.invitations__empty}>
          {Array.from({ length: pageSize }).map((_, i) => (
            <InvitationEmptyCard key={i} />
          ))}
        </div>
      ) : (
        <div
          ref={listRef}
          className={classes.invitations__list}
          onWheel={() => {
            handleListOnScroll();
          }}
        >
          {invitations.items.map((invitation, i) => (
            <InvitationCard key={i} invitation={invitation} updateInvitations={updateInvitations} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Invitations;
