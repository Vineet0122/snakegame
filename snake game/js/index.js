// Game constants and variables
let inputDir = { x: 0, y: 0 };
const board = document.getElementById("board"); // Ensure board exists
const foodSound = new Audio('food.mp3');
const gameOverSound = new Audio('gameover.mp3');
const moveSound = new Audio('move.mp3');
const musicSound = new Audio('music.mp3');
const hiscoreBox = document.getElementById("hiscoreBox");
let speed = 5;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };

// Ensure audio can play after user interaction
document.addEventListener("click", () => {
    musicSound.play().catch(err => console.log("Audio blocked:", err));
}, { once: true });

function main(ctime) {
    window.requestAnimationFrame(main);

    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // Self-collision check (skip index 0)
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }

    // Wall collision check
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }

    return false;
}

function gameEngine() {
    // Collision check
    if (isCollide(snakeArr)) {
        gameOverSound.play().catch(err => console.log("Audio blocked:", err));
        musicSound.pause();
        alert("Game Over! Press any key to play again.");
        snakeArr = [{ x: 13, y: 15 }];
        inputDir = { x: 0, y: 0 };
        score = 0;
        musicSound.play().catch(err => console.log("Audio blocked:", err));
    }

    // Food consumption
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        score+=1;
        if(score > hiscoreval){
            hiscoreval = score;
            localStorage.setItem("hiscore",JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "HiScore:" +hiscoreval;
        }
        scoreBox.innerHTML = "Score:" + score;
        foodSound.play().catch(err => console.log("Audio blocked:", err));
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });

        // Ensure food stays within bounds
        let a = 2, b = 16;
        food = { x: Math.floor(a + (b - a) * Math.random()), y: Math.floor(a + (b - a) * Math.random()) };
    }

    // Move the snake (shift body forward)
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }

    // Move the head
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Clear board before rendering
    board.innerHTML = "";

    // Render snake
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if (index === 0) {
            snakeElement.classList.add("head");
        } else {
            snakeElement.classList.add("snake");
        }

        board.appendChild(snakeElement);
    });

    // Render food
    let foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add("food");

    board.appendChild(foodElement);
}

// Main logic starts here
let hiscore = localStorage.getItem("hiscore");
if(hiscore === null){
    hiscoreval = 0;
    localStorage.setItem("hiscore",JSON.stringify(hiscoreval));
}
else{
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "Hiscore:"+ hiscore;
}
window.requestAnimationFrame(main);

window.addEventListener("keydown", (e) => {
    if (inputDir.x === 0 && inputDir.y === 0) {
        musicSound.play().catch(err => console.log("Audio blocked:", err));
    }

    moveSound.play().catch(err => console.log("Audio blocked:", err));

    switch (e.key) {
        case "ArrowUp":
            inputDir = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            inputDir = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            inputDir = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            inputDir = { x: 1, y: 0 };
            break;
    }
});
