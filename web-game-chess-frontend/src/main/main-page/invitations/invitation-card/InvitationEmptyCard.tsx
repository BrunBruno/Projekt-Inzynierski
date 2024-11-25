import classes from "./InvitationCard.module.scss";

type InvitationEmptyCardProps = {
  // index number
  index: number;
};

function InvitationEmptyCard({ index }: InvitationEmptyCardProps) {
  ///

  return (
    <div key={`empty-card-${index}`} className={`${classes.card} ${classes.empty}`}>
      <div className={classes.card__title}>
        <div className={classes["empty-icon"]} />
        <div className={classes["empty-text"]}>
          <p className={classes["t-filler"]} />
          <p className={classes["t-filler"]} />
        </div>
      </div>

      <div className={classes.card__actions}>
        <p className={classes["a-filler"]} />
        <p className={classes["a-filler"]} />
      </div>
    </div>
  );
}

export default InvitationEmptyCard;
