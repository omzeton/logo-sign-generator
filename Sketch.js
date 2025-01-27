import { default as p5Class } from "p5";

class SketchHistory {
  historyIndex = 0;
  history = [];

  getCurrentPlaceInHistory() {
    return this.history[this.historyIndex];
  }

  pushToHistory(canvasState) {
    this.history.push(canvasState);
    this.historyIndex = this.history.length - 1;
  }

  changeHistoryIndex(changeType) {
    if (this.history.length === 0) {
      return;
    }
    if (changeType < 0 && this.historyIndex > 0) {
      this.historyIndex -= 1;
    }
    if (changeType > 0 && this.historyIndex < this.history.length - 1) {
      this.historyIndex += 1;
    }
  }
}

class SketchPalette {
  palettes = [
    ["#0f0f0f"],
    ["#AD2E24"],
    ["#9BC995", "#5171A5"],
    ["#242038", "#F7ECE1", "#A167A5"],
    ["#0f0f0f", "#FEDB25"],
    ["#191923", "#0E79B2"],
    ["#ff0000", "#00ff00", "#0000ff"],
    ["#E5E059", "#BDD358"],
    ["#54494B", "#91C7B1"],
  ];
  index = 0;

  changeColorPaletteIndex() {
    if (this.index === this.palettes.length - 1) {
      this.index = 0;
    } else {
      this.index++;
    }
    return this.palettes[this.index];
  }

  getCurrentColorPalette() {
    return this.palettes[this.index];
  }

  getCurrentColorPaletteIndex() {
    return this.index;
  }

  getRandomColorFromCurrentColorPalette() {
    const currentColorPalette = this.getCurrentColorPalette();
    return currentColorPalette[Math.floor(Math.random() * currentColorPalette.length)];
  }

  getRandomColorFromPaletteAtIndex(index) {
    const palette = this.palettes[index];
    return palette[Math.floor(Math.random() * palette.length)];
  }
}

export class Sketch {
  dimensions = 400;
  columns = 4;
  density = 1;
  gap = 0.2;
  connectionsProbability = 0.3;

  constructor() {
    this.eventButtons = {
      generate: document.getElementById("generate-button"),
      save: document.getElementById("save-button"),
      changePalette: document.getElementById("palette-button"),
      changeColumns: document.getElementById("columns-slider"),
      changeDensity: document.getElementById("density-slider"),
      changeConnections: document.getElementById("connections-slider"),
      changeGap: document.getElementById("gap-slider"),
    };
    this.p5 = new p5Class(() => {});
    this.History = new SketchHistory();
    this.Palette = new SketchPalette();
    this.init();
  }

  init() {
    this.p5.setup = () => {
      this.p5.createCanvas(this.dimensions, this.dimensions);
      this.p5.noStroke();
      this.p5.noSmooth();
      this.generateNewRandomShape();
    };

    this.eventButtons.generate.addEventListener("click", () => {
      this.generateNewRandomShape();
    });

    this.eventButtons.save.addEventListener("click", () => {
      this.saveSketchToPNG();
    });

    this.eventButtons.changePalette.addEventListener("click", () => {
      this.changeColorPalette();
    });

    this.eventButtons.changeColumns.addEventListener("change", (event) => {
      const sliderValue = Number(event.target.value);
      this.changeSketchColumns(sliderValue);
    });

    this.eventButtons.changeDensity.addEventListener("change", (event) => {
      const sliderValue = Number(event.target.value);
      this.changeSketchDensity(sliderValue);
    });

    this.eventButtons.changeConnections.addEventListener("change", (event) => {
      const sliderValue = Number(event.target.value);
      this.changeSketchConnectionsProbability(sliderValue);
    });

    this.eventButtons.changeGap.addEventListener("change", (event) => {
      const sliderValue = Number(event.target.value);
      this.changeSketchGap(sliderValue);
    });

    this.p5.keyPressed = () => {
      switch (this.p5.keyCode) {
        case 37:
          this.History.changeHistoryIndex(-1);
          this.generateShapeFromHistory();
          break;
        case 39:
          this.History.changeHistoryIndex(1);
          this.generateShapeFromHistory();
          break;
        default:
          break;
      }
    };
  }

  generateNewRandomShape() {
    this.p5.clear();
    const shape = {
      boxMatrix: [],
      connectionMatrix: [],
    };

    const totalCells = this.columns + (this.columns - 1) * this.gap;
    const squareSize = this.dimensions / totalCells;
    const gapSize = squareSize * this.gap;

    this.p5.push();
    for (let row = 0; row <= this.columns; row++) {
      for (let col = 0; col <= this.columns; col++) {
        if (this.getRandomBinary()) {
          const x = col * (squareSize + gapSize);
          const y = row * (squareSize + gapSize);
          shape.boxMatrix.push({ x, y, row, col });
          this.p5.fill(this.Palette.getRandomColorFromCurrentColorPalette());
          this.p5.rect(x, y, squareSize, squareSize);
        }
      }
    }
    this.p5.pop();

    for (const box of shape.boxMatrix) {
      const { x, y, row, col } = box;

      const neighbors = [
        { type: "top", dx: 0, dy: -1 },
        { type: "bottom", dx: 0, dy: 1 },
        { type: "left", dx: -1, dy: 0 },
        { type: "right", dx: 1, dy: 0 },
      ];

      for (const { type, dx, dy } of neighbors) {
        const neighborRow = row + dy;
        const neighborCol = col + dx;

        const neighborConnection = shape.boxMatrix.find(
          (neighbor) => neighbor.row === neighborRow && neighbor.col === neighborCol,
        );

        if (neighborConnection && this.getRandomBinary(this.connectionsProbability)) {
          this.p5.fill(this.Palette.getRandomColorFromCurrentColorPalette());
          const overlap = squareSize / 2;
          let rectCoords = [];
          switch (type) {
            case "top":
              rectCoords = [x, y - gapSize - overlap, squareSize, gapSize + overlap * 2];
              break;
            case "bottom":
              rectCoords = [x, y + squareSize - overlap, squareSize, gapSize + overlap * 2];
              break;
            case "left":
              rectCoords = [x - gapSize - overlap, y, gapSize + overlap * 2, squareSize];
              break;
            case "right":
              rectCoords = [x + squareSize - overlap, y, gapSize + overlap * 2, squareSize];
              break;
          }
          this.p5.rect(...rectCoords);
          shape.connectionMatrix.push([...rectCoords]);
        }
      }
    }

    this.History.pushToHistory({
      boxMatrix: shape.boxMatrix,
      connectionMatrix: shape.connectionMatrix,
      columns: this.columns,
    });
  }

  generateShapeFromHistory() {
    const shape = this.History.getCurrentPlaceInHistory();

    this.p5.clear();

    const totalCells = shape.columns + (shape.columns - 1) * this.gap;
    const squareSize = this.dimensions / totalCells;

    this.p5.push();
    for (const { x, y } of shape.boxMatrix) {
      this.p5.fill(this.Palette.getRandomColorFromCurrentColorPalette());
      this.p5.rect(x, y, squareSize, squareSize);
    }
    for (const connection of shape.connectionMatrix) {
      this.p5.fill(this.Palette.getRandomColorFromCurrentColorPalette());
      this.p5.rect(...connection);
    }
    this.p5.pop();
  }

  getRandomBinary(value) {
    const probabiliy = value || this.density;
    if (probabiliy < 0 || probabiliy > 1) {
      throw new Error("Probability must be a float between 0 and 1.");
    }
    return Math.random() < probabiliy ? 1 : 0;
  }

  saveSketchToPNG() {
    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1;
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const seconds = dateObj.getSeconds();
    const date = `${year}-${month}-${day}_${hours}:${minutes}:${seconds}`;
    this.p5.save(`${date}.png`);
  }

  changeColorPalette() {
    this.Palette.changeColorPaletteIndex();
    this.generateShapeFromHistory();
  }

  changeSketchColumns(value) {
    this.columns = value;
    this.generateNewRandomShape();
  }

  changeSketchDensity(value) {
    this.density = value / 10;
    this.generateNewRandomShape();
  }

  changeSketchConnectionsProbability(value) {
    this.connectionsProbability = value / 10;
    this.generateNewRandomShape();
  }

  changeSketchGap(value) {
    this.gap = value / 10;
    this.generateShapeFromHistory();
  }
}
