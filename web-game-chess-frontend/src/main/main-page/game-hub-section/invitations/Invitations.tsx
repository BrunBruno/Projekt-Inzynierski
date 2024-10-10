import axios from "axios";
import classes from "./Invitations.module.scss";
import { GetAllInvitationsDto } from "../../../../shared/utils/types/gameDtos";
import { gameController, getAuthorization } from "../../../../shared/utils/services/ApiService";
import { GetAllInvitationsModel } from "../../../../shared/utils/types/gameModels";
import { useEffect, useRef, useState } from "react";
import InvitationCard from "./invitation-card/InvitationCard";
import LoadingPage from "../../../../shared/components/loading-page/LoadingPage";
import { getErrMessage } from "../../../../shared/utils/functions/errors";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import { PagedResult } from "../../../../shared/utils/types/abstractDtosAndModels";
import InvitationEmptyCard from "./invitation-empty-card/InvitationEmptyCard";
import InvitationsFilters from "./invitations-filters/InvitationsFilters";
import GameHubService from "../../../../shared/utils/services/GameHubService";
import { HubConnectionState } from "@microsoft/signalr";

const defaultSize = 10;

type InvitationsProps = {};

function Invitations({}: InvitationsProps) {
  ///

  const listRef = useRef<HTMLDivElement>(null);

  const [invitations, setInvitations] = useState<PagedResult<GetAllInvitationsDto> | null>(null);
  const [pageSize, setPageSize] = useState<number>(defaultSize);

  // for filtering results
  const [showFilters, setShowFilters] = useState<boolean>(false);
  // for setting up filters by expiration status
  const [expirationFilters, setExpirationFilters] = useState<boolean | null>(null);

  const { showPopup } = usePopup();

  // to get all awaiting and expired invitations
  const getInvitations = async () => {
    try {
      const invitationsModel: GetAllInvitationsModel = {
        pageNumber: 1,
        pageSize: pageSize,
      };

      const invitationsResponse = await axios.get<PagedResult<GetAllInvitationsDto>>(
        gameController.getAllInvitations(invitationsModel),
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
  //*/

  // to update invitation when new one was recently received
  useEffect(() => {
    if (GameHubService.connection && GameHubService.connection.state === HubConnectionState.Connected) {
      GameHubService.connection.on("InvitedToGame", updateInvitations);
    }

    return () => {
      if (GameHubService.connection && GameHubService.connection.state === HubConnectionState.Connected) {
        GameHubService.connection.off("InvitedToGame", updateInvitations);
      }
    };
  }, []);
  //*/

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
  //*/

  // to display filters
  const onShowFilters = () => {
    if (invitations && invitations.items.length > 0) {
      setShowFilters((prev) => !prev);
    }
  };
  //*/

  return (
    <div className={classes.invitations}>
      <div className={classes.invitations__header}>
        <h2 className={classes["header-title"]}>
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
        </h2>

        <div className={classes.filters}>
          <button
            className={`
                ${classes["filter-button"]} 
                ${!invitations || invitations.items.length === 0 ? classes["disabled"] : classes["enabled"]}
              `}
            onClick={() => {
              onShowFilters();
            }}
          >
            Filters
          </button>
        </div>
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

      {showFilters && (
        <InvitationsFilters expirationFilters={expirationFilters} setExpirationFilters={setExpirationFilters} />
      )}
    </div>
  );
}

export default Invitations;
