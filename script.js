// =====================================
// PlayerFactory
// =====================================
const PlayerFactory = (name) => {
  if (name.toLowerCase() === "computer") {
    const setComputerMove = () => {
      const tableCells = document.querySelectorAll("td");
      let computerMove = Math.floor(Math.random() * tableCells.length);

      while (!Game.validateMove(tableCells[computerMove])) {
        computerMove = Math.floor(Math.random() * tableCells.length);
      }
    };

    return {
      setComputerMove,
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

  const updateBoard = (i, marker) => {
    board[i] = marker;
    DisplayController.renderMoves();
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
  const _players = [];
  let _currentMove = null;

  const startGame = (...names) => {
    let marker = "X";

    names.forEach((name, i) => {
      _players.push( PlayerFactory(name) );
      _players[i].marker = marker;
      marker = (marker === "X") ? "O" : "X";
    });

    _currentMove = _players[0];
  };

  const validateMove = (move) => {
    const targetSquare = move.target || move;

    return _isEmptySquare(targetSquare) && _setMove(targetSquare);
  }

  const _isEmptySquare = (targetCell) => {
    return (targetCell.textContent !== "") ? false : true;
  };

  const _isComputersTurn = () => {
    if (_players[1].name.toLowerCase() === "computer" &&
          _currentMove.marker.toLowerCase() === "o") {
      return true;
    }
  };

  const _setMove = (targetCell) => {
    GameBoard.updateBoard(targetCell.id, _currentMove.marker);
    _currentMove = (_currentMove === _players[0]) ? _players[1] :
        _players[0];

    if (calculateWinner()) {
      return; // this should probably return true, but see if you can clean up the code
    }

    if (_isComputersTurn()) {
      setTimeout(_currentMove.setComputerMove, 500);
    }

    return true;
  };

  const resetGame = () => {
    GameBoard.resetBoard();
    DisplayController.resetDisplay();
  };

  const playAgain = () => {
    GameBoard.resetBoard();
    DisplayController.replay();
  }

  const calculateWinner = () => {
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

      if (GameBoard.board[a] && GameBoard.board[a] === GameBoard.board[b] &&
          GameBoard.board[a] === GameBoard.board[c]) {
            return declareWinner(GameBoard.board[a]);
      }
    });

    const isDraw = () => {
      return GameBoard.board.every((cell) => cell !== '') &&
        declareWinner("draw");
    };

    return isWin || isDraw();
  };

  const declareWinner = (marker) => {
    const text = (marker.toLowerCase() === "draw") ? "Game ends in DRAW" :
        (marker === "X") ? "Player 1 wins!" : "Player 2 wins!";
    DisplayController.renderModal(text);

    return true;
  };

  return {
    validateMove,
    declareWinner,
    calculateWinner,
    resetGame,
    startGame,
    playAgain
  };
})();

// =====================================
// DisplayController
// =====================================
const DisplayController = (() => {
  const _humanRadioBtn = document.querySelector("input[value='human']");
  const _computerRadioBtn = document.querySelector("input[value='computer']");
  const _startGameBtn = document.querySelector(".playerSelect-input .button");
  const _playerNameInputDiv = document.querySelector(".playerSelect-input");
  const _playerSelectChoices = document.querySelector(".playerSelect-choices");
  const _scoreboard = document.querySelector(".scoreboard");
  const _restartBtn = document.querySelector(".scoreboard .button");
  const _gameOverModal = document.querySelector(".gameOverModal");
  const _playAgainBtn = document.querySelector(".gameOverModal .button");
  const _playerOneName = document.querySelector(".playerOneName");
  const _playerTwoName = document.querySelector(".playerTwoName");
  const _playerOneInput = document.querySelector("#playerOne");
  const _playerTwoInput = document.querySelector("#playerTwo");

  const _bindEvents = () => {
    _humanRadioBtn.addEventListener("change", _toggleInputRow);
    _computerRadioBtn.addEventListener("change", _startGame);
    _startGameBtn.addEventListener("click", _startGame);
    _restartBtn.addEventListener("click", Game.resetGame);
    _playAgainBtn.addEventListener("click", Game.playAgain);
  };

  const _clearRadioBtns = () => {
    const radioBtns = document.querySelectorAll("input[type='radio']");

    for (let i = 0; i < radioBtns.length; i++) {
      radioBtns[i].checked = false;
    }
  };

  const _isComputerOpponent = (event) => event.target.value === "computer";

  const _setPlayerNames = (computer) => {
    if (computer) {
      _playerOneName.textContent = "Human";
      _playerTwoName.textContent = "Computer";
    } else {
      _playerOneName.textContent = _playerOneInput.value ||
          _playerOneInput.placeholder;
      _playerTwoName.textContent = _playerTwoInput.value ||
          _playerTwoInput.placeholder;
    }
  };

  const _startGame = (event) => {
    if (_isComputerOpponent(event)) {
      _setPlayerNames(true);
      _removeInputRow();
      Game.startGame("Human", "Computer");
    } else {
      _setPlayerNames();
      Game.startGame(_playerOneName.textContent, _playerTwoName.textContent);
      _toggleInputRow();
    }

    _clearRadioBtns();
    _togglePlayerSelect();
    _toggleScoreboard();
    _createTable(GameBoard.board);
    renderMoves();
  };

  const _removeInputRow = () => {
    _playerNameInputDiv.classList.add("playerSelect-input-hiding");
  };

  const _toggleInputRow = () => {
    _playerNameInputDiv.classList.toggle("playerSelect-input-hiding");
  };

  const _toggleScoreboard = () => {
    _scoreboard.classList.toggle("scoreboard-hiding");
  };

  const _togglePlayerSelect = () => {
    _playerSelectChoices.classList.toggle("playerSelect-choices-hiding");
  };

  const _toggleModal = () => {
    _gameOverModal.classList.toggle('gameOverModal-hiding');
  };

  const init = () => {
    _bindEvents();
  };

  const renderModal = (text) => {
    _gameOverModal.querySelector(".gameOverModal-title").textContent = text;
    _toggleModal();
  };

  const _clearInputFields = () => {
    _playerOneInput.value = '';
    _playerTwoInput.value = '';
  };

  const resetDisplay = () => {
    _clearInputFields();
    _toggleScoreboard();
    _togglePlayerSelect();
  };

  const replay = () => {
    _toggleModal();
    _createTable(GameBoard.board);
  };

  const renderMoves = () => {
    const _table = Array.from( document.querySelectorAll("td") );

    _table.forEach((cell, i) => {
      cell.id = i;
      cell.textContent = GameBoard.board[i];
      cell.addEventListener('click', Game.validateMove);
    });
  };

  const _createTable = (gameboard) => {
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
// * Computer keeps making moves, even after the winner has been declared
// * If you start the game against a human, then switch to a computer opponent,
//   the computer's move logic does not work. Actually, every time you restart
//   a game the computer's logic is broken.