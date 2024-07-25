import { pieceColor } from "../../../../shared/utils/enums/entitiesEnums";
import { pieceImageMap, piecePromotionMap } from "../../../../shared/utils/enums/piecesMaps";
import { GetPlayerDto } from "../../../../shared/utils/types/gameDtos";
import classes from "./GameBoardPromotion.module.scss";

type GameBoardPromotionProps = {
  // player data
  playerData: GetPlayerDto;
  // to perform pawn promotion by promoted piece code
  onPerformPromotion: (promotedPiece: string) => void;
};

function GameBoardPromotion({ playerData, onPerformPromotion }: GameBoardPromotionProps) {
  ///

  return (
    <div className={classes.promotion}>
      <div className={classes.promotion__pieces}>
        {playerData.color === pieceColor.white ? (
          piecePromotionMap.white.map((p, i) => (
            <div
              key={`promotion-${i}`}
              className={classes.piece}
              onClick={() => {
                onPerformPromotion(p);
              }}
            >
              <img src={`/pieces/${pieceImageMap[p]}`} alt={`promote-to-${p}`} />
            </div>
          ))
        ) : playerData.color === pieceColor.black ? (
          piecePromotionMap.black.map((p, i) => (
            <div
              key={`promotion-${i}`}
              className={classes.piece}
              onClick={() => {
                onPerformPromotion(p);
              }}
            >
              <img src={`/pieces/${pieceImageMap[p]}`} alt={`promote-to-${p}`} />
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default GameBoardPromotion;
