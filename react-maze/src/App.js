import "./App.css";
import { UnionFind } from "./union-find";
import SelectionInterface from "./SelectionInterface";
import { useState, useRef } from "react";

function App() {
  let [rows, setRows] = useState();
  let [cols, setCols] = useState();
  let unionFind = useRef(new UnionFind());
  let canvasRef = useRef();
  let ctxRef = useRef();

  const MAZE_DIMENSION = 600;
  let UNIT_SIZE;

  let horzBorderWalls = [];
  let vertBorderWalls = [];
  let vertWalls = [];
  let horzWalls = [];

  function initializeDimensions(rowInput, colInput) {
    setRows(rowInput);
    setCols(colInput);
    ctxRef.current = canvasRef.current.getContext("2d");
    //this will trigger rerender
  }

  // function createMaze() {}

  if (isNaN(rows) || isNaN(cols) || rows <= 0 || cols <= 0);
  else {
    ctxRef.current.clearRect(0, 0, MAZE_DIMENSION, MAZE_DIMENSION);
    UNIT_SIZE = MAZE_DIMENSION / Math.max(rows, cols);
    unionFind = new UnionFind(rows * cols);
    createBorderWalls();
    createWalls();
    buildMazeHard();
    drawWalls();
  }

  //stops when all cells are connected - creating lots of false paths
  function buildMazeHard() {
    while (!allCellsConnected()) {
      removeRandomWall();
    }
  }

  function allCellsConnected() {
    let root = unionFind.find(0);
    for (let i = 1; i < rows * cols; i++)
      if (unionFind.find(i) !== root) return false;

    return true;
  }

  function removeRandomWall() {
    let wallDirection = Math.floor(Math.random() * 2) === 0 ? "horz" : "vert";

    //randomly choose horizontal or vertical
    //don't allow it to be empty
    let directionWalls;
    do {
      directionWalls =
        Math.floor(Math.random() * 2) === 0 ? horzWalls : vertWalls;
    } while (directionWalls.length === 0);

    let wallIdx = Math.floor(Math.random() * directionWalls.length);
    let cellNum = findCell(directionWalls[wallIdx]);
    //depending on vorizontal or vertical, determine what neighboring cell is
    let otherCellNum =
      directionWalls === horzWalls ? cellNum - rows : cellNum - 1;

    if (unionFind.find(cellNum) !== unionFind.find(otherCellNum)) {
      unionFind.union(cellNum, otherCellNum);
      if (directionWalls === horzWalls)
        horzWalls = directionWalls.filter(
          (element) => element !== directionWalls[wallIdx]
        );
      else
        vertWalls = directionWalls.filter(
          (element) => element !== directionWalls[wallIdx]
        );
    }
  }

  function findCell(point) {
    return point.y * rows + point.x;
  }

  function drawWalls() {
    vertBorderWalls.forEach((point) => {
      drawWall(point.x, point.y, point.x, point.y + 1);
    });
    horzBorderWalls.forEach((point) =>
      drawWall(point.x, point.y, point.x + 1, point.y)
    );

    horzWalls.forEach((point) =>
      drawWall(point.x, point.y, point.x + 1, point.y)
    );
    vertWalls.forEach((point) =>
      drawWall(point.x, point.y, point.x, point.y + 1)
    );
  }

  function createBorderWalls() {
    for (let x = 0; x < rows; x++) {
      if (x !== 0) horzBorderWalls.push({ x, y: 0 });
      if (x !== rows - 1) horzBorderWalls.push({ x, y: cols });
    }

    for (let y = 0; y < cols; y++) {
      if (y !== 0) vertBorderWalls.push({ x: 0, y });
      if (y !== cols - 1) vertBorderWalls.push({ x: rows, y });
    }
  }

  function createWalls() {
    //horizontal walls

    for (let x = 0; x < rows; x++)
      for (let y = 1; y < cols; y++) {
        horzWalls.push({ x, y });
      }

    //vertical walls

    for (let y = 0; y < cols; y++)
      for (let x = 1; x < rows; x++) {
        vertWalls.push({ x, y });
      }
  }

  function drawWall(startX, startY, endX, endY) {
    ctxRef.current.lineWidth = 2;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(startX * UNIT_SIZE, startY * UNIT_SIZE);
    ctxRef.current.lineTo(endX * UNIT_SIZE, endY * UNIT_SIZE);
    ctxRef.current.stroke();
  }

  return (
    <>
      <SelectionInterface
        initializeDimensions={initializeDimensions}
      ></SelectionInterface>
      <div className="canvas-container">
        <canvas width="600" height="600" ref={canvasRef}></canvas>
      </div>
    </>
  );
}

export default App;
