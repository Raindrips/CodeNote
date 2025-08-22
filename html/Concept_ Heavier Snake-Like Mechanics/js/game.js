// Game constants
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const PLAYER_START_SIZE = 20;
const PLAYER_START_MASS = 1;
const PLAYER_START_X = CANVAS_WIDTH / 2;
const PLAYER_START_Y = CANVAS_HEIGHT / 2;
const FOOD_SIZE = 10;
const OBSTACLE_COUNT = 5;
const MASS_INCREASE_PER_FOOD = 0.2;
const ACCELERATION_FORCE = 0.5;
const TURNING_FORCE = 0.3;
const FRICTION = 0.98;
const MAX_SPEED = 5;

// Game variables
let canvas, ctx;
let player;
let food = [];
let obstacles = [];
let score = 0;
let gameRunning = false;
let gameOver = false;
let keys = {};

// DOM elements
let scoreElement, massElement, startButton, restartButton, gameOverModal, finalScoreElement, playAgainButton;

// Initialize the game
window.onload = function() {
    // Get DOM elements
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    scoreElement = document.getElementById('score');
    massElement = document.getElementById('mass');
    startButton = document.getElementById('startButton');
    restartButton = document.getElementById('restartButton');
    gameOverModal = document.getElementById('gameOverModal');
    finalScoreElement = document.getElementById('finalScore');
    playAgainButton = document.getElementById('playAgainButton');
    
    // Set canvas dimensions
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    
    // Event listeners
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', restartGame);
    playAgainButton.addEventListener('click', restartGame);
    
    window.addEventListener('keydown', function(e) {
        keys[e.key] = true;
    });
    
    window.addEventListener('keyup', function(e) {
        keys[e.key] = false;
    });
    
    // Initial setup
    setupGame();
};

// Setup game elements
function setupGame() {
    // Create player
    player = {
        x: PLAYER_START_X,
        y: PLAYER_START_Y,
        size: PLAYER_START_SIZE,
        mass: PLAYER_START_MASS,
        velocityX: 0,
        velocityY: 0,
        color: '#4CAF50'
    };
    
    // Reset score
    score = 0;
    scoreElement.textContent = score;
    massElement.textContent = player.mass.toFixed(1);
    
    // Create obstacles
    createObstacles();
    
    // Create initial food
    createFood();
    
    // Draw initial state
    draw();
}

// Create random obstacles
function createObstacles() {
    obstacles = [];
    
    for (let i = 0; i < OBSTACLE_COUNT; i++) {
        const size = Math.random() * 30 + 20; // Random size between 20 and 50
        
        // Ensure obstacles don't spawn too close to player start position
        let x, y;
        let validPosition = false;
        
        while (!validPosition) {
            x = Math.random() * (CANVAS_WIDTH - size);
            y = Math.random() * (CANVAS_HEIGHT - size);
            
            // Check distance from player start position
            const distFromPlayer = Math.sqrt(
                Math.pow(x + size/2 - PLAYER_START_X, 2) + 
                Math.pow(y + size/2 - PLAYER_START_Y, 2)
            );
            
            if (distFromPlayer > 100) { // Minimum distance from player
                validPosition = true;
            }
        }
        
        obstacles.push({
            x: x,
            y: y,
            width: size,
            height: size,
            color: '#d32f2f'
        });
    }
}

// Create food at random position
function createFood() {
    let x, y;
    let validPosition = false;
    
    while (!validPosition) {
        x = Math.random() * (CANVAS_WIDTH - FOOD_SIZE);
        y = Math.random() * (CANVAS_HEIGHT - FOOD_SIZE);
        
        // Check if position overlaps with obstacles
        validPosition = true;
        for (let obstacle of obstacles) {
            if (
                x < obstacle.x + obstacle.width &&
                x + FOOD_SIZE > obstacle.x &&
                y < obstacle.y + obstacle.height &&
                y + FOOD_SIZE > obstacle.y
            ) {
                validPosition = false;
                break;
            }
        }
    }
    
    food = {
        x: x,
        y: y,
        size: FOOD_SIZE,
        color: '#FFC107'
    };
}

// Start the game
function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        gameOver = false;
        startButton.style.display = 'none';
        restartButton.style.display = 'inline-block';
        gameLoop();
    }
}

// Restart the game
function restartGame() {
    gameOverModal.style.display = 'none';
    setupGame();
    startGame();
}

// Game loop
function gameLoop() {
    if (!gameRunning) return;
    
    update();
    draw();
    
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

// Update game state
function update() {
    // Handle player movement based on physics
    handlePlayerMovement();
    
    // Check for collisions
    checkCollisions();
}

// Handle player movement with physics
function handlePlayerMovement() {
    // Apply forces based on key presses
    if (keys['ArrowUp']) {
        // Accelerate forward - constant regardless of mass
        player.velocityY -= ACCELERATION_FORCE;
    }
    
    if (keys['ArrowDown']) {
        // Accelerate backward - constant regardless of mass
        player.velocityY += ACCELERATION_FORCE;
    }
    
    if (keys['ArrowLeft']) {
        // Turn left - constant regardless of mass
        player.velocityX -= TURNING_FORCE;
    }
    
    if (keys['ArrowRight']) {
        // Turn right - constant regardless of mass
        player.velocityX += TURNING_FORCE;
    }
    
    // Apply friction - decreases as mass increases (heavier objects maintain momentum longer)
    const frictionFactor = FRICTION + ((1 - FRICTION) * (player.mass - 1) / 5);
    const adjustedFriction = Math.min(frictionFactor, 0.999); // Cap at 0.999 to ensure some minimal friction
    player.velocityX *= adjustedFriction;
    player.velocityY *= adjustedFriction;
    
    // Limit maximum speed based on mass
    const speed = Math.sqrt(player.velocityX * player.velocityX + player.velocityY * player.velocityY);
    const maxSpeedWithMass = MAX_SPEED / Math.sqrt(player.mass);
    
    if (speed > maxSpeedWithMass) {
        player.velocityX = (player.velocityX / speed) * maxSpeedWithMass;
        player.velocityY = (player.velocityY / speed) * maxSpeedWithMass;
    }
    
    // Update player position
    player.x += player.velocityX;
    player.y += player.velocityY;
    
    // Boundary checking
    if (player.x < 0) {
        player.x = 0;
        player.velocityX = -player.velocityX * 0.5; // Bounce with energy loss
    }
    
    if (player.x + player.size > CANVAS_WIDTH) {
        player.x = CANVAS_WIDTH - player.size;
        player.velocityX = -player.velocityX * 0.5; // Bounce with energy loss
    }
    
    if (player.y < 0) {
        player.y = 0;
        player.velocityY = -player.velocityY * 0.5; // Bounce with energy loss
    }
    
    if (player.y + player.size > CANVAS_HEIGHT) {
        player.y = CANVAS_HEIGHT - player.size;
        player.velocityY = -player.velocityY * 0.5; // Bounce with energy loss
    }
}

// Check for collisions
function checkCollisions() {
    // Check collision with food
    if (
        player.x < food.x + food.size &&
        player.x + player.size > food.x &&
        player.y < food.y + food.size &&
        player.y + player.size > food.y
    ) {
        // Increase score
        score++;
        scoreElement.textContent = score;
        
        // Increase player mass and size
        player.mass += MASS_INCREASE_PER_FOOD;
        player.size += MASS_INCREASE_PER_FOOD * 5;
        massElement.textContent = player.mass.toFixed(1);
        
        // Create new food
        createFood();
    }
    
    // Check collision with obstacles
    for (let obstacle of obstacles) {
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.size > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.size > obstacle.y
        ) {
            // Game over
            endGame();
            return;
        }
    }
}

// End the game
function endGame() {
    gameRunning = false;
    gameOver = true;
    finalScoreElement.textContent = score;
    gameOverModal.style.display = 'flex';
}

// Draw game elements
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw obstacles
    for (let obstacle of obstacles) {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }
    
    // Draw food
    ctx.fillStyle = food.color;
    ctx.beginPath();
    ctx.arc(food.x + food.size/2, food.y + food.size/2, food.size/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw player
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.arc(player.x + player.size/2, player.y + player.size/2, player.size/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw velocity vector (optional visual aid)
    if (gameRunning) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.moveTo(player.x + player.size/2, player.y + player.size/2);
        ctx.lineTo(
            player.x + player.size/2 + player.velocityX * 10,
            player.y + player.size/2 + player.velocityY * 10
        );
        ctx.stroke();
    }
}
