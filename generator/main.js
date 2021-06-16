const sW = 80;
const res = 100; // 100 = 4 :: 83 = 5 :: 70 = 6
const smo = 110;
const dim = {
    width: window.innerWidth - smo,
    height: window.innerHeight - smo,
};
let nField = [];

const cP = ["#131515", "#C42021"];

function setup() {
    createCanvas(dim.width, dim.height);
    noLoop();
}

function draw() {
    frameRate(0.9);
    background("#E2D0C5");
    for (let i = 0; i < 1; i++) {
        drawShapes();
    }
}

const drawShapes = () => {
    strokeCap(PROJECT);
    strokeWeight(sW);
    for (let y = res; y < dim.height - res; y += res) {
        for (let x = res; x < dim.width - res; x += res) {
            const yEdge = dim.height - res * 2 <= y;
            const xEdge = dim.width - res * 2 <= x;
            const d = [
                /* 0 */ [x, y - res, "⬆"],
                /* 1 */ [x + res, y - res, "↗"],
                /* 2 */ [x + res, y, "➡"],
                /* 3 */ [x + res, y + res, "↘"],
                /* 4 */ [x, y + res, "⬇"],
                /* 5 */ [x - res, y + res, "↙"],
                /* 6 */ [x - res, y, "⬅"],
                /* 7 */ [x - res, y - res, "↖"],
            ];
            const directions = [];
            if (x === res && y === res) {
                directions.push(d[2]);
                directions.push(d[4]);
            } else if (x === res && y > res && !yEdge) {
                directions.push(d[0]);
                directions.push(d[2]);
                directions.push(d[4]);
            } else if (x > res && !xEdge && y === res) {
                directions.push(d[2]);
                directions.push(d[4]);
                directions.push(d[6]);
            } else if (xEdge && y === res) {
                directions.push(d[4]);
                directions.push(d[6]);
            } else if (xEdge && y > res && !yEdge) {
                directions.push(d[0]);
                directions.push(d[4]);
                directions.push(d[6]);
            } else if (xEdge && yEdge) {
                directions.push(d[0]);
                directions.push(d[6]);
            } else if (x > res && !xEdge && yEdge) {
                directions.push(d[0]);
                directions.push(d[2]);
                directions.push(d[6]);
            } else if (x === res && yEdge) {
                // 012
                directions.push(d[0]);
                directions.push(d[2]);
            } else {
                directions.push(d[0]);
                directions.push(d[2]);
                directions.push(d[4]);
                directions.push(d[6]);
            }
            const randDir = directions[Math.floor(Math.random() * directions.length)];
            if (randDir[0] === x && randDir[1] === y) {
                console.log("dot");
            } else {
                stroke(cP[Math.floor(Math.random() * cP.length)]);
                line(x, y, randDir[0], randDir[1]);
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
        save(`${date}.png`);
    }
}
