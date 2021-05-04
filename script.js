let origBoard;
let huPlayer = "O";
let aiPlayer = "X";
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [0, 3, 6],
];

const cells = document.querySelectorAll(".cell");
startGame();

function selectSym(sym) {
  huPlayer = sym;
  aiPlayer = sym === "O" ? "X" : "O";
  origBoard = Array.from(Array(9).keys());
  for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener("click", turnClick, false);
  }
  if (aiPlayer === "X") {
    turn(bestSpot(), aiPlayer);
  }
  document.querySelector(".selectSym").style.display = "none";
}

function startGame() {
  document.querySelector(".endgame").style.display = "none";
  //This is a fancy way of adding the numbers 0 to 9 in the array. It is going to create an array of 9 elements.
  // origBoard = Array.from(Array(9).keys());
  document.querySelector(".endgame .text").innerText = "";
  //   console.log(origBoard);
  document.querySelector(".selectSym").style.display = "block";
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].style.removeProperty("background-color");
  }
}

function turnClick(clickedSquare) {
  //   console.log(clickedSquare.target.id);
  if (typeof origBoard[clickedSquare.target.id] === "number") {
    turn(clickedSquare.target.id, huPlayer);
    if (!checkWin(origBoard, huPlayer) && !checkTie())
      turn(bestSpot(), aiPlayer);
  }
}

function turn(clickedSquareId, player) {
  origBoard[clickedSquareId] = player;
  document.getElementById(clickedSquareId).innerHTML = player;
  let gameWon = checkWin(origBoard, player);
  if (gameWon) gameOver(gameWon);
  checkTie();
}

function checkWin(board, player) {
  // To find all the places in the board where it is already played or occupied. 'accumulator' is the value that we get in the end. We are initializing the 'accumulator' with an empty array.'element' is the item of the board that we are currently going through. If the current 'element' is equal to the 'player' then we are going to concat the 'index' which means that we are going to take the accumulator array and add the 'index' to that array. If the current 'element' doesn't match with the 'player' then we are going to return 'accumulator' just as it was and not add anything to it. This is a way to find out the indexes where the 'player' has played in.
  let plays = board.reduce(
    (accumulator, element, index) =>
      element === player ? accumulator.concat(index) : accumulator,
    []
  );
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every((elem) => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player === huPlayer ? "blue" : "red";
  }
  for (let i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick, false);
  }
  declareWinner(gameWon.player === huPlayer ? "You win!" : "You lose");
}

function declareWinner(whoWon) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = whoWon;
}

function emptySquares() {
  return origBoard.filter((element) => typeof element === "number");
}

function bestSpot() {
  // return emptySquares()[0];
  return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
  if (emptySquares().length === 0) {
    for (cell of cells) {
      cell.style.backgroundColor = "green";
      cell.removeEventListener("click", turnClick, false);
    }
    declareWinner("Tie game");
    return true;
  }
  return false;
}

function minimax(newBoard, player) {
  var availSpots = emptySquares(newBoard);

  if (checkWin(newBoard, huPlayer)) {
    return { score: -10 };
  } else if (checkWin(newBoard, aiPlayer)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }

  var moves = [];
  for (let i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player === aiPlayer) move.score = minimax(newBoard, huPlayer).score;
    else move.score = minimax(newBoard, aiPlayer).score;
    newBoard[availSpots[i]] = move.index;
    if (
      (player === aiPlayer && move.score === 10) ||
      (player === huPlayer && move.score === -10)
    )
      return move;
    else moves.push(move);
  }

  let bestMove, bestScore;
  if (player === aiPlayer) {
    bestScore = -1000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    bestScore = 1000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}
