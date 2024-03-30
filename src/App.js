import { useState } from "react";

function useHover() {
  const [hovering, setHovering] = useState(false);
  const onHoverProps = {
    onMouseEnter: () => setHovering(true),
    onMouseLeave: () => setHovering(false),
  };
  return [hovering, onHoverProps];
}

function Square({
  emptySpace,
  cell,
  itsAWinner,
  value,
  onSquareClick,
  xIsNext,
}) {
  const [buttonAIsHovering, buttonAHoverProps] = useHover();

  let currentClass = "label";

  if (value === null && buttonAIsHovering && xIsNext && emptySpace) {
    currentClass = "mark--x-hover";
  } else if (value === null && buttonAIsHovering && !xIsNext && emptySpace) {
    currentClass = "mark--o-hover";
  } else if (value === "mark-x") {
    currentClass = "mark--x";
  } else if (value === "mark-o") {
    currentClass = "mark--o";
  }
  return (
    <>
      <div
        onClick={onSquareClick}
        className={"cell cell--" + cell}
        {...buttonAHoverProps}
      >
        {xIsNext && buttonAIsHovering && value === null && emptySpace ? (
          <>
            <label className="mark--x-1-hover"></label>
            <label className="mark--x-2-hover"></label>
          </>
        ) : value === "mark-x" ? (
          <>
            <label className="mark--x-1"></label>
            <label className="mark--x-2"></label>
          </>
        ) : (
          <label className={currentClass}></label>
        )}
      </div>
    </>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "mark-x";
    } else {
      nextSquares[i] = "mark-o";
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
    let row = [];
    let columns = [];

    for (let j = 0; j < 3; j++) {
      columns.push(
        <Square
          key={"square" + i * 3 + j}
          cell={i * 3 + j + 1}
          itsAWinner={winner && winner.includes(i * 3 + j)}
          value={squares[i * 3 + j]}
          onSquareClick={() => handleClick(i * 3 + j)}
          xIsNext={xIsNext}
          emptySpace={emptySpace}
        />
      );
    }
    row.push(columns);
    boardRows.push(row);
  }

  return <>{boardRows}</>;
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
    <form>
      <h1 class="title">React tic-tac-toe game!</h1>
      <div className="board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
    </form>
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
