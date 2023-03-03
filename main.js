const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;

ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

let board;
let requestId;
let time = { start: 0, elapsed: 0, level: 1000 };

const moves = {
  [KEY.LEFT]: (p) => ({ ...p, x: p.x - 1 }),
  [KEY.RIGHT]: (p) => ({ ...p, x: p.x + 1 }),
  [KEY.DOWN]: (p) => ({ ...p, y: p.y + 1 }),
  [KEY.UP]: (p) => board.rotate(p),
  [KEY.SPACE]: (p) => ({ ...p, y: p.y + 1 })
};

function drop() {
  let p = moves[KEY.DOWN](this.piece);

  if (this.valid(p)) {
    this.piece.move(p);
  } else {
    this.freeze();
    this.piece = new Piece(this.ctx);
  }
}

function animate(now = 0) {
  time.elapsed = now - time.start;

  if (time.elapsed > time.level) {
    time.start = now;

    if (!board.drop()) {
      gameOver();
      return;
    }
  }

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  draw();
  requestId = requestAnimationFrame(animate);
}

function addEventListener() {
  document.removeEventListener('keydown', handleKeyPress);
  document.addEventListener('keydown', handleKeyPress);
}

function play() {
  board = new Board(ctx);
  addEventListener();

  // If we have an old game running then cancel it
  if (requestId) {
    cancelAnimationFrame(requestId);
  }

  time.start = performance.now();
  animate();
}

function draw() {
  const { width, height } = ctx.canvas;
  ctx.clearRect(0, 0, width, height);

  board.draw();
  board.piece.draw();
}

function handleKeyPress(event) {
  event.preventDefault();

  if (moves[event.keyCode]) {
    let p = moves[event.keyCode](board.piece);

    if (event.keyCode === KEY.SPACE) {
      while (board.valid(p)) {
        board.piece.move(p);
        p = moves[KEY.SPACE](board.piece);
      }
    }

    if (board.valid(p)) {
      board.piece.move(p);
    }

  }
}

function gameOver() {
  cancelAnimationFrame(requestId);

  ctx.fillStyle = 'black';
  ctx.fillRect(1, 3, 8, 1.2);
  ctx.font = '1px Arial';
  ctx.fillStyle = 'red';
  ctx.fillText('GAME OVER', 1.8, 4);
}