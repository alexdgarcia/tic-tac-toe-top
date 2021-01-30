// =====================================
// PlayerFactory
// =====================================
const PlayerFactory = (name) => {
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
    DisplayController.renderBoard();
    Game.calculateWinner();
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

  const validateMove = (event) => {
    const targetSquare = event.target;

    if (!_isEmptySquare(targetSquare)) {
      return;
    }

    _setMove(targetSquare);
  }

  const _isEmptySquare = (targetCell) => {
    if (targetCell.textContent !== '') {
      return false;
    }

    return true;
  };

  const _setMove = (targetCell) => {
    GameBoard.updateBoard(targetCell.id, _currentMove.marker);
    _currentMove = (_currentMove === _players[0]) ? _players[1] :
        _players[0];
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

    winningLines.forEach((el) => {
      const [a, b, c] = el;

      if (GameBoard.board[a] && GameBoard.board[a] === GameBoard.board[b] &&
          GameBoard.board[a] === GameBoard.board[c]) {
            declareWinner(GameBoard.board[a]);
      }

      // if every index has a marker but the above has not executed, it's a draw
      if ( GameBoard.board.every(cell => cell !== '') ) {
        declareWinner("Draw");
      }

      return;
    });
  };

  const declareWinner = (marker) => {
    const text = (marker === "Draw") ? "Game ends in DRAW" :
        (marker === "X") ? "Player 1 wins!" : "Player 2 wins!";
    DisplayController.renderModal(text);
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
  const _scoreboardInput = document.querySelector(".scoreboard-input");
  const _scoreboardActive = document.querySelector(".scoreboard-active");
  const _scoreBoardSelect = document.querySelector(".scoreboard-playerSelect");
  const _playerOneName = document.querySelector(".playerOneName");
  const _playerTwoName = document.querySelector(".playerTwoName");
  const _playerOneInput = document.querySelector("#playerOne");
  const _playerTwoInput = document.querySelector("#playerTwo");
  const _table = Array.from( document.querySelectorAll("td") );

  const _bindEvents = () => {
    document.querySelector("input[value='human']")
        .addEventListener("change", _toggleInputRow);
    document.querySelector("input[value='computer']")
        .addEventListener("change", _startGame);
    document.querySelector(".scoreboard-input .button")
        .addEventListener("click", _startGame);
    document.querySelector(".scoreboard-active .button")
        .addEventListener("click", Game.resetGame);
    document.querySelector(".modal-modalBody .button")
        .addEventListener("click", Game.playAgain);
  };

  const _startGame = (event) => {
    if (event.target.value === "computer") {
      _playerOneName.textContent = "Human";
      _playerTwoName.textContent = "Computer";

      Game.startGame("Human", "Computer");
      _togglePlayerSelect();
    } else {
      const playerOne  = (_playerOneInput.value) ? _playerOneInput.value :
          _playerOneInput.placeholder;
      const playerTwo = (_playerTwoInput.value) ? _playerTwoInput.value :
          _playerTwoInput.placeholder;

      Game.startGame(playerOne, playerTwo);
      _playerOneName.textContent = playerOne;
      _playerTwoName.textContent = playerTwo;
      _toggleInputRow();
    }

    _togglePlayerSelect();
    _toggleActiveRow();
    renderBoard();
  };

  const _toggleInputRow = () => {
    _scoreboardInput.classList.toggle("scoreboard-input-hiding");
  };

  const _toggleActiveRow = () => {
    _scoreboardActive.classList.toggle("scoreboard-active-hiding");
  };

  const _togglePlayerSelect = () => {
    _scoreBoardSelect.classList.toggle("scoreboard-playerSelect-hiding");
  };

  const init = () => {
    _bindEvents();
  };

  const renderBoard = () => {
    _table.forEach((cell, i) => {
      cell.id = i;
      cell.textContent = GameBoard.board[i];
      cell.addEventListener('click', Game.validateMove);
    });
  };

  const renderModal = (text) => {
    document.querySelector(".modal-hiding").classList.add('modal-showing');
    document.querySelector(".modal-modalHeaderTitle").textContent = text;
  };

  const _clearInputFields = () => {
    _playerOneInput.value = '';
    _playerTwoInput.value = '';
  };

  const resetDisplay = () => {
    _clearInputFields();
    _toggleActiveRow();
    _toggleInputRow();
    renderBoard();
  };

  const replay = () => {
    document.querySelector(".modal-hiding").classList.remove('modal-showing');
    renderBoard();
  };

  return {
    renderBoard,
    renderModal,
    resetDisplay,
    replay,
    init
  };
})();

DisplayController.init();