//An Array containing the content of the gameboard
const gameBoard = (() => {
    const board = ['','','','','','','','','']
    const squares = document.querySelectorAll('.square');
    return {board, squares};
})();

//Factory function for creating the players
const player = (name, symbol) => {
    const getName = () => name;
    const getSymbol = () => symbol;
    return{getName, getSymbol};
};

//Module that renders the gameboard as well as the message
const renderStuff = (() => {
    const renderBoard = () => {
        for (let i=0; i<9; i++) {
            gameBoard.squares[i].textContent = gameBoard.board[i];
        }
    }
    const renderMessage = message => {
        const messageField = document.querySelector('.message');
        messageField.textContent = message;
    }
    return {renderBoard, renderMessage}
})();

const player1 = player('Theo', 'X');
const player2 = player('Kat', 'O')

//the logic of the game
const playGame = (() => {
    let currentPlayer = player1;
    message = `It's ${currentPlayer.getName()}'s turn`;
    renderStuff.renderMessage(message);

    const playRound = (square) => {
        if (gameBoard.board[square] === '') {
            gameBoard.board[square] = currentPlayer.getSymbol();
            renderStuff.renderBoard();
            if (checkWinner(square)) {
                message = `${currentPlayer.getName()} wins!`;
            }
            else {
                if (gameBoard.board.includes('')) {
                    (currentPlayer === player1) ? currentPlayer = player2 : currentPlayer = player1;
                    message = `It's ${currentPlayer.getName()}'s turn`;
                }
                else {
                    message = 'Game over. It\'s a tie'
                }
            }
            renderStuff.renderMessage(message);
        } 
    }

    const checkWinner = (index) => {
        const winningCombinations = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ]

        return winningCombinations.filter(combination => combination.includes(index)).some(combination => combination.every(index => gameBoard.board[index] === currentPlayer.getSymbol()))
    }

    return {playRound}
})();

//Module containing the listeners for the boxes and buttons.
const eventsListener = (() => {
    const squares = gameBoard.squares;
    const startButton = document.querySelector('.start');

    squares.forEach((square) =>
        square.addEventListener('click', (e) => {
            playGame.playRound(parseInt(e.target.dataset.index));
        }));

    startButton.addEventListener('click', (e) => {
        console.log('qwer');
    })
})();

