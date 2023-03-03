class Board {
  constructor(ctx) {
    this.ctx = ctx;
    this.grid = this.getEmptyBoard();
    this.piece = new Piece(ctx);
  }

  getEmptyBoard() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }

  rotate(p) {
    // Clone with JSON
    let clone = JSON.parse(JSON.stringify(p));

    // Transpose matrix, p is the Piece
    for (let y = 0; y < clone.shape.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [clone.shape[x][y], clone.shape[y][x]] = [clone.shape[y][x], clone.shape[x][y]];
      }
    }

    // Reverse the order of the columns.  
    clone.shape.forEach(row => row.reverse());

    return clone;
  }

  isInsideWalls(x, y) {
    return (
      x >= 0 &&   // Left wall
      x < COLS && // Right wall
      y < ROWS // Floor
    )
  }

  isNotOccupied(x, y) {
    return this.grid[y] && this.grid[y][x] === 0;
  }

  valid(p) {
    return p.shape.every((row, dy) => {
      return row.every((value, dx) => {
        let x = p.x + dx;
        let y = p.y + dy;
        return value === 0 || (this.isInsideWalls(x, y) && this.isNotOccupied(x, y));
      });
    });
  }

  freeze() {
    this.piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.grid[y + this.piece.y][x + this.piece.x] = value;
        }
      });
    });
    console.table(this.grid);
  }

  draw() {
    this.grid.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.ctx.fillStyle = COLORS[value - 1];
          this.ctx.fillRect(x, y, 1, 1);
        }
      });
    });
  }

  clearLines() {
    this.grid.forEach((row, y) => {
      // If every value is greater than zero then we have a full row.  
      if (row.every(value => value > 0)) {
        // Remove the row.  
        this.grid.splice(y, 1);

        // Add zero-filled row at the top.   
        this.grid.unshift(Array(COLS).fill(0));
      }
    });
  }

  drop() {
    let p = moves[KEY.DOWN](this.piece);

    if (this.valid(p)) {
      this.piece.move(p);
    } else {
      this.freeze();

      this.clearLines();

      if (this.piece.y === 0) { // Game over
        return false;
      }

      this.piece = new Piece(this.ctx);
    }

    return true;
  }
}