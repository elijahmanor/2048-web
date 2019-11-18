import React, { useEffect, useState } from "react";
import { isEqual, zip, cloneDeep } from "lodash";
import { Swipeable } from "react-swipeable";
import { faHome, faRedo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Grid, {
  resetRows,
  moveCells,
  mergeCells,
  hasAvailableSpaces,
  hasAvailableMoves,
  addCell,
  getHighScore,
  getScore
} from "./Grid";

import "./App.css";

function App() {
  const [rows, setRows] = useState(resetRows());

  const goLeft = grid => {
    grid = grid.map(row => {
      row = moveCells(row, "left");
      row = mergeCells(row, "left");
      return row;
    });
    if (!isEqual(grid, rows) && hasAvailableSpaces(grid)) {
      grid = addCell(grid);
    }
    setRows(grid);
  };
  const goRight = grid => {
    grid = grid.map(row => {
      row = moveCells(row, "right");
      row = mergeCells(row, "right");
      return row;
    });
    if (!isEqual(grid, rows) && hasAvailableSpaces(grid)) {
      grid = addCell(grid);
    }
    setRows(grid);
  };
  const goUp = grid => {
    grid = zip(...grid);
    grid = grid.map(row => {
      row = moveCells(row, "left");
      row = mergeCells(row, "left");
      return row;
    });
    grid = zip(...grid);
    if (!isEqual(grid, rows) && hasAvailableSpaces(grid)) {
      grid = addCell(grid);
    }
    setRows(grid);
  };
  const goDown = grid => {
    grid = zip(...grid);
    grid = grid.map(row => {
      row = moveCells(row, "right");
      row = mergeCells(row, "right");
      return row;
    });
    grid = zip(...grid);
    if (!isEqual(grid, rows) && hasAvailableSpaces(grid)) {
      grid = addCell(grid);
    }
    setRows(grid);
  };
  const handleSwipe = e => {
    let grid = cloneDeep(rows);
    switch (e.dir) {
      case "Left":
        goLeft(grid);
        break;
      case "Right":
        goRight(grid);
        break;
      case "Up":
        goUp(grid);
        break;
      case "Down":
        goDown(grid);
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    let grid = cloneDeep(rows);
    const handleKeyDown = e => {
      switch (e.key) {
        case "ArrowLeft":
          goLeft(grid);
          break;
        case "ArrowRight":
          goRight(grid);
          break;
        case "ArrowUp":
          goUp(grid);
          break;
        case "ArrowDown":
          goDown(grid);
          break;
        default:
          break;
      }
    };
    document.addEventListener("keydown", handleKeyDown, false);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [rows, goLeft, goRight, goUp, goDown]);
  const isGameOver = !hasAvailableMoves(rows) && !hasAvailableSpaces(rows);
  return (
    <div className="App">
      <div className="NavBar">
        <div className="NavBar-title">2048</div>
        <div>
          <span>Score: </span>
          <span>{getScore()}</span>
        </div>
        <div>
          <span>High Score: </span>
          <span>{getHighScore()}</span>
        </div>
        <div>
          <FontAwesomeIcon icon={faRedo} />
        </div>
      </div>
      <Swipeable onSwiped={handleSwipe}>
        <Grid rows={rows} />
      </Swipeable>
      {isGameOver && (
        <div className="Status">{isGameOver ? "Game Over" : ""}</div>
      )}
    </div>
  );
}

export default App;
