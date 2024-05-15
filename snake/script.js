const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const tileSize = 20;
const rows = 20;
const cols = 20;
canvas.width = cols * tileSize;
canvas.height = rows * tileSize;

let pacman = {
    x: 10,
    y: 10,
    dx: 0,
    dy: 0,
};

let ghosts = [
    { x: 5, y: 5, dx: 1, dy: 0 },
    { x: 15, y: 15, dx: -1, dy: 0 },
];

let food = [];
let walls = [
    // Top and bottom borders
    ...Array(cols).fill(0).map((_, i) => ({ x: i, y: 0 })),
    ...Array(cols).fill(0).map((_, i) => ({ x: i, y: rows - 1 })),
    
    // Left and right borders
    ...Array(rows).fill(0).map((_, i) => ({ x: 0, y: i })),
    ...Array(rows).fill(0).map((_, i) => ({ x: cols - 1, y: i })),
    
    // Inner walls
    { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 6, y: 3 },
    { x: 3, y: 4 }, { x: 3, y: 5 }, { x: 3, y: 6 },
    { x: 6, y: 4 }, { x: 6, y: 5 }, { x: 6, y: 6 },
    { x: 10, y: 3 }, { x: 10, y: 4 }, { x: 10, y: 5 }, { x: 10, y: 6 },
    { x: 13, y: 3 }, { x: 14, y: 3 }, { x: 15, y: 3 }, { x: 16, y: 3 },
    { x: 13, y: 4 }, { x: 13, y: 5 }, { x: 13, y: 6 },
    { x: 16, y: 4 }, { x: 16, y: 5 }, { x: 16, y: 6 },
    { x: 3, y: 10 }, { x: 4, y: 10 }, { x: 5, y: 10 }, { x: 6, y: 10 },
    { x: 3, y: 11 }, { x: 3, y: 12 }, { x: 3, y: 13 },
    { x: 6, y: 11 }, { x: 6, y: 12 }, { x: 6, y: 13 },
    { x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }, { x: 10, y: 13 },
    { x: 13, y: 10 }, { x: 14, y: 10 }, { x: 15, y: 10 }, { x: 16, y: 10 },
    { x: 13, y: 11 }, { x: 13, y: 12 }, { x: 13, y: 13 },
    { x: 16, y: 11 }, { x: 16, y: 12 }, { x: 16, y: 13 },
    // Add more walls to make a complex maze
];

for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        if (!walls.some(w => w.x === i && w.y === j)) {
            food.push({ x: i, y: j });
        }
    }
}

let mouthOpen = true;
let mouthAngle = 0.2;

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    if (event.keyCode === 37 && pacman.dx === 0) {
        pacman.dx = -1;
        pacman.dy = 0;
    } else if (event.keyCode === 38 && pacman.dy === 0) {
        pacman.dx = 0;
        pacman.dy = -1;
    } else if (event.keyCode === 39 && pacman.dx === 0) {
        pacman.dx = 1;
        pacman.dy = 0;
    } else if (event.keyCode === 40 && pacman.dy === 0) {
        pacman.dx = 0;
        pacman.dy = 1;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Walls
    ctx.fillStyle = "blue";
    walls.forEach(wall => {
        ctx.fillRect(wall.x * tileSize, wall.y * tileSize, tileSize, tileSize);
    });

    // Draw Pac-Man
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(pacman.x * tileSize + tileSize / 2, pacman.y * tileSize + tileSize / 2, tileSize / 2, mouthAngle * Math.PI, (2 - mouthAngle) * Math.PI);
    ctx.lineTo(pacman.x * tileSize + tileSize / 2, pacman.y * tileSize + tileSize / 2);
    ctx.fill();

    // Draw Ghosts
    ctx.fillStyle = "red";
    ghosts.forEach(ghost => {
        ctx.fillRect(ghost.x * tileSize, ghost.y * tileSize, tileSize, tileSize);
    });

    // Draw Food
    ctx.fillStyle = "white";
    food.forEach(f => {
        ctx.fillRect(f.x * tileSize + tileSize / 3, f.y * tileSize + tileSize / 3, tileSize / 3, tileSize / 3);
    });
}

function update() {
    pacman.x += pacman.dx;
    pacman.y += pacman.dy;

    if (pacman.x < 0) pacman.x = cols - 1;
    if (pacman.x >= cols) pacman.x = 0;
    if (pacman.y < 0) pacman.y = rows - 1;
    if (pacman.y >= rows) pacman.y = 0;

    if (walls.some(w => w.x === pacman.x && w.y === pacman.y)) {
        pacman.x -= pacman.dx;
        pacman.y -= pacman.dy;
        pacman.dx = 0;
        pacman.dy = 0;
    }

    ghosts.forEach(ghost => {
        ghost.x += ghost.dx;
        ghost.y += ghost.dy;

        if (ghost.x < 0 || ghost.x >= cols || ghost.y < 0 || ghost.y >= rows || walls.some(w => w.x === ghost.x && w.y === ghost.y)) {
            ghost.dx *= -1;
            ghost.dy *= -1;
        }
    });

    food = food.filter(f => !(f.x === pacman.x && f.y === pacman.y));

    if (ghosts.some(ghost => ghost.x === pacman.x && ghost.y === pacman.y)) {
        alert("Game Over");
        clearInterval(game);
    }

    mouthOpen = !mouthOpen;
    mouthAngle = mouthOpen ? 0.2 : 0.05;
}

function gameLoop() {
    update();
    draw();
}

let game = setInterval(gameLoop, 100);
