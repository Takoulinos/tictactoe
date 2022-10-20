const gameBoard = (() => {
    const board = ['','','','','','','','','']
    return {board};
})();

const player = (name, symbol) => {
    const getName = () => name;
    const getSymbol = () => symbol;
    return{getName, getSymbol};
};

const renderStuff = (() => {
    const squares = document.querySelectorAll('.square');
    const render = () => {
        for (let i=0; i<9; i++) {
            squares[i].textContent = gameBoard.board[i];
        }
    }
    return {render}
})();


const playGame = (() => {
    const {board} = gameBoard;
})();

