let currentStage = 0;
const stages = ["welcome", "stage1", "stage2", "stage3", "stage4", "hadiah"];

function nextStage() {
  document.getElementById(stages[currentStage]).classList.add("hidden");
  currentStage++;
  document.getElementById(stages[currentStage]).classList.remove("hidden");
  onStageChange();
}

// Stage 1
const boxesEl = document.getElementById("boxes");
const stage1Msg = document.getElementById("stage1-msg");
const stage1Btn = document.getElementById("stage1-btn");

let chikoBoxIndex = 0;

function createBoxes() {
  boxesEl.innerHTML = "";
  stage1Msg.classList.add("hidden");
  stage1Btn.disabled = true;
  stage1Btn.classList.add("opacity-50", "cursor-not-allowed");

  chikoBoxIndex = Math.floor(Math.random() * 3);
  for (let i = 0; i < 3; i++) {
    const box = document.createElement("div");
    box.classList.add("draggable", "relative", "bg-pink-200", "w-24", "h-24", "rounded-lg", "shadow-md", "flex", "items-center", "justify-center", "cursor-pointer", "select-none", "mx-2");
    box.textContent = "📦";
    box.style.fontSize = "3rem";
    box.dataset.index = i;

    if (i === chikoBoxIndex) {
      const hint = document.createElement("span");
      hint.classList.add("hint");
      hint.textContent = "🐾";
      box.appendChild(hint);
    }

    box.onclick = () => checkBox(i, box);
    boxesEl.appendChild(box);
  }
}

function checkBox(idx, box) {
  if (idx === chikoBoxIndex) {
    box.textContent = "🐱";
    stage1Btn.disabled = false;
    stage1Btn.classList.remove("opacity-50", "cursor-not-allowed");
    stage1Msg.classList.add("hidden");
  } else {
    stage1Msg.classList.remove("hidden");
    createBoxes();
  }
}

// Stage 2
const foodArea = document.getElementById("food-area");
const scoreEl = document.getElementById("score");
const stage2Btn = document.getElementById("stage2-btn");

const foodsEmoji = ["🍗", "🐟", "🍖", "🍤"];
let foodFallInterval;
let foodsFalling = [];
let score = 0;
const maxScore = 5;

function startStage2() {
  score = 0;
  scoreEl.textContent = `Makanan tertangkap: ${score} / ${maxScore}`;
  foodsFalling = [];
  stage2Btn.disabled = true;
  stage2Btn.classList.add("opacity-50", "cursor-not-allowed");
  foodArea.innerHTML = "";
  clearInterval(foodFallInterval);

  foodFallInterval = setInterval(spawnFood, 1200);
  requestAnimationFrame(updateFood);
}

function spawnFood() {
  if (foodsFalling.length >= 5) return;
  const food = document.createElement("div");
  food.textContent = foodsEmoji[Math.floor(Math.random() * foodsEmoji.length)];
  food.style.position = "absolute";
  food.style.fontSize = "2.5rem";
  food.style.left = Math.random() * (foodArea.clientWidth - 40) + "px";
  food.style.top = "-40px";
  food.classList.add("cursor-pointer", "select-none");
  foodArea.appendChild(food);
  foodsFalling.push({ el: food, y: -40, speed: 1.2 + Math.random() });
  food.addEventListener("click", () => catchFood(food));
}

function catchFood(food) {
  let idx = foodsFalling.findIndex(f => f.el === food);
  if (idx >= 0) {
    foodsFalling[idx].el.remove();
    foodsFalling.splice(idx, 1);
    score++;
    scoreEl.textContent = `Makanan tertangkap: ${score} / ${maxScore}`;
    if (score >= maxScore) finishStage2();
  }
}

function updateFood() {
  for (let i = foodsFalling.length - 1; i >= 0; i--) {
    let f = foodsFalling[i];
    f.y += f.speed;
    if (f.y > foodArea.clientHeight) {
      f.el.remove();
      foodsFalling.splice(i, 1);
      continue;
    }
    f.el.style.top = f.y + "px";
  }
  if (currentStage === 2) requestAnimationFrame(updateFood);
}

function finishStage2() {
  clearInterval(foodFallInterval);
  stage2Btn.disabled = false;
  stage2Btn.classList.remove("opacity-50", "cursor-not-allowed");
}

// Stage 3
const mazeEl = document.getElementById("maze");
const stage3Btn = document.getElementById("stage3-btn");

const mazeData = [
  [0, 0, 1, 0, 2],
  [1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 1, 1, 0, 1],
  [0, 0, 0, 0, 1],
];
let playerPos = { x: 0, y: 4 };

function drawMaze() {
  mazeEl.innerHTML = "";
  for (let y = 0; y < mazeData.length; y++) {
    for (let x = 0; x < mazeData[y].length; x++) {
      const cell = document.createElement("div");
      cell.classList.add("maze-cell");
      if (mazeData[y][x] === 1) cell.classList.add("wall");
      else cell.classList.add("path");
      if (playerPos.x === x && playerPos.y === y) {
        cell.classList.add("current");
        cell.textContent = "🐱";
      }
      if (mazeData[y][x] === 2) cell.textContent = "🎁";
      mazeEl.appendChild(cell);
    }
  }
  stage3Btn.disabled = !(playerPos.x === 4 && playerPos.y === 0);
  stage3Btn.classList.toggle("opacity-50", stage3Btn.disabled);
  stage3Btn.classList.toggle("cursor-not-allowed", stage3Btn.disabled);
}

function moveMaze(dir) {
  let newX = playerPos.x;
  let newY = playerPos.y;
  if (dir === "up") newY--;
  else if (dir === "down") newY++;
  else if (dir === "left") newX--;
  else if (dir === "right") newX++;

  if (
    newX >= 0 &&
    newY >= 0 &&
    newY < mazeData.length &&
    newX < mazeData[0].length &&
    mazeData[newY][newX] !== 1
  ) {
    playerPos = { x: newX, y: newY };
  }
  drawMaze();
}

// Stage 4
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const stage4Btn = document.getElementById("stage4-btn");

const questions = [
  { q: "2 + 3", a: 5, options: [2, 3, 5] },
  { q: "4 - 1", a: 3, options: [2, 3, 4] },
  { q: "5 - 2", a: 3, options: [1, 2, 3] },
  { q: "3 + 4", a: 7, options: [7, 8, 9] },
];

let currentQuestionIndex = 0;
let correctAnswersCount = 0;

function showQuestion() {
  stage4Btn.disabled = true;
  stage4Btn.classList.add("opacity-50", "cursor-not-allowed");

  questionEl.textContent = questions[currentQuestionIndex].q;
  answersEl.innerHTML = "";

  questions[currentQuestionIndex].options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.className = "bg-pink-300 hover:bg-pink-400 text-white font-semibold py-2 px-4 rounded-full transition";
    btn.onclick = () => checkAnswer(opt);
    answersEl.appendChild(btn);
  });
}

function checkAnswer(selected) {
  if (selected === questions[currentQuestionIndex].a) correctAnswersCount++;
  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    stage4Btn.disabled = false;
    stage4Btn.classList.remove("opacity-50", "cursor-not-allowed");
    stage4Btn.textContent = "Lihat Hadiah 🎁";
    stage4Btn.onclick = () => nextStage();
  }
}

// On stage change
function onStageChange() {
  if (stages[currentStage] === "stage1") createBoxes();
  if (stages[currentStage] === "stage2") startStage2();
  if (stages[currentStage] === "stage3") {
    playerPos = { x: 0, y: 4 };
    drawMaze();
  }
  if (stages[currentStage] === "stage4") {
    currentQuestionIndex = 0;
    correctAnswersCount = 0;
    stage4Btn.textContent = "Jangan lihat hadiah dulu!";
    showQuestion();
  }
}

// Start from welcome
onStageChange();
