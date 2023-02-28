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
}