// Car objects
const car1 = { el: document.getElementById("car1"), x: 350, y: 500, speed: 0, angle: 0, laps: 0 };
const car2 = { el: document.getElementById("car2"), x: 420, y: 500, speed: 0, angle: 0, laps: 0 };

const keys = {};
let gameInterval = null;

// Track boundaries
const trackBounds = { width: 800, height: 600 };

function startGame() {
  if (gameInterval) return;
  gameInterval = setInterval(gameLoop, 30);
}

function resetGame() {
  clearInterval(gameInterval);
  gameInterval = null;
  resetCar(car1, 350, 500);
  resetCar(car2, 420, 500);
  updateUI();
}

function resetCar(car, x, y) {
  car.x = x;
  car.y = y;
  car.speed = 0;
  car.angle = 0;
  car.laps = 0;
  updateCar(car);
}

// Key press tracking
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function gameLoop() {
  handleControls();
  moveCar(car1);
  moveCar(car2);
  checkFinishLine(car1);
  checkFinishLine(car2);
}

function handleControls() {
  // Player 1 - Arrows
  if (keys["ArrowUp"]) car1.speed = 3;
  else if (keys["ArrowDown"]) car1.speed = -2;
  else car1.speed = 0;

  if (keys["ArrowLeft"]) car1.angle -= 5;
  if (keys["ArrowRight"]) car1.angle += 5;

  // Player 2 - WASD
  if (keys["w"]) car2.speed = 3;
  else if (keys["s"]) car2.speed = -2;
  else car2.speed = 0;

  if (keys["a"]) car2.angle -= 5;
  if (keys["d"]) car2.angle += 5;
}

function moveCar(car) {
  car.x += car.speed * Math.sin(car.angle * Math.PI / 180);
  car.y -= car.speed * Math.cos(car.angle * Math.PI / 180);

  // Collision with track borders
  if (car.x < 0) car.x = 0;
  if (car.x > trackBounds.width - 30) car.x = trackBounds.width - 30;
  if (car.y < 0) car.y = 0;
  if (car.y > trackBounds.height - 50) car.y = trackBounds.height - 50;

  updateCar(car);
}

function updateCar(car) {
  car.el.style.left = car.x + "px";
  car.el.style.top = car.y + "px";
  car.el.style.transform = `rotate(${car.angle}deg)`;
}

function checkFinishLine(car) {
  const finish = document.getElementById("finishLine").getBoundingClientRect();
  const carRect = car.el.getBoundingClientRect();
  const overlap = !(carRect.right < finish.left || 
                    carRect.left > finish.right || 
                    carRect.bottom < finish.top || 
                    carRect.top > finish.bottom);
  if (overlap) {
    car.laps++;
    updateUI();
    if (car.laps >= 3) {
      alert(`${car.el.id === "car1" ? "Player 1" : "Player 2"} Wins!`);
      resetGame();
    }
  }
}

function updateUI() {
  document.getElementById("laps1").textContent = car1.laps;
  document.getElementById("laps2").textContent = car2.laps;
}
