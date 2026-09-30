function requestNotificationPermission() {
  if (!("Notification" in window)) {
    alert("This browser doesn't support notifications.");
    return;
  }
  Notification.requestPermission().then(permission => {
    localStorage.setItem("notificationsEnabled", permission === "granted" ? "true" : "false");
  });
}

function hasWorkedOutToday() {
  const history = JSON.parse(localStorage.getItem("workoutHistory") || "[]");
  const today = new Date().toISOString().slice(0, 10);
  return history.some(h => (typeof h === "string" ? h : h.date) === today);
}

function checkReminder() {
  if (localStorage.getItem("notificationsEnabled") !== "true") return;
  if (Notification.permission !== "granted") return;

  const reminderTime = localStorage.getItem("reminderTime");
  if (!reminderTime) return;

  const now = new Date();
  const [hour, minute] = reminderTime.split(":").map(Number);
  const isPastReminderTime = now.getHours() > hour || (now.getHours() === hour && now.getMinutes() >= minute);
  const today = now.toISOString().slice(0, 10);
  const lastNotified = localStorage.getItem("lastNotifiedDate");

  if (isPastReminderTime && lastNotified !== today && !hasWorkedOutToday()) {
    new Notification("Bodyweight Circuit", {
      body: "You haven't worked out yet today — get to it! 💪"
    });
    localStorage.setItem("lastNotifiedDate", today);
  }
}

setInterval(checkReminder, 60000);
checkReminder();