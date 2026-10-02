const GOOGLE_CLIENT_ID = "377215325640-n0ve2cuaq96fqfd9i4ae257atorrh8c6.apps.googleusercontent.com";
const CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar.events";

let tokenClient = null;
let accessToken = null;
let tokenExpiresAt = 0;

function initGoogleAuth() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: CALENDAR_SCOPE,
    callback: () => {} // overridden per-request in ensureGoogleAuth
  });
}

function isTokenValid() {
  return accessToken && Date.now() < tokenExpiresAt - 60000;
}

function ensureGoogleAuth() {
  return new Promise((resolve) => {
    if (isTokenValid()) {
      resolve(accessToken);
      return;
    }
    tokenClient.callback = (response) => {
      if (response.error) {
        console.error("Google auth error:", response);
        resolve(null);
        return;
      }
      accessToken = response.access_token;
      tokenExpiresAt = Date.now() + response.expires_in * 1000;
      localStorage.setItem("calendarConnected", "true");
      updateCalendarButton();
      resolve(accessToken);
    };
    tokenClient.requestAccessToken({ prompt: isTokenValid() ? "" : "consent" });
  });
}

async function createCalendarEvent(eventBody) {
  const token = await ensureGoogleAuth();
  if (!token) return null;

  const res = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(eventBody)
    }
  );

  if (!res.ok) {
    console.error("Calendar event creation failed:", await res.text());
    return null;
  }
  return res.json();
}

function logWorkoutToCalendar(entry) {
  if (localStorage.getItem("calendarSyncEnabled") !== "true") return;

  const now = new Date();
  const start = new Date(now.getTime() - entry.duration * 60000);

  createCalendarEvent({
    summary: `💪 Bodyweight Circuit — ${entry.focus} (${entry.difficulty})`,
    description: `${entry.exerciseCount} exercises completed:\n${entry.exerciseNames.join(", ")}`,
    start: { dateTime: start.toISOString() },
    end: { dateTime: now.toISOString() },
    colorId: "10"
  });
}

async function setRecurringReminder(time) {
  const [hour, minute] = time.split(":").map(Number);
  const start = new Date();
  start.setHours(hour, minute, 0, 0);
  const end = new Date(start.getTime() + 30 * 60000);

  await createCalendarEvent({
    summary: "💪 Bodyweight Circuit — Workout Time",
    description: "Recurring reminder set from your Bodyweight Circuit app.",
    start: { dateTime: start.toISOString() },
    end: { dateTime: end.toISOString() },
    recurrence: ["RRULE:FREQ=DAILY"],
    reminders: { useDefault: false, overrides: [{ method: "popup", minutes: 0 }] }
  });
  localStorage.setItem("reminderTime", time);
}

function updateCalendarButton() {
  const btn = document.getElementById("connect-calendar-btn");
  if (!btn) return;
  const connected = localStorage.getItem("calendarConnected") === "true";
  btn.textContent = connected ? "Google Calendar Connected ✓" : "Connect Google Calendar";
}

function ensureGoogleClientReady() {
  if (tokenClient) return true;
  if (typeof google === "undefined" || !google.accounts) {
    alert("Google sign-in hasn't finished loading yet. Please wait a moment and try again.");
    return false;
  }
  initGoogleAuth();
  return true;
}

window.addEventListener("load", () => {
  updateCalendarButton();

  const syncToggle = document.getElementById("calendar-sync-toggle");
  syncToggle.checked = localStorage.getItem("calendarSyncEnabled") === "true";
  syncToggle.addEventListener("change", () => {
    localStorage.setItem("calendarSyncEnabled", syncToggle.checked ? "true" : "false");
  });

  document.getElementById("connect-calendar-btn").addEventListener("click", async () => {
    if (!ensureGoogleClientReady()) return;
    const token = await ensureGoogleAuth();
    if (!token) alert("Couldn't connect to Google Calendar. Please try again.");
  });

  const reminderTimeInput = document.getElementById("reminder-time");
  const savedReminderTime = localStorage.getItem("reminderTime");
  if (savedReminderTime) reminderTimeInput.value = savedReminderTime;

  document.getElementById("set-reminder-btn").addEventListener("click", async () => {
    if (!ensureGoogleClientReady()) return;
    const time = reminderTimeInput.value;
    if (!time) {
      alert("Pick a reminder time first.");
      return;
    }
    await setRecurringReminder(time);
    alert(`Daily reminder set for ${time}.`);
  });
});