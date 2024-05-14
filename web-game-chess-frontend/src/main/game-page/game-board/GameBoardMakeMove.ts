import GameHubService from "../../../shared/utils/services/GameHubService";

class MakeMove {
    private matrix: string[][] = [];

    public makeMove = async (
        gameId: string,
        matrix: string[][],
        piece: string,
        oldCoordinates: number[],
        newCoordinates: number[]
    ) => {
        this.matrix = matrix;

        const newX = newCoordinates[0];
        const newY = newCoordinates[1];

        const oldX = oldCoordinates[0];
        const oldY = oldCoordinates[1];

        matrix[oldY - 1][oldX - 1] = "";
        matrix[newY - 1][newX - 1] = piece;

        const newPosition = this.makeNewPosition();

        GameHubService.MakeMove(gameId, newPosition, ""); // last made move
    };

    private makeNewPosition = (): string => {
        const matrix = this.matrix.reverse();
        let newPosition = "";

        for (let row in matrix) {
            let emptyCount: number = 0;

            for (let col in matrix[row]) {
                const field = matrix[row][col];

                if (field === "") {
                    emptyCount++;
                } else {
                    if (emptyCount > 0) {
                        newPosition += emptyCount.toString();
                        emptyCount = 0;
                    }
                    newPosition += matrix[row][col];
                }
            }

            if (emptyCount > 0) {
                newPosition += emptyCount.toString();
            }

            newPosition += "/";
        }
        newPosition = newPosition.slice(0, -1);
        return newPosition;
    };
}

export default new MakeMove();
