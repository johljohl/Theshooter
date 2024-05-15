const gameFrame = document.getElementById("gameFrame");
const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");
const reloadButton = document.getElementById("reloadButton");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreElement = document.getElementById("finalScore");
const bulletsElement = document.getElementById("bullets");
const startScreen = document.getElementById("startScreen");
const scoreBoard = document.getElementById("scoreBoard");
const timerElement = document.getElementById("timer");

let score = 0;
let lives = 3;
let bullets = 6;
let level = 1;
let gameMode = 'A';
let gunmanTimers = [];
let countdownTimers = [];
let enemies = [];

bulletsElement.textContent = `Bullets: ${bullets}`;

function startGame(mode) {
  gameMode = mode;
  startScreen.style.display = "none";
  gameFrame.style.display = "block";
  scoreBoard.style.display = "block";
  initGame();
}

function iShoot(enemy) {
  if (!enemy.classList.contains("dead")) {
    enemy.classList.add("dead");
    clearTimeout(gunmanTimers[enemies.indexOf(enemy)]); // Stop the timer for this gunman
    clearInterval(countdownTimers[enemies.indexOf(enemy)]); // Stop the countdown timer
    updateScore();
    setTimeout(() => {
      enemy.remove();
      enemies.splice(enemies.indexOf(enemy), 1);
      generateEnemy();
    }, 300);
  }
}

function shoot() {
  if (bullets > 0) {
    bullets--;
    bulletsElement.textContent = `Bullets: ${bullets}`;
    enemies.forEach((enemy) => {
      if (enemy && !enemy.classList.contains("dead")) {
        iShoot(enemy);
      }
    });
  } else {
    alert("You need to reload!");
  }
}

function reloadGun() {
  console.log("Reloading gun...");
  bullets = 6;
  bulletsElement.textContent = `Bullets: ${bullets}`;
}

function updateScore() {
  score++;
  scoreElement.textContent = score;
  if (gameMode === 'A' && score >= 20) {
    generateEnemy();
  }
  if (score % 10 === 0) {
    level++;
  }
}

function updateLives() {
  lives--;
  livesElement.textContent = lives;
  if (lives === 0) {
    gameOver();
  }
}

function gameOver() {
  gunmanTimers.forEach(timer => clearTimeout(timer));
  countdownTimers.forEach(timer => clearInterval(timer));
  gameFrame.removeEventListener("click", shoot);
  gameOverScreen.style.display = "block";
  finalScoreElement.textContent = score;
}

function restartGame() {
  location.reload();
}

function initGame() {
  if (gameMode === 'B') {
    generateEnemy();
    generateEnemy();
  } else {
    generateEnemy();
  }
}

function generateEnemy() {
  const enemy = document.createElement("div");
  enemy.classList.add("enemy");
  enemy.style.left = "0px";
  enemy.onclick = function () {
    iShoot(enemy);
  };
  gameFrame.appendChild(enemy);
  enemies.push(enemy);
  const maxLeftPosition = gameFrame.offsetWidth - enemy.offsetWidth;
  const randomLeftPosition = Math.random() * maxLeftPosition;
  enemy.style.left = randomLeftPosition + "px";
  enemy.classList.remove("dead");

  let randomTime;
  if (gameMode === 'A') {
    randomTime = score >= 20 ? Math.floor(Math.random() * 5) + 3 : Math.floor(Math.random() * 10) + 5;
  } else {
    randomTime = Math.floor(Math.random() * 5) + 3;
  }

  let timeLeft = randomTime;
  timerElement.textContent = timeLeft;

  const countdownTimer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(countdownTimer);
      if (!enemy.classList.contains("dead")) {
        enemy.classList.add("dead");
        updateLives();
        setTimeout(() => {
          enemy.remove();
          enemies.splice(enemies.indexOf(enemy), 1);
          generateEnemy();
        }, 300);
      }
    }
  }, 1000);

  countdownTimers.push(countdownTimer);

  const gunmanTimer = setTimeout(() => {
    if (!enemy.classList.contains("dead")) {
      enemy.classList.add("dead");
      updateLives();
      setTimeout(() => {
        enemy.remove();
        enemies.splice(enemies.indexOf(enemy), 1);
        generateEnemy();
      }, 300);
    }
  }, randomTime * 1000);

  gunmanTimers.push(gunmanTimer);
}

gameFrame.addEventListener("click", shoot);
reloadButton.addEventListener("click", reloadGun);
