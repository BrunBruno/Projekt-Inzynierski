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
import usePagination from "../../../../shared/utils/hooks/usePagination";

type InvitationsProps = {};

function Invitations({}: InvitationsProps) {
  ///

  const { showPopup } = usePopup();
  const { pageNumber, pageSize, setDefPageSize } = usePagination();

  // list of invitations ref
  const listRef = useRef<HTMLDivElement>(null);

  // all users invitation
  const [invitations, setInvitations] = useState<PagedResult<GetAllInvitationsDto> | null>(null);
  // for pagination
  // const [pageSize, setPageSize] = useState<number>(defaultSize);

  // for filtering results
  const [showFilters, setShowFilters] = useState<boolean>(false);
  // for setting up filters by expiration status
  const [expirationFilters, setExpirationFilters] = useState<boolean[]>([]);

  useEffect(() => {
    setDefPageSize(10);
  }, []);

  // to get all awaiting and expired invitations
  const getInvitations = async (): Promise<void> => {
    try {
      const invitationsModel: GetAllInvitationsModel = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        expirationFilters: expirationFilters,
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

  const updateInvitations = (): void => {
    getInvitations();
  };

  useEffect(() => {
    updateInvitations();
  }, [pageSize, pageNumber, expirationFilters]);
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
  const handleListOnScroll = (): void => {
    const defaultSize = 10;

    const listElement = listRef.current;
    if (listElement && invitations) {
      if (listElement.scrollHeight - 1.1 * listElement.scrollTop <= listElement.clientHeight) {
        if (pageSize < invitations.totalItemsCount) {
          setDefPageSize((prevPageSize: number) => prevPageSize + defaultSize);
        }
      }
    }
  };
  //*/

  // to display filters
  const onShowFilters = (): void => {
    if (invitations && invitations.items.length > 0) {
      setShowFilters((prev: boolean) => !prev);
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
            <span>Filters</span>
          </button>
        </div>
      </div>

      {!invitations ? (
        <LoadingPage text="Loading invitations" />
      ) : invitations.items.length === 0 ? (
        <div className={classes.invitations__empty}>
          {Array.from({ length: pageSize }).map((_, i: number) => (
            <InvitationEmptyCard key={`empty-invitation-card-${i}`} index={i} />
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
          {invitations.items.map((invitation: GetAllInvitationsDto, i: number) => (
            <InvitationCard key={`invitation-${i}`} invitation={invitation} updateInvitations={updateInvitations} />
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
