const boardElement = document.getElementById('board');
const statusText = document.getElementById('status');
let turn = 'black';
let selectedSquare = null;

// Initial Board State
const boardState = [
    ['', 'red', '', 'red', '', 'red', '', 'red'],
    ['red', '', 'red', '', 'red', '', 'red', ''],
    ['', 'red', '', 'red', '', 'red', '', 'red'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['black', '', 'black', '', 'black', '', 'black', ''],
    ['', 'black', '', 'black', '', 'black', '', 'black'],
    ['black', '', 'black', '', 'black', '', 'black', '']
];

function createBoard() {
    boardElement.innerHTML = '';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const square = document.createElement('div');
            square.classList.add('square', (r + c) % 2 === 0 ? 'white-sq' : 'black-sq');
            square.dataset.row = r;
            square.dataset.col = c;

            if (boardState[r][c]) {
                const piece = document.createElement('div');
                piece.classList.add('piece', boardState[r][c]);
                square.appendChild(piece);
            }

            square.onclick = () => handleSquareClick(r, c);
            boardElement.appendChild(square);
        }
    }
}

function handleSquareClick(r, c) {
    if (selectedSquare) {
        movePiece(selectedSquare.r, selectedSquare.c, r, c);
        selectedSquare = null;
        createBoard();
    } else if (boardState[r][c] === turn) {
        selectedSquare = { r, c };
        createBoard(); // Refresh to show selection
    }
}

function movePiece(r1, c1, r2, c2) {
    // Simple logic: move if destination is empty and diagonal
    if (boardState[r2][c2] === '' && Math.abs(r2 - r1) === 1 && Math.abs(c2 - c1) === 1) {
        boardState[r2][c2] = boardState[r1][c1];
        boardState[r1][c1] = '';
        turn = turn === 'black' ? 'red' : 'black';
        statusText.innerText = `Turn: ${turn.charAt(0).toUpperCase() + turn.slice(1)}`;
    }
}

createBoard();