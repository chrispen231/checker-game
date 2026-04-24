const boardElement = document.getElementById('board');
const statusText = document.getElementById('status');
let turn = 'black';
let selected = null;
let mustJump = false;

// Piece types: 'b', 'r', 'B' (Black King), 'R' (Red King)
let boardState = [
    [' ', 'r', ' ', 'r', ' ', 'r', ' ', 'r'],
    ['r', ' ', 'r', ' ', 'r', ' ', 'r', ' '],
    [' ', 'r', ' ', 'r', ' ', 'r', ' ', 'r'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ['b', ' ', 'b', ' ', 'b', ' ', 'b', ' '],
    [' ', 'b', ' ', 'b', ' ', 'b', ' ', 'b'],
    ['b', ' ', 'b', ' ', 'b', ' ', 'b', ' ']
];

function createBoard() {
    boardElement.innerHTML = '';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const square = document.createElement('div');
            square.className = `square ${(r + c) % 2 === 0 ? 'white-sq' : 'black-sq'}`;
            
            const pieceChar = boardState[r][c];
            if (pieceChar !== ' ') {
                const piece = document.createElement('div');
                piece.className = `piece ${pieceChar.toLowerCase() === 'b' ? 'black' : 'red'}`;
                if (pieceChar === 'B' || pieceChar === 'R') {
                    piece.innerHTML = '👑';
                    piece.style.display = 'flex';
                    piece.style.justifyContent = 'center';
                    piece.style.alignItems = 'center';
                    piece.style.fontSize = '20px';
                }
                square.appendChild(piece);
            }

            if (selected && selected.r === r && selected.c === c) {
                square.classList.add('selected');
            }

            square.onclick = () => handleSquareClick(r, c);
            boardElement.appendChild(square);
        }
    }
}

function handleSquareClick(r, c) {
    const piece = boardState[r][c];

    // Selecting a piece
    if (piece !== ' ' && piece.toLowerCase() === turn[0]) {
        if (mustJump && (selected?.r !== r || selected?.c !== c)) return; // Lock to jumping piece
        selected = { r, c };
        createBoard();
        return;
    }

    // Moving a piece
    if (selected) {
        const move = isValidMove(selected.r, selected.c, r, c);
        if (move.valid) {
            executeMove(selected.r, selected.c, r, c, move.isJump);
        } else {
            selected = null;
            createBoard();
        }
    }
}

function isValidMove(r1, c1, r2, c2) {
    const piece = boardState[r1][c1];
    const target = boardState[r2][c2];
    if (target !== ' ') return { valid: false };

    const dr = r2 - r1;
    const dc = c2 - c1;
    const absDr = Math.abs(dr);
    const absDc = Math.abs(dc);

    if (absDc !== absDr) return { valid: false };

    // Direction check for normal pieces
    if (piece === 'b' && dr > 0) return { valid: false };
    if (piece === 'r' && dr < 0) return { valid: false };

    // Standard move
    if (absDr === 1) {
        return { valid: !mustJump, isJump: false };
    }

    // Jump move
    if (absDr === 2) {
        const midR = (r1 + r2) / 2;
        const midC = (c1 + c2) / 2;
        const midPiece = boardState[midR][midC];
        if (midPiece !== ' ' && midPiece.toLowerCase() !== turn[0]) {
            return { valid: true, isJump: true };
        }
    }

    return { valid: false };
}

function executeMove(r1, c1, r2, c2, isJump) {
    let piece = boardState[r1][c1];

    // Move piece
    boardState[r2][c2] = piece;
    boardState[r1][c1] = ' ';

    // Remove captured piece
    if (isJump) {
        boardState[(r1 + r2) / 2][(c1 + c2) / 2] = ' ';
    }

    // King promotion
    if (r2 === 0 && piece === 'b') boardState[r2][c2] = 'B';
    if (r2 === 7 && piece === 'r') boardState[r2][c2] = 'R';

    // Check for double jumps
    if (isJump && canJumpAgain(r2, c2)) {
        selected = { r: r2, c: c2 };
        mustJump = true;
    } else {
        selected = null;
        mustJump = false;
        turn = turn === 'black' ? 'red' : 'black';
        statusText.innerText = `Turn: ${turn.charAt(0).toUpperCase() + turn.slice(1)}`;
    }
    createBoard();
}

function canJumpAgain(r, c) {
    const directions = [[2, 2], [2, -2], [-2, 2], [-2, -2]];
    return directions.some(([dr, dc]) => {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
            return isValidMove(r, c, nr, nc).isJump;
        }
        return false;
    });
}

createBoard();