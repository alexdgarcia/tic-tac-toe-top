const PlayerFactory = (icon) => {
  return { icon };
};

const GameBoard = (() => {
  let board = [
    '', '', '',
    '', '', '',
    '', '', ''
  ];

  const updateBoard = (i, icon) => {
    board[i] = icon;
    displayController.renderBoard();
  };

  return { board, updateBoard };
})();

const Game = (() => {
  const _players = {
    playerOne: PlayerFactory("X"),
    playerTwo: PlayerFactory("O"),
  };
  let _currentMove = _players.playerOne.icon;

  const _setMove = (targetCell) => {
    GameBoard.updateBoard(targetCell.id, _currentMove);
    _currentMove = (_currentMove === _players.playerOne.icon) ?
        _players.playerTwo.icon : _players.playerOne.icon;
  };

  const isValidMove = (event) => {
    const targetCell = event.target;

    if (targetCell.textContent !== '') {
      return;
    }

    _setMove(targetCell);
  };

  return { isValidMove };
})();

const displayController = (() => {
  const _table = Array.from( document.querySelectorAll("td") );

  const renderBoard = () => {
    _table.forEach((cell, i) => {
      cell.id = i;
      cell.textContent = GameBoard.board[i];
      cell.addEventListener('click', Game.isValidMove);
    });
  };

  return { renderBoard };
})();