import { pieceImageMap } from "../../../shared/utils/enums/piecesMaps";
import { GetGameDto } from "../../../shared/utils/types/gameDtos";
import classes from "./GameBoard.module.scss";

type GameBoardProps = {
    gameData: GetGameDto;
};

function GameBoard({ gameData }: GameBoardProps) {
    const mapFromGamePosition = (position: string): JSX.Element => {
        const fields: JSX.Element[] = [];
        for (let i = 0; i < position.length; i++) {
            const char = position[i];

            if (char == "/") {
                fields.push(
                    <div key={`${i}`} className={classes.placeholder} />
                );
                continue;
            }

            if (!isNaN(parseInt(char))) {
                for (let j = 0; j < parseInt(char); j++) {
                    fields.push(
                        <div key={`${i}-${j}`} className={classes.field}></div>
                    );
                }
            } else {
                fields.push(
                    <div key={`${i}`} className={classes.field}>
                        <img src={`/pieces/${pieceImageMap[char]}`} />
                    </div>
                );
            }
        }

        return <div className={classes.board__grid}>{fields}</div>;
    };

    return (
        <div className={classes.board}>
            {mapFromGamePosition(gameData.position)}
        </div>
    );
}

export default GameBoard;
