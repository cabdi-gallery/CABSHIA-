
const SUPABASE_URL = "https://gllpjskthchlvrhaafuj.supabase.co";
const SUPABASE_KEY = "HALKAN_GELI_PUBLISHABLE_KEY_GAAGA";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// Check whether a user is logged in
async function checkLogin() {
  const { data, error } = await supabaseClient.auth.getUser();

  if (error || !data.user) {
    window.location.replace("login.html");
    return;
  }

  document.getElementById("userEmail").textContent =
    data.user.email;
}

checkLogin();

// Live clock
function updateClock() {
  const now = new Date();

  document.getElementById("clock").textContent =
    now.toLocaleTimeString();

  document.getElementById("today").textContent =
    now.toLocaleDateString();
}

updateClock();
setInterval(updateClock, 1000);

// Logout
document.getElementById("logoutBtn").addEventListener("click", async () => {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    alert("Logout failed. Please try again.");
    return;
  }

  window.location.replace("login.html");
});

