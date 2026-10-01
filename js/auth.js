let currentUser = null;

async function initAuth() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  currentUser = session?.user || null;
  updateAuthUI();
  if (currentUser) syncHistoryFromServer();

  supabaseClient.auth.onAuthStateChange((_event, session) => {
    currentUser = session?.user || null;
    updateAuthUI();
    if (currentUser) syncHistoryFromServer();
  });
}

async function signUp(email, password) {
  const { error } = await supabaseClient.auth.signUp({ email, password });
  if (error) alert(error.message);
}

async function signIn(email, password) {
  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) alert(error.message);
}

async function signOut() {
  await supabaseClient.auth.signOut();
}

async function getAccessToken() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  return session?.access_token || null;
}

function updateAuthUI() {
  const loggedOutEl = document.getElementById("auth-logged-out");
  const loggedInEl = document.getElementById("auth-logged-in");
  const emailLabel = document.getElementById("auth-email-label");

  if (currentUser) {
    loggedOutEl.hidden = true;
    loggedInEl.hidden = false;
    emailLabel.textContent = currentUser.email;
  } else {
    loggedOutEl.hidden = false;
    loggedInEl.hidden = true;
  }
}