//An Array containing the content of the gameboard
const gameMemory = (() => {
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
            gameMemory.squares[i].textContent = gameMemory.board[i];
        }
    }
    const renderMessage = message => {
        const messageField = document.querySelector('.message');
        messageField.textContent = message;
    }
    return {renderBoard, renderMessage}
})();

//Module containing the logic of the game
const playGame = (() => {
    let gameStatus = false;
    let player1;
    let player2;
    let currentPlayer;
    message = `Press the button to begin a game`;
    renderStuff.renderMessage(message);

    const beginGame = (xplayer, oplayer) => {
        gameStatus = true;
        player1 = xplayer;
        player2 = oplayer;
        currentPlayer = Math.random() < 0.5 ? player1 : player2;
        message = `It's ${currentPlayer.getName()}'s turn`;
        renderStuff.renderMessage(message);
    }

    const playRound = (square) => {
        if (gameStatus === false || gameMemory.board[square] !== '') {
            return
        }
        gameMemory.board[square] = currentPlayer.getSymbol();
        renderStuff.renderBoard();
        if (checkWinner(square)) {
            message = `${currentPlayer.getName()} wins!`;
            gameStatus = false;
        }
        else {
            if (gameMemory.board.includes('')) {
                (currentPlayer === player1) ? currentPlayer = player2 : currentPlayer = player1;
                message = `It's ${currentPlayer.getName()}'s turn`;
            }
            else {
                message = 'Game over. It\'s a tie'
            }
        }
        renderStuff.renderMessage(message);
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

        return winningCombinations.filter(combination => combination.includes(index)).some(combination => combination.every(index => gameMemory.board[index] === currentPlayer.getSymbol()))
    }

    return {beginGame, playRound}
})();

//Module containing the listeners for the boxes and buttons.
const eventsListener = (() => {
    const squares = gameMemory.squares;
    const startButton = document.querySelector('.start');
    const confirmButon = document.querySelector('.confirm')
    const cancelButton = document.querySelector('.cancel');
    const tabs = document.querySelectorAll('.buttoncontainer button');

    squares.forEach((square) =>
        square.addEventListener('click', (e) => {
            playGame.playRound(parseInt(e.target.dataset.index));
        }));

    startButton.addEventListener('click', () => {
        document.querySelector('.gamemode').style.display = 'block';
    })

    confirmButon.addEventListener('click', () => {
        let xplayer = player(document.querySelector('#xname').value, 'X');
        let oplayer = player(document.querySelector('#oname').value, 'O');
        playGame.beginGame(xplayer, oplayer);
        document.querySelector('.gamemode').style.display = 'none';
        startButton.textContent = 'Restart Game';
    })

    cancelButton.addEventListener('click', () => {
        document.querySelector('.gamemode').style.display = 'none';
    })

    tabs.forEach((tab) =>
        tab.addEventListener('click', (e) => {
            switchTabs(e);
        })
    )

    const switchTabs = (e) => {
        if (e.target.classList.contains('active')) {
            return
        }
        tabContent = document.querySelectorAll('.tabcontent')
        for (let i=0; i < tabs.length; i++) {
            if (tabs[i].classList.contains('active')){
                tabs[i].classList.remove('active');
                tabContent[i].style.display = 'none';
            }
            else {
                tabs[i].classList.add('active')
                tabContent[i].style.display = 'block';
            }
        }
    }
})();