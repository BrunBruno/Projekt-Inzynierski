const makeNewPosition = (matrix: string[][]): string => {
    matrix = matrix.reverse();
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

export const makeMove = async (
    connection: signalR.HubConnection | null,
    gameId: string,
    matrix: string[][],
    piece: string,
    oldCoordinates: number[],
    newCoordinates: number[]
) => {
    if (!connection) {
        return;
    }

    const newX = newCoordinates[0];
    const newY = newCoordinates[1];

    const oldX = oldCoordinates[0];
    const oldY = oldCoordinates[1];

    matrix[oldY - 1][oldX - 1] = "";
    matrix[newY - 1][newX - 1] = piece;

    const newPosition = makeNewPosition(matrix);

    connection.invoke("MakeMove", gameId, newPosition);
};
