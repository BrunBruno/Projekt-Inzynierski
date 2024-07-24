import classes from "./GameMessage.module.scss";

type GameMessageProps = {};

function GameMessage({}: GameMessageProps) {
  return <div className={classes.message}></div>;
}

export default GameMessage;
