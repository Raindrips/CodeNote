// Tetris Game Logic
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const COLORS = [
    'cyan',    // I
    'blue',    // J
    'orange',  // L
    'yellow',  // O
    'green',   // S
    'purple',  // T
    'red'      // Z
];

// Tetromino shapes defined in 4x4 grid
const SHAPES = [
    // I
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    // J
    [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    // L
    [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    // O
    [
        [1, 1],
        [1, 1]
    ],
    // S
    [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    // T
    [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    // Z
    [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ]
];

// Game variables
let canvas;
let ctx;
let nextPieceCanvas;
let nextPieceCtx;
let board;
let piece;
let nextPiece;
let score = 0;
let level = 1;
let lines = 0;
let gameOver = false;
let isPaused = false;
let dropStart;
let gameSpeed = 1000; // Initial speed in milliseconds
let requestId;
let gameStarted = false; // Track if game has started
let pieceGenerated = false; // Track if a new piece has been generated

// DOM elements
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const linesElement = document.getElementById('lines');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
const restartButton = document.getElementById('restart-button');

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('game-board');
    ctx = canvas.getContext('2d');
    
    nextPieceCanvas = document.getElementById('next-piece');
    nextPieceCtx = nextPieceCanvas.getContext('2d');
    
    // Event listeners for buttons
    startButton.addEventListener('click', startGame);
    pauseButton.addEventListener('click', togglePause);
    restartButton.addEventListener('click', restartGame);
    
    // Event listeners for keyboard controls
    document.addEventListener('keydown', handleKeyPress);
    
    // Initialize the game board
    initBoard();
    
    // Draw empty board initially
    drawBoard();
});

// Initialize the game board
function initBoard() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

// Create a new piece
function createPiece(shape = Math.floor(Math.random() * SHAPES.length)) {
    return {
        shape: SHAPES[shape],
        color: COLORS[shape],
        x: Math.floor(COLS / 2) - Math.floor(SHAPES[shape][0].length / 2),
        y: 0,
        shapeIndex: shape
    };
}

// Draw a square on the canvas
function drawSquare(x, y, color, context = ctx, size = BLOCK_SIZE) {
    if (!context) return; // Safety check
    
    context.fillStyle = color;
    context.fillRect(x * size, y * size, size, size);
    
    context.strokeStyle = '#222';
    context.strokeRect(x * size, y * size, size, size);
    
    // Add a 3D effect
    context.fillStyle = 'rgba(255, 255, 255, 0.3)';
    context.beginPath();
    context.moveTo(x * size, y * size);
    context.lineTo((x + 1) * size, y * size);
    context.lineTo(x * size, (y + 1) * size);
    context.fill();
    
    context.fillStyle = 'rgba(0, 0, 0, 0.1)';
    context.beginPath();
    context.moveTo((x + 1) * size, y * size);
    context.lineTo((x + 1) * size, (y + 1) * size);
    context.lineTo(x * size, (y + 1) * size);
    context.fill();
}

// Draw the board
function drawBoard() {
    if (!ctx || !board) return; // Safety check
    
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (board[y][x]) {
                drawSquare(x, y, COLORS[board[y][x] - 1]);
            } else {
                // Draw empty cell
                ctx.fillStyle = '#111';
                ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeStyle = '#333';
                ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

// Draw the current piece
function drawPiece(p = piece, context = ctx, blockSize = BLOCK_SIZE) {
    if (!p || !context) return; // Safety check
    
    const shape = p.shape;
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x]) {
                drawSquare(p.x + x, p.y + y, p.color, context, blockSize);
            }
        }
    }
}

// Draw the next piece preview
function drawNextPiece() {
    if (!nextPiece || !nextPieceCtx || !nextPieceCanvas) return; // Safety check
    
    // Clear the next piece canvas
    nextPieceCtx.fillStyle = '#111';
    nextPieceCtx.fillRect(0, 0, nextPieceCanvas.width, nextPieceCanvas.height);
    
    // Calculate the block size for the next piece preview
    const previewBlockSize = 25;
    
    // Create a temporary piece for preview
    const previewPiece = {
        shape: nextPiece.shape,
        color: nextPiece.color,
        x: 0,
        y: 0
    };
    
    // Center the piece in the preview canvas
    previewPiece.x = Math.floor((nextPieceCanvas.width / previewBlockSize - previewPiece.shape[0].length) / 2);
    previewPiece.y = Math.floor((nextPieceCanvas.height / previewBlockSize - previewPiece.shape.length) / 2);
    
    // Draw the next piece
    drawPiece(previewPiece, nextPieceCtx, previewBlockSize);
}

// Check for collision
function collision(p = piece) {
    if (!p || !board) return false; // Safety check
    
    const shape = p.shape;
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x]) {
                const newX = p.x + x;
                const newY = p.y + y;
                
                // Check boundaries
                if (newX < 0 || newX >= COLS || newY >= ROWS) {
                    return true;
                }
                
                // Skip checks above the board
                if (newY < 0) {
                    continue;
                }
                
                // Check if there's already a piece on the board
                if (board[newY][newX]) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Lock the piece on the board
function lockPiece() {
    if (!piece || !board) return; // Safety check
    
    const shape = piece.shape;
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x]) {
                const newY = piece.y + y;
                
                // Game over if piece locks above the board
                if (newY < 0) {
                    gameOver = true;
                    cancelAnimationFrame(requestId);
                    document.removeEventListener('keydown', handleKeyPress);
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = 'white';
                    ctx.font = '30px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
                    gameStarted = false; // Reset game started flag
                    return;
                }
                
                // Lock the piece on the board (value is shapeIndex + 1 to avoid 0)
                board[newY][piece.x + x] = piece.shapeIndex + 1;
            }
        }
    }
    
    // Check for completed lines
    checkLines();
    
    // Get the next piece
    piece = nextPiece;
    nextPiece = createPiece();
    pieceGenerated = true; // Mark that a new piece has been generated
    drawNextPiece();
}

// Check for completed lines
function checkLines() {
    if (!board) return; // Safety check
    
    let linesCleared = 0;
    
    for (let y = ROWS - 1; y >= 0; y--) {
        let isLineComplete = true;
        
        for (let x = 0; x < COLS; x++) {
            if (!board[y][x]) {
                isLineComplete = false;
                break;
            }
        }
        
        if (isLineComplete) {
            // Remove the line
            board.splice(y, 1);
            // Add a new empty line at the top
            board.unshift(Array(COLS).fill(0));
            // Increment lines cleared
            linesCleared++;
            // Check the same line again (since we moved everything down)
            y++;
        }
    }
    
    // Update score and level
    if (linesCleared > 0) {
        // Scoring system: more points for clearing multiple lines at once
        const points = [40, 100, 300, 1200]; // Points for 1, 2, 3, 4 lines
        score += points[linesCleared - 1] * level;
        lines += linesCleared;
        
        // Level up every 10 lines
        level = Math.floor(lines / 10) + 1;
        
        // Update game speed
        gameSpeed = Math.max(100, 1000 - (level - 1) * 100);
        
        // Update UI
        if (scoreElement) scoreElement.textContent = score;
        if (levelElement) levelElement.textContent = level;
        if (linesElement) linesElement.textContent = lines;
    }
}

// Move the piece down
function moveDown() {
    if (!piece) return false; // Safety check
    
    piece.y++;
    if (collision()) {
        piece.y--;
        lockPiece();
        return false;
    }
    return true;
}

// Move the piece left
function moveLeft() {
    if (!piece) return false; // Safety check
    
    piece.x--;
    if (collision()) {
        piece.x++;
        return false;
    }
    return true;
}

// Move the piece right
function moveRight() {
    if (!piece) return false; // Safety check
    
    piece.x++;
    if (collision()) {
        piece.x--;
        return false;
    }
    return true;
}

// Rotate the piece
function rotate() {
    if (!piece) return false; // Safety check
    
    const oldShape = piece.shape;
    
    // Create a new rotated shape
    const newShape = [];
    for (let x = 0; x < oldShape[0].length; x++) {
        newShape.push([]);
        for (let y = oldShape.length - 1; y >= 0; y--) {
            newShape[x].push(oldShape[y][x]);
        }
    }
    
    // Save the old shape
    const oldPieceShape = piece.shape;
    
    // Try the rotation
    piece.shape = newShape;
    
    // If there's a collision, revert back
    if (collision()) {
        piece.shape = oldPieceShape;
        return false;
    }
    
    return true;
}

// Hard drop the piece
function hardDrop() {
    if (!piece) return; // Safety check
    
    while (moveDown()) {
        // Keep moving down until collision
    }
}

// Handle keyboard controls
function handleKeyPress(event) {
    if (gameOver || isPaused || !gameStarted) return;
    
    switch (event.keyCode) {
        case 37: // Left arrow
            moveLeft();
            break;
        case 39: // Right arrow
            moveRight();
            break;
        case 40: // Down arrow
            moveDown();
            break;
        case 38: // Up arrow
            rotate();
            break;
        case 32: // Space
            hardDrop();
            break;
        case 80: // P key
            togglePause();
            break;
    }
    
    // Redraw the game
    draw();
}

// Draw the game
function draw() {
    if (!ctx || !canvas) return; // Safety check
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the board
    drawBoard();
    
    // Draw the current piece
    if (piece) {
        drawPiece();
    }
}

// Game loop
function gameLoop(timestamp) {
    if (gameOver || isPaused) return;
    
    if (!dropStart) dropStart = timestamp;
    
    const deltaTime = timestamp - dropStart;
    
    if (deltaTime > gameSpeed) {
        moveDown();
        dropStart = timestamp;
        
        // If a new piece was generated, reset the flag and continue immediately
        // This ensures continuous falling of blocks one after another
        if (pieceGenerated) {
            pieceGenerated = false;
            dropStart = timestamp - gameSpeed; // Force immediate next drop
        }
    }
    
    draw();
    
    // Continue the game loop - always request next animation frame while game is active
    requestId = requestAnimationFrame(gameLoop);
}

// Start the game
function startGame() {
    if (!gameStarted) {
        // Reset game variables
        score = 0;
        level = 1;
        lines = 0;
        gameSpeed = 1000;
        gameOver = false;
        isPaused = false;
        gameStarted = true; // Set game as started
        pieceGenerated = false; // Reset piece generated flag
        
        // Update UI
        if (scoreElement) scoreElement.textContent = score;
        if (levelElement) levelElement.textContent = level;
        if (linesElement) linesElement.textContent = lines;
        
        // Initialize the board
        initBoard();
        
        // Create the first piece and next piece
        piece = createPiece();
        nextPiece = createPiece();
        drawNextPiece();
        
        // Start the game loop
        dropStart = null;
        
        // Cancel any existing animation frame
        if (requestId) {
            cancelAnimationFrame(requestId);
        }
        
        requestId = requestAnimationFrame(gameLoop);
        
        // Enable keyboard controls
        document.addEventListener('keydown', handleKeyPress);
    }
}

// Toggle pause
function togglePause() {
    if (gameOver || !gameStarted) return;
    
    isPaused = !isPaused;
    
    if (isPaused) {
        cancelAnimationFrame(requestId);
        requestId = null;
        
        // Show pause message
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
        
        pauseButton.textContent = 'Resume';
    } else {
        pauseButton.textContent = 'Pause';
        dropStart = null;
        requestId = requestAnimationFrame(gameLoop);
    }
}

// Restart the game
function restartGame() {
    // Cancel the current game loop
    if (requestId) {
        cancelAnimationFrame(requestId);
        requestId = null;
    }
    
    // Reset game state
    gameOver = false;
    isPaused = false;
    gameStarted = false;
    pieceGenerated = false;
    
    // Clear the board
    initBoard();
    
    // Draw empty board
    drawBoard();
    
    // Start a new game
    startGame();
}
