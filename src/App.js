import { useState } from "react";

function Square({ itsAWinner, value, onSquareClick }) {
  return (
    <button
      className={itsAWinner ? "winner-square" : "square"}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  let emptySpace = false;
  if (winner) {
    status = "Winner: " + squares[winner[0]];
  } else {
    squares.forEach((square) => {
      if (square === null) {
        emptySpace = true;
      }
    });

    if (emptySpace) {
      status = "Next player: " + (xIsNext ? "X" : "O");
    } else {
      status = "It's a DRAW!!";
    }
  }

  let boardRows = [];

  for (let i = 0; i < 3; i++) {
    let row;
    let columns = [];

    for (let j = 0; j < 3; j++) {
      columns.push(
        <Square
          key={"square" + i * 3 + j}
          itsAWinner={winner && winner.includes(i * 3 + j)}
          value={squares[i * 3 + j]}
          onSquareClick={() => handleClick(i * 3 + j)}
        />
      );
    }
    row = (
      <div key={"board-row-" + i} className="board-row">
        {columns}
      </div>
    );
    boardRows.push(row);
  }

  return (
    <>
      <div key="status" className="status">
        {status}
      </div>
      {boardRows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [isHistoryReverse, setIsHistoryReverse] = useState(false);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;

    if (move > 0) {
      description =
        "Go to move ( " + calculateMovePosition(history, move) + " )";
    } else {
      description = "Go to game start";
    }

    if (move === currentMove) {
      if (move === 0) {
        return <li key="current-move">Game start</li>;
      }
      return (
        <li key="current-move">
          You are at the move ( {calculateMovePosition(history, move)})
        </li>
      );
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  function reverse() {
    setIsHistoryReverse(!isHistoryReverse);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        {isHistoryReverse ? (
          <ol reversed>{isHistoryReverse ? moves.reverse() : moves}</ol>
        ) : (
          <ol>{moves}</ol>
        )}
      </div>
      <div className="game-info">
        <button onClick={reverse}>
          {isHistoryReverse === true
            ? "Show asceding history"
            : "Show descending history"}
        </button>
      </div>
    </div>
  );
}

function calculateMovePosition(history, move) {
  if (move < 1) {
    return;
  }

  let lastMoves = history[move - 1];
  let currentMoves = history[move];

  for (let i = 0; i < lastMoves.length; i++) {
    if (lastMoves[i] !== currentMoves[i]) {
      let row = Math.floor(i / 3);
      let col = i % 3;
      return row + 1 + "," + (col + 1);
    }
  }
  return null;
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}
