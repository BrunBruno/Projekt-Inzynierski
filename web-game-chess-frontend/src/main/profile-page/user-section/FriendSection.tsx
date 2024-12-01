import { useEffect, useState } from "react";
import classes from "./FriendSection.module.scss";
import LoadingPage from "../../../shared/components/loading-page/LoadingPage";
import axios from "axios";
import { friendshipController, getAuthorization } from "../../../shared/utils/services/ApiService";
import StatsRow from "./stats-row/StatsRow";
import { usePopup } from "../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../shared/utils/functions/errors";
import AvatarImage from "../../../shared/components/avatar-image/AvatarImage";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { greyColor, mainColor } from "../../../shared/utils/objects/colorMaps";
import { timingTypeIcons } from "../../../shared/svgs/iconsMap/TimingTypeIcons";
import { Guid } from "guid-typescript";
import { GetFriendProfileDto } from "../../../shared/utils/types/friendshipDtos";
import { friendSectionIcons } from "./FreindSectionIcons";

type FriendSectionProps = {
  // friendship id
  friendshipId: Guid;
};

function FriendSection({ friendshipId }: FriendSectionProps) {
  ///

  const { showPopup } = usePopup();

  // all current user data
  const [friend, setFriend] = useState<GetFriendProfileDto | null>(null);

  // to gat user data
  const getFriend = async (): Promise<void> => {
    try {
      const response = await axios.get<GetFriendProfileDto>(
        friendshipController.getFriendProfile(friendshipId),
        getAuthorization()
      );

      setFriend(response.data);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  // get data on load
  useEffect(() => {
    getFriend();
  }, []);

  return (
    <section className={classes.user}>
      {/* user profile */}
      {!friend ? (
        <div className={classes.user__profile}>
          <LoadingPage />
        </div>
      ) : (
        <div className={classes.user__profile}>
          <div
            className={classes.user__profile__background}
            style={{
              backgroundImage: friend.backgroundImage
                ? `url('data:${friend.backgroundImage.contentType};base64,${friend.backgroundImage.data}')`
                : "url('/images/account-bg.jpg')",
            }}
          />

          <div className={classes.user__profile__avatar}>
            <AvatarImage
              username={friend.username}
              profilePicture={friend.profilePicture}
              imageClass={classes["avatar-img"]}
            />
          </div>

          <div className={classes.user__profile__info}>
            <p className={classes["user-name"]}>{friend.username}</p>
            <p className={classes["name"]}>{friend.name ? friend.name : "-----"}</p>
            <p className={classes["bio"]}>{friend.bio ? friend.bio : "This user has not set bio yet."}</p>
          </div>

          <div className={classes.user__profile__icons}>
            <div className={classes["icon-con"]}>
              <div className={`${classes.icon} ${classes["country"]}`}>
                <img src={`https://flagsapi.com/${friend.country}/flat/64.png`} />
              </div>
              <span>{friend.country}</span>
            </div>
          </div>
        </div>
      )}

      {/* user stats */}
      <div className={classes.user__data}>
        {/* history view setter */}
        {!friend ? (
          <div className={classes.user__data__elo} />
        ) : (
          <div className={classes.user__data__elo}>
            <div className={classes.user__data__elo__header}>
              <IconCreator
                icons={friendSectionIcons}
                iconName={"history"}
                iconClass={classes["history-icon"]}
                color={greyColor.c4}
              />
              <span>Users Elo Points</span>
            </div>

            <div className={classes.user__data__elo__type}>
              <div className={classes["elo-points"]}>
                <IconCreator
                  icons={timingTypeIcons}
                  iconName={"bullet"}
                  iconClass={classes["elo-icon"]}
                  color={mainColor.c5}
                />
                <span>{friend.elo.bullet}</span>
              </div>
            </div>

            <div className={classes.user__data__elo__type}>
              <div className={classes["elo-points"]}>
                <IconCreator
                  icons={timingTypeIcons}
                  iconName={"blitz"}
                  iconClass={classes["elo-icon"]}
                  color={mainColor.c5}
                />
                <span>{friend.elo.blitz}</span>
              </div>
            </div>

            <div className={classes.user__data__elo__type}>
              <div className={classes["elo-points"]}>
                <IconCreator
                  icons={timingTypeIcons}
                  iconName={"rapid"}
                  iconClass={classes["elo-icon"]}
                  color={mainColor.c5}
                />
                <span>{friend.elo.rapid}</span>
              </div>
            </div>

            <div className={classes.user__data__elo__type}>
              <div className={classes["elo-points"]}>
                <IconCreator
                  icons={timingTypeIcons}
                  iconName={"classic"}
                  iconClass={classes["elo-icon"]}
                  color={mainColor.c5}
                />
                <span>{friend.elo.classic}</span>
              </div>
            </div>

            <div className={classes.user__data__elo__type}>
              <div className={classes["elo-points"]}>
                <IconCreator
                  icons={timingTypeIcons}
                  iconName={"daily"}
                  iconClass={classes["elo-icon"]}
                  color={mainColor.c5}
                />
                <span>{friend.elo.daily}</span>
              </div>
            </div>
          </div>
        )}

        {!friend ? (
          <div className={classes.user__data__stats}>
            {Array.from({ length: 10 }).map((_, i: number) => (
              <p key={i} className={classes["loading-block"]} />
            ))}
          </div>
        ) : (
          <div className={classes.user__data__stats}>
            <div className={classes.user__data__stats__header}>
              <IconCreator
                icons={friendSectionIcons}
                iconName={"stats"}
                iconClass={classes["header-icon"]}
                color={greyColor.c4}
              />
              <span>Users Statistics</span>
            </div>

            <div className={classes.user__data__stats__row}>
              <StatsRow type={"gamesTotal"} friend={friend} />
            </div>

            <div className={classes.user__data__stats__row}>
              <StatsRow type={"gamesTogether"} friend={friend} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default FriendSection;
