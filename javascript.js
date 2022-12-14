//An Array containing the content of the gameboard
const gameMemory = (() => {
    const board = ['','','','','','','','',''];
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
    let isHuman = false;
    message = `Press the button to begin a game`;
    renderStuff.renderMessage(message);

    const beginGame = (xplayer, oplayer) => {
        gameMemory.board = ['','','','','','','','',''];
        renderStuff.renderBoard();
        gameStatus = true;
        player1 = xplayer;
        player2 = oplayer;
        currentPlayer = Math.random() < 0.5 ? player1 : player2;
        message = `It's ${currentPlayer.getName()}'s turn`;
        renderStuff.renderMessage(message);
        if (currentPlayer.getSymbol()==='O' && currentPlayer.getName()==='Computer' && isHuman===false) {
            aiturn();
        }
    }

    const playRound = (square) => {
       
        if (gameStatus === false || gameMemory.board[square] !== '') {
            return
        }
        gameMemory.board[square] = currentPlayer.getSymbol();
        renderStuff.renderBoard();
        if (checkWinner(gameMemory.board, currentPlayer.getSymbol())) {
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

    const checkWinner = (board, symbol) => {
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

        return winningCombinations.some(combination => combination.every(index => board[index] === symbol))
    }

    //The computer chooses where to play using this function
    const aiturn = () => {
        const possibleChoices = [];
        for (let i=0; i<gameMemory.board.length; i++) {
            if (gameMemory.board[i]==='') {
                possibleChoices.push(i);
            }
        }
        let aichoice = minimax(gameMemory.board, 'O', possibleChoices);
        setTimeout(playRound, 2000, aichoice.index); 
    }

    return {beginGame, playRound, isHuman, aiturn, checkWinner}
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
            if (playGame.isHuman === false) {
                playGame.aiturn()
            }
        }));

    startButton.addEventListener('click', () => {
        document.querySelector('.gamemode').style.display = 'block';
    })

    confirmButon.addEventListener('click', () => {
        if (tabs[0].classList.contains('active')) {
            let xplayer = player(document.querySelector('#xname').value, 'X');
            let oplayer = player(document.querySelector('#oname').value, 'O');
            playGame.isHuman = true;
            playGame.beginGame(xplayer, oplayer);
        }
        else {
            let xplayer = player(document.querySelector('#pname').value, 'X');
            let oplayer = player('Computer', 'O');
            playGame.isHuman = false;
            playGame.beginGame(xplayer, oplayer);
        }
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

//minimax algorithm to create an unbeatable AI
function minimax(currentBoard, symbol, possibleChoices) {

    if (playGame.checkWinner(currentBoard, 'O')) {
        return {score: 1};
    }
    else if (playGame.checkWinner(currentBoard, 'X')) {
        return {score: -1};
    }
    else if (possibleChoices.length === 0) {
        return {score: 0};
    }

    const allTests = [];

    for (let i = 0; i<possibleChoices.length; i++) {
        //we run a test for each available square
        const currentTest = {};
        currentTest.index = possibleChoices[i];
        //each test updates the game board temporarily to check the outcomes
        currentBoard[possibleChoices[i]] = symbol;
        //then we recursively run the minimax function each time for the next player with the remaining options
        let newChoices = possibleChoices.map(x => x);
        newChoices.splice(i,1);
        if (symbol==='O') {
            result = minimax(currentBoard, 'X', newChoices);
            currentTest.score = result.score;
        }
        else {
            result = minimax(currentBoard, 'O', newChoices);
            currentTest.score = result.score;
        }

        //reset the gameboard
        currentBoard[possibleChoices[i]] = '';
        //save the result of the test
        allTests.push(currentTest);
    }

    let bestPlay;

    //get the index of each player's best play
    if (symbol==='O') {
        let bestScore = -Infinity;
        for (let i=0; i<allTests.length; i++) {
            if (allTests[i].score > bestScore) {
                bestScore = allTests[i].score;
                bestPlay = allTests[i];
            }
        }
    }
    else {
        let bestScore = Infinity;
        for (let i=0; i<allTests.length; i++) {
            if (allTests[i].score < bestScore) {
                bestScore = allTests[i].score;
                bestPlay = allTests[i];
            }
        }
    }
    
    return bestPlay
}