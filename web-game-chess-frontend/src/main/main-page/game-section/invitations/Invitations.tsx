import axios from "axios";
import classes from "./Invitations.module.scss";
import { PagedResult } from "../../../../shared/utils/types/commonTypes";
import { GetAllInvitationsDto } from "../../../../shared/utils/types/gameDtos";
import { gameControllerPaths, getAuthorization } from "../../../../shared/utils/functions/apiFunctions";
import { GetAllInvitationsModel } from "../../../../shared/utils/types/gameModels";
import { useEffect, useRef, useState } from "react";
import InvitationCard from "./invitation-card/InvitationCard";
import LoadingPage from "../../../../shared/components/loading-page/LoadingPage";
import { getErrMessage } from "../../../../shared/utils/functions/displayError";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";

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

  // icrease page size on scroll
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

  if (!invitations) return <LoadingPage text="Loading invitations" />;

  return (
    <div className={classes.invitations}>
      <div className={classes.invitations__header}>
        Your invitations ({invitations.itemsTo}/{invitations.totalItemsCount}
        ):
      </div>
      <div
        ref={listRef}
        className={classes.invitations__cards}
        onWheel={() => {
          handleListOnScroll();
        }}
      >
        {invitations.items.map((invitation, i) => (
          <InvitationCard key={i} invitation={invitation} updateInvitations={updateInvitations} />
        ))}
      </div>
    </div>
  );
}

export default Invitations;
