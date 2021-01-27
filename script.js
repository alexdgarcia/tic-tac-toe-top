// =====================================
// PlayerFactory
// =====================================
const PlayerFactory = (marker) => {
  return { marker };
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

  return {
    board,
    updateBoard,
  };
})();

// =====================================
// Game
// =====================================
const Game = (() => {
  const _players = {
    playerOne: PlayerFactory("X"),
    playerTwo: PlayerFactory("O"),
  };
  let _currentMove = _players.playerOne.marker;

  const _setMove = (targetCell) => {
    GameBoard.updateBoard(targetCell.id, _currentMove);
    _currentMove = (_currentMove === _players.playerOne.marker) ?
        _players.playerTwo.marker : _players.playerOne.marker;
  };

  const isValidMove = (event) => {
    const targetCell = event.target;

    if (targetCell.textContent !== '') {
      return;
    }

    _setMove(targetCell);
  };

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
    isValidMove,
    declareWinner,
    calculateWinner
  };
})();

// =====================================
// DisplayController
// =====================================
const DisplayController = (() => {
  const _table = Array.from( document.querySelectorAll("td") );

  // TODO
  const _init = () => {
    GameBoard.board.fill('');
    document.querySelector(".modal-hiding").classList.remove('modal-showing');
    renderBoard();
  };

  const renderBoard = () => {
    _table.forEach((cell, i) => {
      cell.id = i;
      cell.textContent = GameBoard.board[i];
      cell.addEventListener('click', Game.isValidMove);
    });
  };

  const renderModal = (text) => {
    document.querySelector(".modal-hiding").classList.add('modal-showing');
    document.querySelector(".modal-modalHeaderTitle").textContent = text;
    document.querySelector('.button').addEventListener("click", _init);
  };

  return {
    renderBoard,
    renderModal,
  };
})();

DisplayController.renderBoard();