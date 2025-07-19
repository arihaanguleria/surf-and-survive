const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let score = 0;
let time = 0;
let windDir = 0; // 0: right, 1: left
let windArrow = ['→', '←'];

const uiScore = document.getElementById('score');
const uiTimer = document.getElementById('timer');
const uiWind = document.getElementById('wind');
const uiWindMeter = document.getElementById('wind-meter');

// Player (windsurfer) properties
const player = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    width: 40,
    height: 20,
    color: '#f9c74f',
    speed: 4
};

// Obstacles (buoys)
const obstacles = [];

// Obstacle spawn control (timer-based)
let spawnInterval = 1.0; // seconds between obstacles (starts at 1s)
let minSpawnInterval = 0.000001; // minimum interval (very fast)
let spawnTimer = 0;
let difficulty = 1; // increases as player advances

const keys = {};

function drawPlayer() {
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.fillStyle = player.color;
    ctx.fillRect(-player.width/2, -player.height/2, player.width, player.height);
    // Sail
    ctx.beginPath();
    ctx.moveTo(0, -player.height/2);
    ctx.lineTo(0, -player.height/2 - 30);
    ctx.strokeStyle = '#577590';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.restore();
}

function drawObstacles() {
    for (const obs of obstacles) {
        ctx.beginPath();
        ctx.arc(obs.x, obs.y, obs.radius, 0, 2 * Math.PI);
        ctx.fillStyle = obs.color;
        ctx.fill();
        ctx.strokeStyle = '#293241';
        ctx.stroke();
    }
}

function updatePlayer() {
    if (keys['ArrowLeft'] || keys['a']) player.x -= player.speed;
    if (keys['ArrowRight'] || keys['d']) player.x += player.speed;
    if (keys['ArrowUp'] || keys['w']) player.y -= player.speed;
    if (keys['ArrowDown'] || keys['s']) player.y += player.speed;
    // Boundaries
    player.x = Math.max(player.width/2, Math.min(canvas.width - player.width/2, player.x));
    player.y = Math.max(player.height/2, Math.min(canvas.height - player.height/2, player.y));
}

function updateUI() {
    uiScore.textContent = `Score: ${score}`;
    uiTimer.textContent = `Time: ${time}s`;
    uiWind.textContent = `Wind: ${windArrow[windDir]}`;
    uiWindMeter.textContent = ` | Interval: ${spawnInterval.toFixed(6)}s`;
}

let lastFrameTime = performance.now();
let gamePaused = false;
let freeplayMode = false;

function gameLoop() {
    if (gamePaused) return;
    const now = performance.now();
    const deltaTime = (now - lastFrameTime) / 1000; // in seconds
    lastFrameTime = now;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateObstacles(deltaTime);
    drawObstacles();
    drawPlayer();
    updatePlayer();
    checkCollision();
    updateUI();
    requestAnimationFrame(gameLoop);
}

function checkCollision() {
    if (freeplayMode) return;
    for (const obs of obstacles) {
        const dx = player.x - obs.x;
        const dy = player.y - obs.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < obs.radius + Math.max(player.width, player.height) / 2) {
            // Collision detected
            pauseGame();
            break;
        }
    }
}

function pauseGame() {
    gamePaused = true;
    document.getElementById('restart-overlay').style.display = 'flex';
}

function restartGame() {
    // Reset all game state
    score = 0;
    time = 0;
    spawnInterval = 1.0;
    difficulty = 1;
    spawnTimer = 0;
    obstacles.length = 0;
    player.x = canvas.width / 2;
    player.y = canvas.height - 100;
    document.getElementById('restart-overlay').style.display = 'none';
    document.getElementById('win-overlay').style.display = 'none';
    gamePaused = false;
    lastFrameTime = performance.now();
    gameLoop();
}

// Freeplay toggle logic
function toggleFreeplay() {
    freeplayMode = !freeplayMode;
    const btn = document.getElementById('freeplay-toggle');
    btn.textContent = 'Freeplay Mode: ' + (freeplayMode ? 'On' : 'Off');
    btn.classList.toggle('on', freeplayMode);
}

function winGame() {
    gamePaused = true;
    document.getElementById('win-overlay').style.display = 'flex';
}

// Wire up UI
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('restart-btn').onclick = restartGame;
    document.getElementById('freeplay-toggle').onclick = toggleFreeplay;
    document.getElementById('win-restart-btn').onclick = restartGame;
});

// AI-driven obstacle generation and movement
function updateObstacles(deltaTime) {
    // Move obstacles down (relative to player moving up)
    for (const obs of obstacles) {
        obs.y += player.speed * 0.8 + difficulty; // Move faster as difficulty increases
    }
    // Remove obstacles that go off screen
    for (let i = obstacles.length - 1; i >= 0; i--) {
        if (obstacles[i].y - obstacles[i].radius > canvas.height) {
            obstacles.splice(i, 1);
        }
    }
    // Timer-based obstacle spawning
    spawnTimer += deltaTime;
    // Exponential decrease: reach minSpawnInterval after 600 seconds
    spawnInterval = 1.0 * Math.pow(minSpawnInterval / 1.0, time / 600);
    if (spawnInterval < minSpawnInterval) spawnInterval = minSpawnInterval;
    if (spawnTimer >= spawnInterval) {
        spawnObstacle();
        spawnTimer = 0;
        // Win condition: interval reached minimum
        if (spawnInterval <= minSpawnInterval + 1e-9) {
            winGame();
            return;
        }
        difficulty += 0.02;
    }
}

function spawnObstacle() {
    const minX = 40, maxX = canvas.width - 40;
    const x = Math.random() * (maxX - minX) + minX;
    const y = -30; // spawn above the screen
    const radius = 18 + Math.random() * 8;
    const color = '#ee6c4d';
    obstacles.push({ x, y, radius, color });
}

// Timer
setInterval(() => {
    time++;
}, 1000);

document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

gameLoop();
