
// CABSHIA MEMORY WALL

// Xaqiiji in qofku login ku jiro
const SUPABASE_URL = "https://gllpjskthchlvrhaafuj.supabase.co";
const SUPABASE_KEY = "sb_publishable_eTc0tFn1jSmOIxy6aF6Qwg_-hBMqkXh";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

async function checkMemoryAccess() {
  const { data, error } = await supabaseClient.auth.getUser();

  if (error || !data.user) {
    window.location.replace("login.html");
    return;
  }
}

checkMemoryAccess();

// Saacadda iyo taariikhda
function updateMemoryDate() {
  const now = new Date();

  const dateElement = document.getElementById("memoryDate");

  if (dateElement) {
    dateElement.textContent = now.toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      }
    );
  }
}

updateMemoryDate();
