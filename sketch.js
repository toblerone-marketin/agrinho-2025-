// usei o chatgpt
// jogo sobe campo
let player;
let fruit;
let obstacles = [];
let score = 0;
let timeLeft = 30;
let gameOver = false;
let fruitTimer = 0;
let obstacleSpeed = 0.5;
let gameState = "start"; // "start", "playing", "gameover"

function setup() {
  createCanvas(600, 400);
  frameRate(60);
  resetGame();

  setInterval(() => {
    if (!gameOver && gameState === "playing") {
      timeLeft--;
      if (timeLeft % 10 === 0) {
        obstacleSpeed += 0.3;
      }
      if (timeLeft <= 0) {
        gameOver = true;
      }
    }
  }, 1000);
}

function draw() {
  background(80, 200, 120); // fundo campo verde

  if (gameState === "start") {
    drawStartScreen();
  } else if (gameState === "playing") {
    if (!gameOver) {
      movePlayer();
      moveObstacles();
      checkFruitTimer();
      checkCollision();
      checkObstacleCollision();
    }

    drawObstacles();
    drawPlayer();
    drawFruit();
    drawUI();

    if (gameOver) {
      fill(0, 0, 0, 150);
      rect(0, 0, width, height);
      fill(255);
      textSize(32);
      textAlign(CENTER);
      text("Fim de Jogo!", width / 2, height / 2 - 20);
      text("Pontuação: " + score, width / 2, height / 2 + 20);
      textSize(16);
      text("Aperte ENTER para jogar novamente", width / 2, height / 2 + 50);
    }
  }
}

function drawStartScreen() {
  fill(255);
  textAlign(CENTER);
  textSize(36);
  text("🌾 Jogo do Campo 🌾", width / 2, height / 2 - 60);
  textSize(20);
  text("Use as setas do teclado para se mover", width / 2, height / 2 - 20);
  text("Colete frutas, evite pedras!", width / 2, height / 2 + 10);
  text("Aperte ENTER para começar", width / 2, height / 2 + 60);
}

function drawPlayer() {
  // Cabo do machado
  fill(139, 69, 19);
  rect(player.x + 12, player.y, 6, 30);

  // Lâmina do machado
  fill(200);
  triangle(
    player.x + 5, player.y,
    player.x + 25, player.y,
    player.x + 15, player.y - 10
  );
}

function drawFruit() {
  fill(255, 50, 50);
  ellipse(fruit.x + 15, fruit.y + 15, 30, 30);
}

function drawObstacles() {
  fill(100);
  for (let obs of obstacles) {
    rect(obs.pos.x, obs.pos.y, 30, 30);
  }
}

function drawUI() {
  fill(0);
  textSize(16);
  textAlign(LEFT);
  text("Pontuação: " + score, 10, 20);
  text("Tempo: " + timeLeft + "s", 10, 40);
}

function movePlayer() {
  let speed = 2;
  if (keyIsDown(LEFT_ARROW)) player.x -= speed;
  if (keyIsDown(RIGHT_ARROW)) player.x += speed;
  if (keyIsDown(UP_ARROW)) player.y -= speed;
  if (keyIsDown(DOWN_ARROW)) player.y += speed;

  player.x = constrain(player.x, 0, width - 30);
  player.y = constrain(player.y, 0, height - 30);
}

function checkCollision() {
  let d = dist(player.x + 15, player.y + 15, fruit.x + 15, fruit.y + 15);
  if (d < 30) {
    score++;
    timeLeft++; // +1 segundo
    fruit = randomPosition();
    fruitTimer = 0;
  }
}

function checkFruitTimer() {
  fruitTimer++;
  if (fruitTimer > 300) {
    fruit = randomPosition();
    fruitTimer = 0;
  }
}

function randomPosition() {
  return createVector(floor(random(width - 30)), floor(random(height - 30)));
}

function generateObstacles() {
  for (let i = 0; i < 6; i++) {
    let pos = randomPosition();
    let dir = p5.Vector.random2D();
    obstacles.push({ pos, dir });
  }
}

function moveObstacles() {
  for (let obs of obstacles) {
    obs.pos.add(p5.Vector.mult(obs.dir, obstacleSpeed));
    if (obs.pos.x < 0 || obs.pos.x > width - 30) obs.dir.x *= -1;
    if (obs.pos.y < 0 || obs.pos.y > height - 30) obs.dir.y *= -1;
  }
}

function checkObstacleCollision() {
  for (let obs of obstacles) {
    if (
      player.x < obs.pos.x + 30 &&
      player.x + 30 > obs.pos.x &&
      player.y < obs.pos.y + 30 &&
      player.y + 30 > obs.pos.y
    ) {
      resetGame(); // Reinicia o jogo
      break;
    }
  }
}

function resetGame() {
  score = 0;
  timeLeft = 30;
  obstacleSpeed = 0.5;
  fruitTimer = 0;
  gameOver = false;
  player = createVector(width / 2, height / 2);
  fruit = randomPosition();
  obstacles = [];
  generateObstacles();
}

function keyPressed() {
  if (gameState === "start" && keyCode === ENTER) {
    gameState = "playing";
    resetGame();
  } else if (gameOver && keyCode === ENTER) {
    gameOver = false;
    resetGame();
  }
}