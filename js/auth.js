const AUTH_USERS_KEY = "authUsers";
const AUTH_SESSION_KEY = "authSession";
let currentUser = null;

async function hashPassword(password) {
  const data = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function loadUsers() { return JSON.parse(localStorage.getItem(AUTH_USERS_KEY) || "{}"); }
function saveUsers(users) { localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users)); }

function showAuthError(msg) {
  const el = document.getElementById("auth-error");
  el.textContent = msg;
  el.hidden = false;
}
function clearAuthError() {
  const el = document.getElementById("auth-error");
  el.hidden = true;
  el.textContent = "";
}

async function signUp(email, password) {
  clearAuthError();
  const trimmed = email.trim();
  if (!trimmed || !password) return showAuthError("Enter an email and password.");
  if (password.length < 6) return showAuthError("Password must be at least 6 characters.");
  const users = loadUsers();
  const key = trimmed.toLowerCase();
  if (users[key]) return showAuthError("An account with that email already exists.");
  users[key] = { email: trimmed, passwordHash: await hashPassword(password) };
  saveUsers(users);
  logIn(key, trimmed);
}

async function signIn(email, password) {
  clearAuthError();
  const trimmed = email.trim();
  if (!trimmed || !password) return showAuthError("Enter an email and password.");
  const users = loadUsers();
  const key = trimmed.toLowerCase();
  const user = users[key];
  if (!user || user.passwordHash !== await hashPassword(password)) {
    return showAuthError("Incorrect email or password.");
  }
  logIn(key, user.email);
}

function logIn(key, email) {
  currentUser = { email };
  localStorage.setItem(AUTH_SESSION_KEY, key);
  document.getElementById("auth-password").value = "";
  updateAuthUI();
}

function signOut() {
  currentUser = null;
  localStorage.removeItem(AUTH_SESSION_KEY);
  document.getElementById("auth-email").value = "";
  document.getElementById("auth-password").value = "";
  clearAuthError();
  updateAuthUI();
}

function restoreSession() {
  const key = localStorage.getItem(AUTH_SESSION_KEY);
  if (!key) return;
  const users = loadUsers();
  const user = users[key];
  if (user) currentUser = { email: user.email };
  else localStorage.removeItem(AUTH_SESSION_KEY);
}

function updateAuthUI() {
  const authView = document.getElementById("auth-view");
  const emailLabel = document.getElementById("auth-email-label");
  if (currentUser) {
    authView.hidden = true;
    emailLabel.textContent = currentUser.email;
    showView(setupView);
    renderStreak();
  } else {
    authView.hidden = false;
    [setupView, workoutView, summaryView].forEach(v => v.hidden = true);
  }
}

window.addEventListener("load", () => {
  restoreSession();
  updateAuthUI();
  document.getElementById("signup-btn").addEventListener("click", () =>
    signUp(document.getElementById("auth-email").value, document.getElementById("auth-password").value));
  document.getElementById("signin-btn").addEventListener("click", () =>
    signIn(document.getElementById("auth-email").value, document.getElementById("auth-password").value));
  document.getElementById("signout-btn").addEventListener("click", signOut);
  document.getElementById("auth-password").addEventListener("keydown", e => {
    if (e.key === "Enter") signIn(document.getElementById("auth-email").value, document.getElementById("auth-password").value);
  });
});