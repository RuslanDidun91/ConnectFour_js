/*-- constants --*/
const COLORS = {
    '0': 'white',
    '1': 'saddlebrown',
    '-1': 'gold'
}

/*-- state variables  --*/
let board;  // array of 7 column arrays
let turn;  // 1 or -1
let winner; //null - no winner; 1 or -1 winner; 't' - tie

/*--  cached elements --*/
const messageEl = document.querySelector('h1');
const playAgainBtn = document.querySelector('button');
const markerEls = [...document.querySelectorAll('#markers > div')];
/*--  event listeners --*/
document.getElementById('markers').addEventListener('click', handleDrop);
//starts game from the beginning
playAgainBtn.addEventListener('click', init);
/*-- functions  --*/
init();

//initialize all state, then call render()
function init() {
    //to visualize the board mapping to the DOM 
    //rotate the board array 90 degrees counter-clockwise
    board = [
        [0, 0, 0, 0, 0, 0],  //col1
        [0, 0, 0, 0, 0, 0],  //col2
        [0, 0, 0, 0, 0, 0],  //col3
        [0, 0, 0, 0, 0, 0],  //col4
        [0, 0, 0, 0, 0, 0],  //col5
        [0, 0, 0, 0, 0, 0],  //col6
        [0, 0, 0, 0, 0, 0],  //col7
    ];
    turn = 1;
    winner = null;
    render();
}

//depends on user interaction state then call render()
function handleDrop(event) {
    const colIndex = markerEls.indexOf(event.target);
    //guards...
    if (colIndex === -1) return;
    //shortcut to column array
    const colArr = board[colIndex];
    //find the index of the first in colAr
    const rowIdx = colArr.indexOf(0);
    //update the board state with the cur player value turn
    colArr[rowIdx] = turn;
    //switch player turn
    turn *= -1;
    //check for winner
    winner = getWinner(colIndex, rowIdx);
    render()
}

//check for winner in bord state and
//return null if no winner
function getWinner(colIndex, rowIndex) {
    return checkVertical(colIndex, rowIndex) ||
        checkHorizontal(colIndex, rowIndex) ||
        checkDiagonalNESW(colIndex, rowIndex) ||
        checkDiagonalNWSE(colIndex, rowIndex);
}

function checkDiagonalNWSE(colIndex, rowIndex) {
    const adjCountNW = countAdjacent(colIndex, rowIndex, -1, 1);
    const adjCountSE = countAdjacent(colIndex, rowIndex, 1, -1);
    return (adjCountNW + adjCountSE) >= 3 ? board[colIndex][rowIndex] : null;
}

function checkDiagonalNESW(colIndex, rowIndex) {
    const adjCountNE = countAdjacent(colIndex, rowIndex, 1, 1);
    const adjCountSW = countAdjacent(colIndex, rowIndex, -1, -1);
    return (adjCountNE + adjCountSW) >= 3 ? board[colIndex][rowIndex] : null;
}

function checkHorizontal(colIndex, rowIndex) {
    const adjCountLeft = countAdjacent(colIndex, rowIndex, -1, 0)
    const adjCountRight = countAdjacent(colIndex, rowIndex, 1, 0)
    return (adjCountLeft + adjCountRight) >= 3 ? board[colIndex][rowIndex] : null;
}

function checkVertical(colIndex, rowIndex) {
    return countAdjacent(colIndex, rowIndex, 0, -1) === 3 ? board[colIndex][rowIndex] : null;
}

function countAdjacent(colIndex, rowIndex, colOffset, rowOffset) {
    //shortcut
    const player = board[colIndex][rowIndex];
    //truck count of adjustment cells with the same player value
    let count = 0;
    rowIndex += colOffset;
    colIndex += rowOffset;
    while (
        //Ensure colIdx is within bounds of thw board array
    board[colIndex] !== undefined &&
    board[colIndex][rowIndex] !== undefined &&
    board[colIndex][rowIndex] === player
        ) {
        count++
        rowIndex += colOffset;
        colIndex += rowOffset;
    }
    return count;
}

//visualize all state in the DOM
function render() {
    renderBoard();
    renderMessage();
    //hide/show UI elements
    renderControls();
}

function renderBoard() {
    //iterate over columns
    board.forEach((colArr, colIndex) => {
        //iterate over the cells in the column
        colArr.forEach((cellVal, rowIndex) => {
            const cellId = `c${colIndex}r${rowIndex}`;
            const cellEl = document.getElementById(cellId);
            cellEl.style.backgroundColor = COLORS[cellVal];
        });
    });
}

function renderMessage() {
    if (winner === 'T') {
        messageEl.innerText = 'Tie';
    } else if (winner) {
        messageEl.innerHTML = `<span style="color: ${COLORS[winner]}">${COLORS[winner]
            .toUpperCase()}</span> Wins!`;
    } else {
        //turn is in play
        messageEl.innerHTML = `<span style="color: ${COLORS[turn]}">${COLORS[turn]
            .toUpperCase()}</span>'s Turn`;
    }
}

function renderControls() {
    playAgainBtn.style.visibility = winner ? 'visible' : 'hidden';
    //iterate over the marker elements to hide/show
    //according to the column being full or not
    markerEls.forEach((markerEl, colIndex) => {
        const hideMarker = !board[colIndex].includes(0) || winner
        //if we have winner controllers are hidden
        markerEl.style.visibility = hideMarker ? 'hidden' : 'visible';
    });
}




