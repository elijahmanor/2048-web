import React, { useEffect } from "react";
import {
  flatten,
  random,
  sample,
  times,
  constant,
  concat,
  zip,
  uniqueId
} from "lodash";
import { wrapGrid } from "animate-css-grid";

const get2or4 = () =>
  sample(concat(times(5, constant(2)), times(5, constant(4))));

let score = 0;

export const getScore = () => score;

export const getHighScore = () => {
  const highScore = localStorage.getItem("highScore");
  if (highScore) {
    return parseInt(highScore, 10);
  }
  return 0;
};

let highScore = getHighScore();

export const setHighScore = value => {
  localStorage.setItem("highScore", value.toString());
};

export const hasAvailableSpaces = rows => flatten(rows).some(c => c.val === 0);

export const rowHasMoves = row => {
  let hasMoves = false;
  let cells = row.filter(c => c.val);
  let emptyCells = row.filter(c => !c.val);
  cells = [...cells, ...emptyCells];
  for (let i = 0; i < cells.length - 1; ++i) {
    if (cells[i].val === cells[i + 1].val) {
      hasMoves = true;
      break;
    }
  }
  return hasMoves;
};

export const hasAvailableMoves = rows => {
  let hasMoves = rows.some(row => rowHasMoves(row));
  if (!hasMoves) {
    rows = zip(...rows);
    hasMoves = rows.some(row => rowHasMoves(row));
  }
  return hasMoves;
};

export const resetRows = () => {
  const rows = Array.from({ length: 4 }, (_, rowIndex) =>
    Array.from({ length: 4 }, (_, colIndex) => ({
      id: `${rowIndex}:${colIndex}`,
      val: 0,
      isMerged: false,
      isNew: false
    }))
  );
  rows[random(3)][random(3)].val = get2or4();
  let randRow = random(3);
  let randCol = random(3);
  while (rows[randRow][randCol] === 2 || rows[randRow][randCol] === 4) {
    randRow = random(3);
    randCol = random(3);
  }
  rows[randRow][randCol].val = get2or4();
  return rows;
};

export const moveCells = (cells, direction) => {
  const filledCells = cells.filter(c => c.val);
  if (filledCells.length <= 4) {
    const emptyCells = Array.from({ length: 4 - filledCells.length }, () => ({
      id: uniqueId(),
      val: 0
    }));
    if (direction === "left") {
      cells = [...filledCells, ...emptyCells];
    } else if (direction === "right") {
      cells = [...emptyCells, ...filledCells];
    }
  }
  return cells;
};

export const mergeCells = (cells, direction) => {
  if (direction === "right") {
    for (let i = cells.length - 1; i > 0; --i) {
      cells[i].isMerged = false;
      if (cells[i].val === cells[i - 1].val) {
        cells[i].val = cells[i].val + cells[i - 1].val;
        cells[i].isMerged = true;
        score += cells[i].val;
        cells[i - 1].val = 0;
        cells = moveCells(cells, direction);
      }
    }
  } else if (direction === "left") {
    for (let i = 0; i < cells.length - 1; ++i) {
      cells[i].isMerged = false;
      if (cells[i].val === cells[i + 1].val) {
        cells[i].val = cells[i].val + cells[i + 1].val;
        cells[i].isMerged = true;
        score += cells[i].val;
        cells[i + 1].val = 0;
        cells = moveCells(cells, direction);
      }
    }
  }

  if (score > highScore) {
    setHighScore(score);
  }

  return cells;
};

export const addCell = rows => {
  let randRow = random(3);
  let randCol = random(3);
  while (rows[randRow][randCol].val !== 0) {
    randRow = random(3);
    randCol = random(3);
  }
  rows[randRow][randCol].val = get2or4();
  return rows;
};

export default function Grid({ rows }) {
  useEffect(() => {
    const grid = document.querySelector(".Grid");
    wrapGrid(grid);
  }, []);

  return (
    <div className="Grid">
      {flatten(rows).map(cell => (
        <div
          key={cell.id}
          className={` Cell Cell--${cell.val} ${
            cell.isMerged ? "Cell--merged" : ""
          }`}
        >
          {cell.val ? cell.val : ""}
        </div>
      ))}
    </div>
  );
}
