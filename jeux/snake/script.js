const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

// --- GET AUDIO ELEMENTS ---
const bgMusic = document.getElementById('bgMusic');
const eatSound = document.getElementById('eatSound');
const gameOverSound = document.getElementById('gameOverSound');
const muteBtn = document.getElementById('muteBtn'); // NOUVEAU

// --- BAISSER LES VOLUMES PAR DÉFAUT ---
bgMusic.volume = 0.3;       // NOUVEAU (Musique de fond à 30%)
eatSound.volume = 0.6;      // NOUVEAU (Effets sonores à 60%)
gameOverSound.volume = 0.6; // NOUVEAU

const gridSize = 20;
let tileCount = canvas.width / gridSize;
let score = 0;

let snake = [{ x: 10, y: 10 }];
let velocity = { x: 0, y: 0 };
let food = { x: 15, y: 15 };

let gameOver = false;
let gameStarted = false;
let isMuted = false; // NOUVEAU

// Main Game Loop
function gameLoop() {
    if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'red';
        ctx.font = '50px "VT323"';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
        
        ctx.font = '30px "VT323"';
        ctx.fillText('Press Enter to Restart', canvas.width / 2, canvas.height / 2 + 40);
        return;
    }

    update();
    draw();
    setTimeout(gameLoop, 1000 / 10);
}

// Update game state
function update() {
    if (velocity.x === 0 && velocity.y === 0) {
        return;
    }

    const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };
    snake.unshift(head); 

    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        bgMusic.pause();
        gameOverSound.play();
        gameOver = true;
        return;
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            bgMusic.pause();
            gameOverSound.play();
            gameOver = true;
            return;
        }
    }

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.innerText = score;
        eatSound.currentTime = 0;
        eatSound.play();
        generateFood();
    } else {
        snake.pop(); 
    }
}

// Draw everything on the canvas
function draw() {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'red';
    for (let segment of snake) {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    }

    ctx.fillStyle = '#F08080';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

// Generate new food
function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);

    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood(); 
            break;
        }
    }
}

// Control
document.addEventListener('keydown', e => {
    if (!gameStarted) {
        // Ne démarre la musique que si elle n'est pas en mode "mute"
        if (!isMuted) bgMusic.play(); // NOUVEAU (vérifie isMuted)
        gameStarted = true;
    }

    switch (e.key) {
        case 'ArrowUp':
            if (velocity.y === 0) velocity = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (velocity.y === 0) velocity = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (velocity.x === 0) velocity = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (velocity.x === 0) velocity = { x: 1, y: 0 };
            break;
        case 'Enter':
            if (gameOver) {
                snake = [{ x: 10, y: 10 }];
                velocity = { x: 0, y: 0 };
                score = 0;
                scoreElement.innerText = score;
                gameOver = false;
                generateFood();
                bgMusic.currentTime = 0;
                // Ne redémarre la musique que si elle n'est pas en mode "mute"
                if (!isMuted) bgMusic.play(); // NOUVEAU (vérifie isMuted)
                gameLoop(); 
            }
            break;
    }
});

// --- NOUVELLE FONCTION POUR LE MUTE ---
function toggleMute() {
    isMuted = !isMuted; // Inverse l'état
    
    if (isMuted) {
        bgMusic.volume = 0;
        eatSound.volume = 0;
        gameOverSound.volume = 0;
        bgMusic.pause(); // Coupe aussi la musique si elle joue
        muteBtn.innerText = "🔇 Unmute"; // Change le texte du bouton
    } else {
        // Restaure les volumes
        bgMusic.volume = 0.3;
        eatSound.volume = 0.6;
        gameOverSound.volume = 0.6;
        // Redémarre la musique si le jeu est en cours
        if (gameStarted && !gameOver) bgMusic.play();
        muteBtn.innerText = "🔊 Mute"; // Remet le texte original
    }
}

// Ajoute l'écouteur d'événement au bouton
muteBtn.addEventListener('click', toggleMute); // NOUVEAU

// Start the game
generateFood();
gameLoop();