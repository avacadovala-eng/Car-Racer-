let player, road, scoreEl;
let enemies = [];
let score = 0;
let gameInterval = null;
let speed = 5;
let keys = {};

// Initialize game
window.onload = () => {
  player = document.getElementById("player");
  road = document.getElementById("road");
  scoreEl = document.getElementById("score");

  document.addEventListener("keydown", e => keys[e.key] = true);
  document.addEventListener("keyup", e => keys[e.key] = false);
};

function startGame() {
  if (gameInterval) return;
  score = 0;
  enemies.forEach(e => e.remove());
  enemies = [];
  gameInterval = setInterval(gameLoop, 30);
}

function resetGame() {
  clearInterval(gameInterval);
  gameInterval = null;
  score = 0;
  scoreEl.textContent = score;
  enemies.forEach(e => e.remove());
  enemies = [];
  player.style.left = "180px";
}

function gameLoop() {
  moveRoad();
  handleControls();
  moveEnemies();
  spawnEnemies();
  updateScore();
  checkCollisions();
}

// Road scroll
let roadY = 0;
function moveRoad() {
  roadY += speed;
  if (roadY >= 600) roadY = 0;
  road.style.top = -roadY + "px";
}

// Player movement
function handleControls() {
  let x = parseInt(player.style.left || "180");
  if (keys["ArrowLeft"] && x > 0) x -= 5;
  if (keys["ArrowRight"] && x < 360) x += 5;
  player.style.left = x + "px";
}

// Enemy movement
function moveEnemies() {
  enemies.forEach((enemy, i) => {
    enemy.style.top = (parseInt(enemy.style.top) + speed) + "px";
    if (parseInt(enemy.style.top) > 600) {
      enemy.remove();
      enemies.splice(i, 1);
    }
  });
}

// Spawn new enemies
function spawnEnemies() {
  if (Math.random() < 0.05) { // 5% chance each frame
    let enemy = document.createElement("img");
    enemy.src = "assets/car-enemy.png";
    enemy.className = "enemy";
    enemy.style.left = (Math.floor(Math.random() * 8) * 50) + "px"; // snap to lane
    enemy.style.top = "-80px";
    document.getElementById("gameContainer").appendChild(enemy);
    enemies.push(enemy);
  }
}

// Score
function updateScore() {
  score++;
  scoreEl.textContent = score;
}

// Collision detection
function checkCollisions() {
  let playerRect = player.getBoundingClientRect();
  enemies.forEach(enemy => {
    let enemyRect = enemy.getBoundingClientRect();
    if (!(playerRect.right < enemyRect.left ||
          playerRect.left > enemyRect.right ||
          playerRect.bottom < enemyRect.top ||
          playerRect.top > enemyRect.bottom)) {
      alert("💥 Game Over! Final Score: " + score);
      resetGame();
    }
  });
}
