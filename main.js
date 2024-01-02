import { default as p5Class } from "p5";
import "./style.css";

import { exampleSignArr } from "./exampleSign";

const p5 = new p5Class(() => {});

const colorPalettes = [
  ["#0f0f0f"],
  ["#AD2E24"],
  ["#9BC995", "#5171A5"],
  ["#242038", "#F7ECE1", "#A167A5"],
  ["#0f0f0f", "#FEDB25"],
  ["#191923", "#0E79B2"],
  ["#E5E059", "#BDD358"],
  ["#54494B", "#91C7B1"],
];
let colorPaletteIndex = 0;

const regenerateBtn = document.getElementById("regenerate-button");
const saveBtn = document.getElementById("save-button");
const paletteBtn = document.getElementById("palette-button");

const _IS_RANDOM = true;

const r = 100;
const sw = 80;
const dimensions = 380;

let lineCoords = [];
let history = [];
let historyIndex = 0;

p5.setup = () => {
  p5.createCanvas(dimensions, dimensions);
  p5.strokeCap(p5.PROJECT);
  p5.strokeWeight(sw);
  generateShape();

  regenerateBtn.addEventListener("click", () => {
    generateShape();
  });

  saveBtn.addEventListener("click", () => {
    savePNG();
  });

  paletteBtn.addEventListener("click", () => {
    changeColorPalette();
  });
};

const generateShape = () => {
  lineCoords = [];
  if (_IS_RANDOM) {
    drawRandomShape();
  } else {
    drawShapeFromCoords(exampleSignArr);
  }
  if (history.length) {
    history.length = historyIndex + 1;
  }
  history.push(lineCoords);
  historyIndex = history.length - 1;
};

const drawRandomShape = () => {
  const colors = colorPalettes[colorPaletteIndex];
  p5.background("#fff");
  for (let y = sw / 2; y < dimensions; y += r) {
    for (let x = sw / 2; x < dimensions; x += r) {
      const xEdge = dimensions - r * 2 <= x;
      const yEdge = dimensions - r * 2 <= y;
      const d = [
        [x, y - r, "⬆"],
        [x + r, y, "➡"],
        [x, y + r, "⬇"],
        [x - r, y, "⬅"],
      ];
      const directions = [];
      if (x === r && y === r) {
        directions.push(d[1]);
        directions.push(d[2]);
      } else if (x === r && y > r && !yEdge) {
        directions.push(d[0]);
        directions.push(d[1]);
        directions.push(d[2]);
      } else if (x > r && !xEdge && y === r) {
        directions.push(d[1]);
        directions.push(d[2]);
        directions.push(d[3]);
      } else if (xEdge && y === r) {
        directions.push(d[2]);
        directions.push(d[3]);
      } else if (xEdge && y > r && !yEdge) {
        directions.push(d[0]);
        directions.push(d[2]);
        directions.push(d[3]);
      } else if (xEdge && yEdge) {
        directions.push(d[0]);
        directions.push(d[3]);
      } else if (x > r && !xEdge && yEdge) {
        directions.push(d[0]);
        directions.push(d[1]);
        directions.push(d[3]);
      } else if (x === r && yEdge) {
        directions.push(d[0]);
        directions.push(d[1]);
      } else {
        directions.push(d[0]);
        directions.push(d[1]);
        directions.push(d[2]);
        directions.push(d[3]);
      }
      const randDir = directions[Math.floor(Math.random() * directions.length)];
      if (randDir[0] !== x || randDir[1] !== y) {
        p5.stroke(colors[Math.floor(Math.random() * colors.length)]);
        p5.line(x, y, randDir[0], randDir[1]);
        lineCoords.push({
          x1: x,
          y1: y,
          x2: randDir[0],
          y2: randDir[1],
        });
      }
    }
  }
};

const drawShapeFromCoords = (linesArr) => {
  const colors = colorPalettes[colorPaletteIndex];
  p5.background("#fff");
  for (const { x1, y1, x2, y2 } of linesArr) {
    p5.stroke(colors[Math.floor(Math.random() * colors.length)]);
    p5.line(x1, y1, x2, y2);
  }
};

const changeColorPalette = () => {
  const colorsToChooseFrom = colorPalettes.length;
  if (colorPaletteIndex === colorsToChooseFrom - 1) {
    colorPaletteIndex = 0;
  } else {
    colorPaletteIndex++;
  }
  drawShapeFromCoords(lineCoords);
};

const savePNG = () => {
  const dateObj = new Date();
  const month = dateObj.getUTCMonth() + 1;
  const day = dateObj.getUTCDate();
  const year = dateObj.getUTCFullYear();
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const seconds = dateObj.getSeconds();
  const date = `${year}-${month}-${day}_${hours}:${minutes}:${seconds}`;

  p5.save(`${date}.png`);
};

p5.keyPressed = () => {
  if (history.length > 0) {
    if (p5.keyCode === 37) {
      undo();
    }
    if (p5.keyCode === 39) {
      redo();
    }
  }
};

const undo = () => {
  if (historyIndex > 0) {
    historyIndex--;
    const previousShape = history[historyIndex];
    drawShapeFromCoords(previousShape);
  }
};

const redo = () => {
  if (historyIndex < history.length - 1) {
    historyIndex++;
    const previousShape = history[historyIndex];
    drawShapeFromCoords(previousShape);
  }
};
