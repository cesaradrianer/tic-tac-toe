const startGameBtn = document.getElementById('start-game-btn')
const restartBtn = document.getElementById('restart-btn')
const nameInput = document.getElementById('name-input')

const displayController = (() => {
    const gameResultsArea = document.getElementById('game-results-area')

    const renderMessage = (message) => {
        gameResultsArea.innerHTML = message
    }

    const restartDisplay = () => {
        gameResultsArea.innerHTML = ''
    }

    return {renderMessage, restartDisplay}
})()

const gameboard = (() => {
    const boardValues = ['', '', '', '', '', '', '', '', '']

    const render = () => {
        let boardElements = ''
        boardValues.forEach((elem, index) => {
            boardElements += `<div class="square" id="square-${index}">${elem}</div>`
        })
        document.getElementById('game-area').innerHTML = boardElements
        const squares = document.querySelectorAll('div.square')
        squares.forEach((square) => {
            square.addEventListener('click', Game.handleClick)
        })
        
    }

    const update = (index, value) => {
        boardValues[index] = value
        render()
    }

    const getGameboard = () => boardValues

    return {render, update, getGameboard}
})()

const createPlayer = (name, mark) => {
    return {name, mark}
}

const Game = (() => {
    let gameOver
    let currentPlayerIndex
    let players = []

    const start = () => {
        players = [createPlayer(nameInput.value, 'X'), createPlayer('PC','O')]
        gameOver = false
        currentPlayerIndex = 0
        createPlayer(document.querySelectorAll('mark-selector'))
        gameboard.render()
        
    }

    const handleClick = (event) => {
        let idValue = parseInt(event.target.id.slice(7))
        if (gameboard.getGameboard()[idValue] !== '')
            return
        gameboard.update(idValue, players[currentPlayerIndex].mark)
        if (checkForWin(gameboard.getGameboard(), players[currentPlayerIndex].mark)) {
            gameOver = true
            displayController.renderMessage(`<h2>${players[currentPlayerIndex].name} won!</h2>`)
        } else if (checkForTie(gameboard.getGameboard())) {
            gameOver = true
            displayController.renderMessage(`<h2>It's a tie</h2>`)
        }
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0
    }

    const restart = () => {
        for (let i = 0; i < gameboard.getGameboard().length; i++) {
            gameboard.update(i, '')
        }
        gameboard.render()
        displayController.restartDisplay()
    }

    return {start, handleClick, restart}
})()

function checkForWin(board) {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i]
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true
        }
    }
    return false
}

function checkForTie(board) {
    return board.every(cell => cell !== '')
}

startGameBtn.addEventListener('click', () => {
    if (nameInput.value == '') {
        alert('Please write a name for yourself!')
    } else {
        Game.start()
    }
})

restartBtn.addEventListener('click' , () => {
    Game.restart()
})