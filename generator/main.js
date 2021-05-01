const sW = 80;
const dim = 501;
const res = 100; // 100 = 4 :: 83 = 5 :: 70 = 6
let nField = [];
let noise = null;

// const cP = ["#256eff","#46237a","#3ddc97","#f5d41d","#ff495c"];
// const cP = ['#f0f0f0', '#FEDB25'];
// const cP = ['#f0f0f0'];
const cP = ['#0f0f0f'];

function setup() {
    createCanvas(dim, dim, SVG);
    // noFill();
    // background('#0f0f0f');
    noise = new SimplexNoise(Date.now());
    for (let i = 0; i < 1; i++) {
        drawShapes();
    }
};


const drawShapes = () => {
    strokeCap(PROJECT);
    strokeWeight(sW);
    for (let y = res; y < dim - res; y += res) {
        for (let x = res; x < dim - res; x += res) {
            const xEdge = dim - res * 2 <= x;
            const yEdge = dim - res * 2 <= y;
            const d = [
                /* 0 */ [x, y - res, '⬆'],
                /* 1 */ [x + res, y - res, '↗'],
                /* 2 */ [x + res, y, '➡'],
                /* 3 */ [x + res, y + res, '↘'],
                /* 4 */ [x, y + res, '⬇'],
                /* 5 */ [x - res, y + res, '↙'],
                /* 6 */ [x - res, y, '⬅'],
                /* 7 */ [x - res, y - res, '↖'],
            ];
            const directions = [];
            if (x === res && y === res) { // 234
                directions.push(d[2]);
                directions.push(d[4]);
                // directions.push(d[3]);
            } else if (x === res && (y > res && !yEdge)) { // 01234
                directions.push(d[0]);
                directions.push(d[2]);
                directions.push(d[4]);
                // directions.push(d[1]);
                // directions.push(d[3]);
            } else if ((x > res && !xEdge) && y === res) { // 23456
                directions.push(d[2]);
                directions.push(d[4]);
                directions.push(d[6]);
                // directions.push(d[3]);
                // directions.push(d[5]);
            } else if (xEdge && y === res) { // 456
                directions.push(d[4]);
                directions.push(d[6]);
                // directions.push(d[5]);
            } else if (xEdge && (y > res && !yEdge)) { // 04567
                directions.push(d[0]);
                directions.push(d[4]);
                directions.push(d[6]);
                // directions.push(d[5]);
                // directions.push(d[7]);
            } else if (xEdge && yEdge) { // 067
                directions.push(d[0]);
                directions.push(d[6]);
                // directions.push(d[7]);
            } else if ((x > res && !xEdge) && yEdge) { // 01267
                directions.push(d[0]);
                directions.push(d[2]);
                directions.push(d[6]);
                // directions.push(d[1]);
                // directions.push(d[7]);
            } else if (x === res && yEdge) { // 012
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
            if (randDir[0] === x && randDir[1] === y) {
                console.log("dot");
            } else {
                stroke(cP[Math.floor(Math.random() * cP.length)]);
                line(
                    x,
                    y,
                    randDir[0],
                    randDir[1],
                );
                // filter(BLUR, 5);
            }
        }
    }
};

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
};