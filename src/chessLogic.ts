// src/chessLogic.ts

import { Game } from "./entities/Game";

const generateHighlightArray = () => {
    const highlight = [];
    for (let i = 0; i < 8; i++) {
        highlight.push(Array(8).fill(null));
    }
    return highlight;
}

const getPieceAtPosition = (game: Game, position: string) => {
    // Dummy implementation for getting the piece type and owner at a position.
    // You should replace this with your actual logic based on game state.
    const [x, y] = position.split("").map(Number);
    return game.board[x][y];
};

export const rook = (game: Game, from: string, to: string) => {
    const [x, y] = from.split("").map(Number);
    const newHighlight = generateHighlightArray();
    const piece = getPieceAtPosition(game, from);

    for (let i = x + 1; i < 8; i++) {
        if (game.board[i][y]) {
            if (piece.owner !== game.board[i][y].owner) {
                newHighlight[i][y] = "red";
            }
            break;
        }
        newHighlight[i][y] = "skyblue";
    }
    for (let i = x - 1; i >= 0; i--) {
        if (game.board[i][y]) {
            if (piece.owner !== game.board[i][y].owner) {
                newHighlight[i][y] = "red";
            }
            break;
        }
        newHighlight[i][y] = "skyblue";
    }

    for (let j = y + 1; j < 8; j++) {
        if (game.board[x][j]) {
            if (piece.owner !== game.board[x][j].owner) {
                newHighlight[x][j] = "red";
            }
            break;
        }
        newHighlight[x][j] = "skyblue";
    }
    for (let j = y - 1; j >= 0; j--) {
        if (game.board[x][j]) {
            if (piece.owner !== game.board[x][j].owner) {
                newHighlight[x][j] = "red";
            }
            break;
        }
        newHighlight[x][j] = "skyblue";
    }
    
    return newHighlight;
};

export const knight = (game: Game, from: string, to: string) => {
    const [x, y] = from.split("").map(Number);
    const newHighlight = generateHighlightArray();
    const piece = getPieceAtPosition(game, from);

    const moves = [
        [x + 2, y + 1], [x + 2, y - 1], [x - 2, y + 1], [x - 2, y - 1],
        [x + 1, y + 2], [x + 1, y - 2], [x - 1, y + 2], [x - 1, y - 2]
    ];

    moves.forEach(([nx, ny]) => {
        if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
            if (!game.board[nx][ny]) {
                newHighlight[nx][ny] = "skyblue";
            } else if (piece.owner !== game.board[nx][ny].owner) {
                newHighlight[nx][ny] = "red";
            }
        }
    });

    return newHighlight;
};

export const king = (game: Game, from: string, to: string) => {
    const [x, y] = from.split("").map(Number);
    const newHighlight = generateHighlightArray();
    const piece = getPieceAtPosition(game, from);

    const moves = [
        [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1],
        [x + 1, y + 1], [x + 1, y - 1], [x - 1, y + 1], [x - 1, y - 1]
    ];

    moves.forEach(([nx, ny]) => {
        if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
            if (!game.board[nx][ny]) {
                newHighlight[nx][ny] = "skyblue";
            } else if (piece.owner !== game.board[nx][ny].owner) {
                newHighlight[nx][ny] = "red";
            }
        }
    });

    return newHighlight;
};

export const queen = (game: Game, from: string, to: string) => {
    const [x, y] = from.split("").map(Number);
    const newHighlight = generateHighlightArray();
    const piece = getPieceAtPosition(game, from);

    // Combining rook and bishop movement
    // Rook movement part
    for (let i = x + 1; i < 8; i++) {
        if (!game.board[i][y]) {
            newHighlight[i][y] = "skyblue";
        } else if (piece.owner !== game.board[i][y].owner) {
            newHighlight[i][y] = "red";
            break;
        } else {
            break;
        }
    }
    for (let i = x - 1; i >= 0; i--) {
        if (!game.board[i][y]) {
            newHighlight[i][y] = "skyblue";
        } else if (piece.owner !== game.board[i][y].owner) {
            newHighlight[i][y] = "red";
            break;
        } else {
            break;
        }
    }
    for (let j = y + 1; j < 8; j++) {
        if (!game.board[x][j]) {
            newHighlight[x][j] = "skyblue";
        } else if (piece.owner !== game.board[x][j].owner) {
            newHighlight[x][j] = "red";
            break;
        } else {
            break;
        }
    }
    for (let j = y - 1; j >= 0; j--) {
        if (!game.board[x][j]) {
            newHighlight[x][j] = "skyblue";
        } else if (piece.owner !== game.board[x][j].owner) {
            newHighlight[x][j] = "red";
            break;
        } else {
            break;
        }
    }

    // Bishop movement part
    for (let i = 1; x + i < 8 && y + i < 8; i++) {
        if (!game.board[x + i][y + i]) {
            newHighlight[x + i][y + i] = "skyblue";
        } else if (piece.owner !== game.board[x + i][y + i].owner) {
            newHighlight[x + i][y + i] = "red";
            break;
        } else {
            break;
        }
    }
    for (let i = 1; x + i < 8 && y - i >= 0; i++) {
        if (!game.board[x + i][y - i]) {
            newHighlight[x + i][y - i] = "skyblue";
        } else if (piece.owner !== game.board[x + i][y - i].owner) {
            newHighlight[x + i][y - i] = "red";
            break;
        } else {
            break;
        }
    }
    for (let i = 1; x - i >= 0 && y + i < 8; i++) {
        if (!game.board[x - i][y + i]) {
            newHighlight[x - i][y + i] = "skyblue";
        } else if (piece.owner !== game.board[x - i][y + i].owner) {
            newHighlight[x - i][y + i] = "red";
            break;
        } else {
            break;
        }
    }
    for (let i = 1; x - i >= 0 && y - i >= 0; i++) {
        if (!game.board[x - i][y - i]) {
            newHighlight[x - i][y - i] = "skyblue";
        } else if (piece.owner !== game.board[x - i][y - i].owner) {
            newHighlight[x - i][y - i] = "red";
            break;
        } else {
            break;
        }
    }

    return newHighlight;
};

export const bishop = (game: Game, from: string, to: string) => {
    const [x, y] = from.split("").map(Number);
    const newHighlight = generateHighlightArray();
    const piece = getPieceAtPosition(game, from);

    for (let i = 1; x + i < 8 && y + i < 8; i++) {
        if (!game.board[x + i][y + i]) {
            newHighlight[x + i][y + i] = "skyblue";
        } else if (piece.owner !== game.board[x + i][y + i].owner) {
            newHighlight[x + i][y + i] = "red";
            break;
        } else {
            break;
        }
    }
    for (let i = 1; x + i < 8 && y - i >= 0; i++) {
        if (!game.board[x + i][y - i]) {
            newHighlight[x + i][y - i] = "skyblue";
        } else if (piece.owner !== game.board[x + i][y - i].owner) {
            newHighlight[x + i][y - i] = "red";
            break;
        } else {
            break;
        }
    }
    for (let i = 1; x - i >= 0 && y + i < 8; i++) {
        if (!game.board[x - i][y + i]) {
            newHighlight[x - i][y + i] = "skyblue";
        } else if (piece.owner !== game.board[x - i][y + i].owner) {
            newHighlight[x - i][y + i] = "red";
            break;
        } else {
            break;
        }
    }
    for (let i = 1; x - i >= 0 && y - i >= 0; i++) {
        if (!game.board[x - i][y - i]) {
            newHighlight[x - i][y - i] = "skyblue";
        } else if (piece.owner !== game.board[x - i][y - i].owner) {
            newHighlight[x - i][y - i] = "red";
            break;
        } else {
            break;
        }
    }

    return newHighlight;
};

export const pawn = (game: Game, from: string, to: string) => {
    const [x, y] = from.split("").map(Number);
    const newHighlight = generateHighlightArray();
    const piece = getPieceAtPosition(game, from);

    const direction = piece.owner === "white" ? 1 : -1;
    if (x + direction >= 0 && x + direction < 8) {
        if (!game.board[x + direction][y]) {
            newHighlight[x + direction][y] = "skyblue";
        }
        if (y + 1 < 8 && game.board[x + direction][y + 1] && piece.owner !== game.board[x + direction][y + 1].owner) {
            newHighlight[x + direction][y + 1] = "red";
        }
        if (y - 1 >= 0 && game.board[x + direction][y - 1] && piece.owner !== game.board[x + direction][y - 1].owner) {
            newHighlight[x + direction][y - 1] = "red";
        }
    }

    return newHighlight;
};