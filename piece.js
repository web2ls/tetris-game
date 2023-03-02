class Piece {
  constructor(ctx) {
    this.ctx = ctx;
    this.prevTetronimo = [];

    const typeId = this.randomizeTetrominoType(COLORS.length);
    this.shape = SHAPES[typeId];
    this.color = COLORS[typeId];

    this.x = 3;
    this.y = 0;
  }

  randomizeTetrominoType(noOfTypes) {
    let value = Math.floor(Math.random() * noOfTypes);
    if (!this.prevTetronimo.includes(value)) {
      if (this.prevTetronimo.length > 4) {
        this.prevTetronimo.shift();
      }

      this.prevTetronimo.push(value);
      return value;
    } else {
      for (let i = 0; i < 4; i++) {
        value = Math.floor(Math.random() * noOfTypes);
        if (!this.prevTetronimo.includes(value)) {
          if (this.prevTetronimo.length > 4) {
            this.prevTetronimo.shift();
          }

          this.prevTetronimo.push(value);
          return value;
        }

        return value;
      }
    }
    return Math.floor(Math.random() * noOfTypes);
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
        }
      });
    });
  }

  move(p) {
    this.x = p.x;
    this.y = p.y;
    this.shape = p.shape;
  }
}