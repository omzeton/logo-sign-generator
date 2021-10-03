const sW = 80;
const dim = 501;
const res = 100;
const cP = ['#0f0f0f'];

const drawShapes = () => {
  strokeCap(PROJECT);
  strokeWeight(sW);
  for (let y = res; y < dim - res; y += res) {
    for (let x = res; x < dim - res; x += res) {
      const xEdge = dim - res * 2 <= x;
      const yEdge = dim - res * 2 <= y;
      const d = [
        [x, y - res, '⬆'],
        [x + res, y - res, '↗'],
        [x + res, y, '➡'],
        [x + res, y + res, '↘'],
        [x, y + res, '⬇'],
        [x - res, y + res, '↙'],
        [x - res, y, '⬅'],
        [x - res, y - res, '↖'],
      ];
      const directions = [];
      if (x === res && y === res) {
        directions.push(d[2]);
        directions.push(d[4]);
        // directions.push(d[3]);
      } else if (x === res && (y > res && !yEdge)) {
        directions.push(d[0]);
        directions.push(d[2]);
        directions.push(d[4]);
        // directions.push(d[1]);
        // directions.push(d[3]);
      } else if ((x > res && !xEdge) && y === res) {
        directions.push(d[2]);
        directions.push(d[4]);
        directions.push(d[6]);
        // directions.push(d[3]);
        // directions.push(d[5]);
      } else if (xEdge && y === res) {
        directions.push(d[4]);
        directions.push(d[6]);
        // directions.push(d[5]);
      } else if (xEdge && (y > res && !yEdge)) {
        directions.push(d[0]);
        directions.push(d[4]);
        directions.push(d[6]);
        // directions.push(d[5]);
        // directions.push(d[7]);
      } else if (xEdge && yEdge) {
        directions.push(d[0]);
        directions.push(d[6]);
        // directions.push(d[7]);
      } else if ((x > res && !xEdge) && yEdge) {
        directions.push(d[0]);
        directions.push(d[2]);
        directions.push(d[6]);
        // directions.push(d[1]);
        // directions.push(d[7]);
      } else if (x === res && yEdge) {
        directions.push(d[0]);
        directions.push(d[2]);
        // directions.push(d[1]);
      } else {
        directions.push(d[0]);
        directions.push(d[2]);
        directions.push(d[4]);
        directions.push(d[6]);
        // directions.push(d[5]);
        // directions.push(d[1]);
        // directions.push(d[3]);
        // directions.push(d[7]);
      }
      const randDir = directions[Math.floor(Math.random() * directions.length)];
      if (!(randDir[0] === x && randDir[1] === y)) {
        stroke(cP[Math.floor(Math.random() * cP.length)]);
        line(x, y, randDir[0], randDir[1]);
      }
    }
  }
};

// eslint-disable-next-line no-unused-vars
function setup() {
  // 'SVG' var comes from p5.js-svg package
  // eslint-disable-next-line no-undef
  createCanvas(dim, dim, SVG);
  for (let i = 0; i < 1; i += 1) {
    drawShapes();
  }
}

// eslint-disable-next-line no-unused-vars
function keyPressed() {
  const dateObj = new Date();
  const month = dateObj.getUTCMonth() + 1;
  const day = dateObj.getUTCDate();
  const year = dateObj.getUTCFullYear();
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const seconds = dateObj.getSeconds();
  const date = `${year}-${month}-${day}---${hours}-${minutes}-${seconds}`;

  if (keyCode === 80) {
    save(`${date}.svg`);
  }
}
