import classes from "./InvitationEmptyCard.module.scss";

type InvitationEmptyCardProps = {
  index: number;
};

function InvitationEmptyCard({ index }: InvitationEmptyCardProps) {
  ///

  return (
    <div key={`empty-card-${index}`} className={classes.card}>
      <div className={classes.card__title}>
        <div className={classes.card__title__icon} />
        <div className={classes.card__title__text}>
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
