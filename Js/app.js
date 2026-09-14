
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

  // fallback: if the filters are too strict and match nothing, use the full list
  // rather than generating an empty circuit
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

// temporary — verify the generator works before building the UI around it
console.log(buildCircuit(20, "full", "medium"));