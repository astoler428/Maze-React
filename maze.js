import { UnionFind } from "./union-find.js";

let rowInput = document.getElementById("rows");
let colInput = document.getElementById("cols");
let createMazeBtn = document.getElementById("create-maze-btn");

createMazeBtn.addEventListener("click", createMaze);

let mazeCanvas = document.getElementById("maze");
let ctx = mazeCanvas.getContext("2d");

let NUM_ROWS;
let NUM_COLS;
let UNIT_SIZE; //previous = 25;
let unionFind;
let horzBorderWalls = [];
let vertBorderWalls = [];
let vertWalls = [];
let horzWalls = [];
const MAZE_DIMENSION = 600; //previously

function createMaze() {
  if (
    isNaN(rowInput.value) ||
    isNaN(colInput.value) ||
    rowInput.value <= 0 ||
    colInput.val <= 0
  )
    return;
  ctx.clearRect(0, 0, MAZE_DIMENSION, MAZE_DIMENSION);
  NUM_ROWS = rowInput.value;
  NUM_COLS = colInput.value;
  UNIT_SIZE = MAZE_DIMENSION / Math.max(NUM_ROWS, NUM_COLS);
  unionFind = new UnionFind(NUM_ROWS * NUM_COLS);

  createBorderWalls();
  createWalls();
  buildMazeHard();
  drawWalls();
}

//stops when there exists a path from start to finish

function buildMazeEasy() {
  while (unionFind.find(0) !== unionFind.find(NUM_ROWS * NUM_COLS - 1)) {
    removeRandomWall();
  }
}

//stops when all cells are connected - creating lots of false paths
function buildMazeHard() {
  while (!allCellsConnected()) {
    removeRandomWall();
  }
}

function allCellsConnected() {
  let root = unionFind.find(0);
  for (let i = 1; i < NUM_ROWS * NUM_COLS; i++)
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
    directionWalls === horzWalls ? cellNum - NUM_ROWS : cellNum - 1;

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
  return point.y * NUM_ROWS + point.x;
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
  for (let x = 0; x < NUM_ROWS; x++) {
    if (x !== 0) horzBorderWalls.push({ x, y: 0 });
    if (x !== NUM_ROWS - 1) horzBorderWalls.push({ x, y: NUM_COLS });
  }

  for (let y = 0; y < NUM_COLS; y++) {
    if (y !== 0) vertBorderWalls.push({ x: 0, y });
    if (y !== NUM_COLS - 1) vertBorderWalls.push({ x: NUM_ROWS, y });
  }
}

function createWalls() {
  //horizontal walls

  for (let x = 0; x < NUM_ROWS; x++)
    for (let y = 1; y < NUM_COLS; y++) {
      horzWalls.push({ x, y });
    }

  //vertical walls

  for (let y = 0; y < NUM_COLS; y++)
    for (let x = 1; x < NUM_ROWS; x++) {
      vertWalls.push({ x, y });
    }
}

function drawWall(startX, startY, endX, endY) {
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(startX * UNIT_SIZE, startY * UNIT_SIZE);
  ctx.lineTo(endX * UNIT_SIZE, endY * UNIT_SIZE);
  ctx.stroke();
}

//comment code more
//add slider for size of maze! which changes the unit size
