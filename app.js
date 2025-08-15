const ship = document.querySelector("#ship");
const bullet = document.querySelector("#bullet");
const asteroidsContainer = document.querySelector("#asteroids");
const gameBoard = document.querySelector("#game-board");
const scoreDisplay = document.getElementById("score");
const gameOverDisplay = document.getElementById("game-over");
const restartDiv = document.getElementById("restart");

let targetShipLeft = window.innerWidth / 2;
let moveSpeed = 15;
let asteroidSpeed = 1.5;
let score = 0;
let gameRunning = true;
let bulletTop = 0;

gameOverDisplay.style.display = "none";
restartDiv.style.display = "none";

function createStars(num = 150) {
  const starsContainer = document.getElementById("stars");
  for (let i = 0; i < num; i++) {
    const star = document.createElement("div");
    star.classList.add("star");
    star.style.top = Math.random() * window.innerHeight + "px";
    star.style.left = Math.random() * window.innerWidth + "px";
    star.style.opacity = Math.random();
    starsContainer.appendChild(star);
  }
}

window.addEventListener("mousemove", (e) => {
  if (!gameRunning) return;
  targetShipLeft = e.clientX - ship.offsetWidth / 2;
});

window.addEventListener("keydown", (e) => {
  if (!gameRunning) return;
  switch (e.key) {
    case "ArrowLeft":
      targetShipLeft -= moveSpeed;
      break;
    case "ArrowRight":
      targetShipLeft += moveSpeed;
      break;
    case " ":
      fireBullet();
      break;
  }
});

window.addEventListener("touchmove", (e) => {
  if (!gameRunning) return;
  const touch = e.touches[0];
  targetShipLeft = touch.clientX - ship.offsetWidth / 2;
});

window.addEventListener("click", fireBullet);
window.addEventListener("touchstart", fireBullet);

function animateShip() {
  if (!gameRunning) return;
  const currentLeft = parseFloat(ship.style.left) || 0;
  const diff = targetShipLeft - currentLeft;
  ship.style.left = currentLeft + diff * 0.1 + "px";
  requestAnimationFrame(animateShip);
}
animateShip();

function fireBullet() {
  if (!gameRunning) return;
  if (bullet.style.display === "block") return;
  const shipRect = ship.getBoundingClientRect();
  bullet.style.left = shipRect.left + shipRect.width / 2 - 5 + "px";
  bulletTop = shipRect.top - 30;
  bullet.style.top = bulletTop + "px";
  bullet.style.display = "block";

  const interval = setInterval(() => {
    bulletTop -= 10;
    bullet.style.top = bulletTop + "px";

    document.querySelectorAll(".asteroid").forEach((ast) => {
      if (isColliding(bullet, ast)) {
        explode(ast);
        bullet.style.display = "none";
        clearInterval(interval);
        score++;
        scoreDisplay.textContent = "Score: " + score;
      }
    });

    if (bulletTop < 0) {
      bullet.style.display = "none";
      clearInterval(interval);
    }
  }, 20);
}

function isColliding(obj1, obj2) {
  const r1 = obj1.getBoundingClientRect();
  const r2 = obj2.getBoundingClientRect();
  return !(
    r2.left > r1.right ||
    r2.right < r1.left ||
    r2.top > r1.bottom ||
    r2.bottom < r1.top
  );
}

function explode(ast) {
  const explosion = document.createElement("img");
  explosion.src = "explode.gif";
  explosion.classList.add("explosion");
  explosion.style.left = ast.style.left;
  explosion.style.top = ast.style.top;
  gameBoard.appendChild(explosion);
  setTimeout(() => explosion.remove(), 500);
  ast.remove();
}

function createAsteroid() {
  if (!gameRunning) return;
  const ast = document.createElement("img");
  ast.src = Math.random() > 0.5 ? "rock1.gif" : "rock2.gif";
  ast.classList.add("asteroid");
  ast.style.left = Math.random() * (window.innerWidth - 50) + "px";
  ast.style.top = "-80px";
  asteroidsContainer.appendChild(ast);
}

function moveAsteroids() {
  if (!gameRunning) return;
  document.querySelectorAll(".asteroid").forEach((ast) => {
    const top = parseFloat(ast.style.top);
    ast.style.top = top + asteroidSpeed + "px";
    if (isColliding(ast, ship)) {
      endGame();
    }
    if (top > window.innerHeight) {
      ast.remove();
    }
  });
  requestAnimationFrame(moveAsteroids);
}

function endGame() {
  gameRunning = false;
  gameOverDisplay.style.display = "block";
  restartDiv.style.display = "block";
}

function resetGame() {
  score = 0;
  scoreDisplay.textContent = "Score: 0";
  gameRunning = true;
  document
    .querySelectorAll(".asteroid, .explosion")
    .forEach((el) => el.remove());
  gameOverDisplay.style.display = "none";
  restartDiv.style.display = "none";
  bullet.style.display = "none";
  targetShipLeft = window.innerWidth / 2;
  ship.style.left = targetShipLeft + "px";
}

restartDiv.addEventListener("click", resetGame);

setInterval(createAsteroid, 1500);
createStars(150);
moveAsteroids();
