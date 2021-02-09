// =====================================
// PlayerFactory
// =====================================
const PlayerFactory = (name) => {
  if (name.toLowerCase() === "computer") {
    // RANDOM MOVE LOGIC:
    const setComputerMove = () => {
      const tableCells = document.querySelectorAll("td");
      const getRandomMove = () => Math.floor(Math.random() * tableCells.length);
      let computerMove = getRandomMove();

      while (!Game.isValidMove(tableCells[computerMove])) {
        computerMove = getRandomMove();
      }
    };

    // RECURSIVE LOGIC:
    const setComputerMoveRecursive = () => {
      const syntheticBoard = Array.from(GameBoard.board);

      const findBestMove = (board, isMinimizing, depth) => {
        // Base case
        // someone won the game, or the game is a draw
        // score should be calculated and returned
        if (Game.calculateWinner(syntheticBoard) ||
            Game.isDraw(syntheticBoard)) {
          return;
        }

        const possibleMoves = getPossibleMoves();

        // Recursive logic
          // if minimizing
        if (isMinimizing) {
          const moveHistory = {};
          console.log("minimizing");
        }
          // if maximizing
        if (!isMinimizing) {
          const moveHistory = {};
          console.log("maximizing");
        }
      };

      // Helper Method to find open plays:
      const getPossibleMoves = () => {
        let indexArray = [];
        syntheticBoard.forEach((el, i) => {
          if (el === "") indexArray.push(i);
        });

        return indexArray;
      };

      findBestMove(syntheticBoard, true, 0)
    };

    return {
      setComputerMove,
      setComputerMoveRecursive,
      name
    }
  }

  return { name };
};

// =====================================
// GameBoard
// =====================================
const GameBoard = (() => {
  let board = [
    '', '', '',
    '', '', '',
    '', '', ''
  ];

  const updateBoard = (board, i, marker) => {
    board[i] = marker;
  };

  const resetBoard = () => {
    board.fill('');
  };

  return {
    resetBoard,
    updateBoard,
    board
  };
})();

// =====================================
// Game
// =====================================
const Game = (() => {
  const players = [];
  let currentMove = "";

  const startGame = (...names) => {
    let marker = "X";

    names.forEach((name, i) => {
      players.push( PlayerFactory(name) );
      players[i].marker = marker;
      marker = (marker === "X") ? "O" : "X";
    });

    currentMove = players[0];
  };

  const isEmptySquare = (targetCell) => !(targetCell.textContent !== "");

  const setMove = (targetCell) => {
    GameBoard.updateBoard(GameBoard.board, targetCell.id, currentMove.marker);
    currentMove = (currentMove === players[0]) ? players[1] :
        players[0];

    DisplayController.renderMoves();

    if (calculateWinner() || isDraw()) {
      return true;
    }

    if (isComputersTurn()) {
      setTimeout(currentMove.setComputerMove, 500);
      // setTimeout(currentMove.setComputerMoveRecursive, 500);
    }

    return true;
  };

  const isValidMove = (move) => {
    const targetSquare = move.target || move;

    return isEmptySquare(targetSquare) && setMove(targetSquare);
  }

  const isComputersTurn = () => {
    if (players[1].name.toLowerCase() === "computer" &&
          currentMove.marker.toLowerCase() === "o") {
      return true;
    }
  };

  const resetGame = () => {
    GameBoard.resetBoard();
    DisplayController.resetDisplay();
  };

  const playAgain = () => {
    GameBoard.resetBoard();
    DisplayController.replay();
    currentMove = players[0];
  }

  const calculateWinner = (board = GameBoard.board) => {
    const winningLines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 4, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [2, 4, 6]
    ];

    const isWin = winningLines.some((el) => {
      const [a, b, c] = el;

      if (board[a] && board[a] === board[b] &&
          board[a] === board[c]) {
            return declareWinner(board[a]);
      }
    });

    return isWin;
  };

  const isDraw = (board = GameBoard.board) => {
    if (board.every((cell) => cell !== '')) {
      return declareWinner("draw");
    }
  };

  const declareWinner = (marker) => {
    const text = (marker.toLowerCase() === "draw") ? "Game ends in DRAW" :
        (marker === "X") ? "Player 1 wins!" : "Player 2 wins!";
    DisplayController.renderModal(text);

    return true;
  };

  return {
    isValidMove,
    declareWinner,
    calculateWinner,
    isDraw,
    resetGame,
    startGame,
    playAgain
  };
})();

// =====================================
// DisplayController
// =====================================
const DisplayController = (() => {
  const humanRadioBtn = document.querySelector("input[value='human']");
  const computerRadioBtn = document.querySelector("input[value='computer']");
  const startGameBtn = document.querySelector(".playerSelect-input .button");
  const playerNameInputDiv = document.querySelector(".playerSelect-input");
  const playerSelectChoices = document.querySelector(".playerSelect-choices");
  const scoreboard = document.querySelector(".scoreboard");
  const restartBtn = document.querySelector(".scoreboard .button");
  const gameOverModal = document.querySelector(".gameOverModal");
  const playAgainBtn = document.querySelector(".gameOverModal .button");
  const playerOneName = document.querySelector(".playerOneName");
  const playerTwoName = document.querySelector(".playerTwoName");
  const playerOneInput = document.querySelector("#playerOne");
  const playerTwoInput = document.querySelector("#playerTwo");

  const bindEvents = () => {
    humanRadioBtn.addEventListener("change", toggleInputRow);
    computerRadioBtn.addEventListener("change", startGame);
    startGameBtn.addEventListener("click", startGame);
    restartBtn.addEventListener("click", Game.resetGame);
    playAgainBtn.addEventListener("click", Game.playAgain);
  };

  const clearRadioBtns = () => {
    const radioBtns = document.querySelectorAll("input[type='radio']");

    for (let i = 0; i < radioBtns.length; i++) {
      radioBtns[i].checked = false;
    }
  };

  const isComputerOpponent = (event) => event.target.value === "computer";

  const setPlayerNames = (computer) => {
    if (computer) {
      playerOneName.textContent = "Human";
      playerTwoName.textContent = "Computer";
    } else {
      playerOneName.textContent = playerOneInput.value ||
          playerOneInput.placeholder;
      playerTwoName.textContent = playerTwoInput.value ||
          playerTwoInput.placeholder;
    }
  };

  const startGame = (event) => {
    if (isComputerOpponent(event)) {
      setPlayerNames(true);
      removeInputRow();
      Game.startGame("Human", "Computer");
    } else {
      setPlayerNames();
      Game.startGame(playerOneName.textContent, playerTwoName.textContent);
      toggleInputRow();
    }

    clearRadioBtns();
    togglePlayerSelect();
    toggleScoreboard();
    createTable(GameBoard.board);
    renderMoves();
  };

  const removeInputRow = () => {
    playerNameInputDiv.classList.add("playerSelect-input-hiding");
  };

  const toggleInputRow = () => {
    playerNameInputDiv.classList.toggle("playerSelect-input-hiding");
  };

  const toggleScoreboard = () => {
    scoreboard.classList.toggle("scoreboard-hiding");
  };

  const togglePlayerSelect = () => {
    playerSelectChoices.classList.toggle("playerSelect-choices-hiding");
  };

  const toggleModal = () => {
    gameOverModal.classList.toggle('gameOverModal-hiding');
  };

  const init = () => {
    bindEvents();
  };

  const renderModal = (text) => {
    gameOverModal.querySelector(".gameOverModal-title").textContent = text;
    toggleModal();
  };

  const clearInputFields = () => {
    playerOneInput.value = '';
    playerTwoInput.value = '';
  };

  const resetDisplay = () => {
    clearInputFields();
    toggleScoreboard();
    togglePlayerSelect();
  };

  const replay = () => {
    toggleModal();
    createTable(GameBoard.board);
  };

  const renderMoves = () => {
    const table = Array.from( document.querySelectorAll("td") );

    table.forEach((cell, i) => {
      cell.id = i;
      cell.textContent = GameBoard.board[i];
      cell.addEventListener('click', Game.isValidMove);
    });
  };

  const createTable = (gameboard) => {
    const table = document.querySelector("table");
    table.innerHTML = "";

    for (let i = 0; i < gameboard.length; i++) {
      if (i % 3 === 0) {
        const tableRow = document.createElement("tr");
        table.appendChild(tableRow);
      }

      const tableCell = document.createElement("td");
      table.lastElementChild.appendChild(tableCell);
    }

    renderMoves();
  };

  return {
    renderMoves,
    renderModal,
    resetDisplay,
    replay,
    init
  };
})();

DisplayController.init();

// TODO
  // When I choose to play a game against a human, the computer still plays,
  // but it seems to only happen when a previous game starts against a computer.