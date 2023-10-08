import "./style.css";
import { default as p5Class } from "p5";

const p5 = new p5Class(() => {});

// const colors = ["#256eff", "#46237a", "#3ddc97", "#f5d41d", "#ff495c"];
const colors = ["#0f0f0f", "#FEDB25"];
// const colors = ["#0f0f0f"];

const sw = 80;
const dimensions = 380;
const r = 100;

p5.setup = () => {
  p5.createCanvas(dimensions, dimensions);
  p5.strokeCap(p5.PROJECT);
  p5.strokeWeight(sw);
  for (let i = 0; i < 1; i++) {
    drawShapes();
  }
};

const drawShapes = () => {
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
      }
    }
  }
};

p5.keyPressed = () => {
  const dateObj = new Date();
  const month = dateObj.getUTCMonth() + 1;
  const day = dateObj.getUTCDate();
  const year = dateObj.getUTCFullYear();
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const seconds = dateObj.getSeconds();
  const date = `${year}-${month}-${day}_${hours}:${minutes}:${seconds}`;

  if (p5.keyCode === 83) {
    p5.save(`${date}.png`);
  }
};