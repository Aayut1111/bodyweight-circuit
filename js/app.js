const setupView = document.getElementById("setup-view");
const workoutView = document.getElementById("workout-view");
const summaryView = document.getElementById("summary-view");

const setupForm = document.getElementById("setup-form");
const phaseLabel = document.getElementById("phase-label");
const exerciseName = document.getElementById("exercise-name");
const exerciseInstructions = document.getElementById("exercise-instructions");
const timerDisplay = document.getElementById("timer-display");
const progressDots = document.getElementById("progress-dots");
const pauseBtn = document.getElementById("pause-btn");
const skipBtn = document.getElementById("skip-btn");

let currentCircuit = [];
let currentTimer = null;

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildCircuit(durationMinutes, focus, difficulty) {
  const pool = EXERCISES.filter(ex => {
    const focusMatch = focus === "full" ? true : ex.muscleGroup === focus || ex.muscleGroup === "full";
    const difficultyMatch = difficulty === "any" ? true : ex.difficulty === difficulty;
    return focusMatch && difficultyMatch;
  });

  const usablePool = pool.length > 0 ? pool : EXERCISES;
  const perExerciseSeconds = WORK_SECONDS + REST_SECONDS;
  const totalSeconds = durationMinutes * 60;
  const exerciseCount = Math.max(1, Math.floor(totalSeconds / perExerciseSeconds));

  const shuffled = shuffle(usablePool);
  const circuit = [];
  for (let i = 0; i < exerciseCount; i++) {
    circuit.push(shuffled[i % shuffled.length]);
  }
  return circuit;
}

function renderDots() {
  progressDots.innerHTML = "";
  currentCircuit.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.className = "dot";
    progressDots.appendChild(dot);
  });
}

function updateDots(index) {
  [...progressDots.children].forEach((dot, i) => {
    dot.classList.toggle("done", i < index);
    dot.classList.toggle("current", i === index);
  });
}

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function showView(view) {
  [setupView, workoutView, summaryView].forEach(v => v.hidden = true);
  view.hidden = false;
}

setupForm.addEventListener("submit", e => {
  e.preventDefault();
  const duration = Number(document.getElementById("duration").value);
  const focus = document.getElementById("focus").value;
  const difficulty = document.getElementById("difficulty").value;

  currentCircuit = buildCircuit(duration, focus, difficulty);
  renderDots();
  showView(workoutView);
  startTimer();
});

function startTimer() {
  currentTimer = createCircuitTimer(currentCircuit, {
    onPhaseChange: (phase, index) => {
      const exercise = currentCircuit[index];
      phaseLabel.textContent = phase === "work" ? "WORK" : "REST";
      phaseLabel.classList.toggle("rest", phase === "rest");
      exerciseName.textContent = exercise.name;
      exerciseInstructions.textContent = phase === "work"
        ? exercise.instructions
        : "Catch your breath — next one's coming up.";
      updateDots(index);
    },
    onTick: (secondsLeft) => {
      timerDisplay.textContent = formatTime(secondsLeft);
    },
    onComplete: () => {
            finishWorkout();
    }
  });
  currentTimer.start();
}

pauseBtn.addEventListener("click", () => {
  const paused = currentTimer.togglePause();
  pauseBtn.textContent = paused ? "Resume" : "Pause";
});

skipBtn.addEventListener("click", () => {
  currentTimer.skip();
});
const summaryStats = document.getElementById("summary-stats");
const summaryList = document.getElementById("summary-list");
const restartBtn = document.getElementById("restart-btn");

function finishWorkout() {
  const uniqueNames = [...new Set(currentCircuit.map(ex => ex.name))];
  summaryStats.textContent = `${currentCircuit.length} exercises completed.`;
  summaryList.innerHTML = "";
  uniqueNames.forEach(name => {
    const li = document.createElement("li");
    li.textContent = name;
    summaryList.appendChild(li);
  });
  recordCompletion();
  showView(summaryView);
}

restartBtn.addEventListener("click", () => {
  showView(setupView);
  renderStreak();
});

function recordCompletion() {
  const today = new Date().toISOString().slice(0, 10);
  const history = JSON.parse(localStorage.getItem("workoutHistory") || "[]");
  if (!history.includes(today)) {
    history.push(today);
    localStorage.setItem("workoutHistory", JSON.stringify(history));
  }
}

function computeStreak() {
  const history = JSON.parse(localStorage.getItem("workoutHistory") || "[]");
  const daySet = new Set(history);
  let streak = 0;
  let cursor = new Date();
  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (daySet.has(key)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function renderStreak() {
  const badge = document.getElementById("streak-badge");
  const streak = computeStreak();
  if (streak > 0) {
    badge.hidden = false;
    badge.textContent = `🔥 ${streak} day streak`;
  } else {
    badge.hidden = true;
  }
}

renderStreak();