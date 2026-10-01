const API_URL = "https://bodyweight-backend.onrender.com";

async function authedFetch(path, options = {}) {
  const token = await getAccessToken();
  if (!token) return null;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.status === 204 ? null : res.json();
}

async function fetchWorkoutHistory() {
  return authedFetch("/api/workouts");
}

async function saveWorkoutToServer(entry) {
  return authedFetch("/api/workouts", {
    method: "POST",
    body: JSON.stringify({
      date: entry.date,
      duration: entry.duration,
      focus: entry.focus,
      difficulty: entry.difficulty,
      exercise_count: entry.exerciseCount,
      exercise_names: entry.exerciseNames,
    }),
  });
}