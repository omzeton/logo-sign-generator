const sW = 80;
const res = 100; // 100 = 4 :: 83 = 5 :: 70 = 6
const smo = 110;
const dim = {
    width: window.innerWidth - smo,
    height: window.innerHeight - smo,
};
let nField = [];

const primaryColor = "#131515";
const specialColor = "#C42021";

const getDirection = ({ x, xEdge, y, yEdge, res }) => {
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
        // 234
        directions.push(d[2]);
        directions.push(d[4]);
        // directions.push(d[3]);
    } else if (x === res && y > res && !yEdge) {
        // 01234
        directions.push(d[0]);
        directions.push(d[2]);
        directions.push(d[4]);
        // directions.push(d[1]);
        // directions.push(d[3]);
    } else if (x > res && !xEdge && y === res) {
        // 23456
        directions.push(d[2]);
        directions.push(d[4]);
        directions.push(d[6]);
        // directions.push(d[3]);
        // directions.push(d[5]);
    } else if (xEdge && y === res) {
        // 456
        directions.push(d[4]);
        directions.push(d[6]);
        // directions.push(d[5]);
    } else if (xEdge && y > res && !yEdge) {
        // 04567
        directions.push(d[0]);
        directions.push(d[4]);
        directions.push(d[6]);
        // directions.push(d[5]);
        // directions.push(d[7]);
    } else if (xEdge && yEdge) {
        // 067
        directions.push(d[0]);
        directions.push(d[6]);
        // directions.push(d[7]);
    } else if (x > res && !xEdge && yEdge) {
        // 01267
        directions.push(d[0]);
        directions.push(d[2]);
        directions.push(d[6]);
        // directions.push(d[1]);
        // directions.push(d[7]);
    } else if (x === res && yEdge) {
        // 012
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
    return directions;
};

function setup() {
    createCanvas(dim.width, dim.height);
    noLoop();
}

function draw() {
    frameRate(0.9);
    background("#E2D0C5");
    // drawShapes();
    gridTesting();
}

const gridTesting = () => {
    const { height, width } = dim;
    strokeWeight(10);
    stroke(primaryColor);
    for (let y = res; y < height - res; y += res) {
        for (let x = res; x < width - res; x += res) {
            // console.log("x % sth", (x - res) % 3);
            if ((x - res) % 3 === 0 && (y - res) % 3 === 0) {
                const yEdge = height - res * 2 <= y;
                const xEdge = width - res * 2 <= x;

                // # Method 1
                // const possibleXChoices = [x, x + res, x + res / 2, x - res, x - res / 2];
                // const possibleYChoices = [y, y + res, y + res / 2, y - res, y - res / 2];
                // for (let n = 0; n < 8; n++) {
                //     const randX = possibleXChoices[Math.floor(Math.random() * possibleXChoices.length)];
                //     const randY = possibleYChoices[Math.floor(Math.random() * possibleYChoices.length)];
                //     line(x, y, randX, randY);
                // }

                // # Method 2
                const directions = getDirection({ x, xEdge, y, yEdge, res });
                for (let n = 0; n < 3; n++) {
                    const d = directions[Math.floor(Math.random() * directions.length)];
                    line(x + res / 2, y + res / 2, d[0], d[1]);
                }

                // line(x, y, x, y + res);
                // line(x, y, x + res, y);
                // line(x + res, y, x + res, y + res);
                // line(x, y + res, x + res, y + res);
            }
        }
    }
};

const drawShapes = () => {
    strokeCap(PROJECT);
    strokeWeight(sW);
    for (let y = res; y < dim.height - res; y += res) {
        for (let x = res; x < dim.width - res; x += res) {
            const yEdge = dim.height - res * 2 <= y;
            const xEdge = dim.width - res * 2 <= x;
            const directions = getDirection({ x, xEdge, y, yEdge, res });
            const randDir = directions[Math.floor(Math.random() * directions.length)];
            if (randDir[0] === x && randDir[1] === y) {
                console.log("dot");
            } else {
                stroke(primaryColor);
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
