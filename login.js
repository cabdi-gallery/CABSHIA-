
// CABSHIA - SUPABASE AUTHENTICATION

const SUPABASE_URL = "https://gllpjskthchlvrhaafuj.supabase.co";
const SUPABASE_KEY = "sb_publishable_eTc0tFn1jSmOIxy6aF6Qwg_-hBMqkXh";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// Login elements
const passwordInput = document.getElementById("password");
const toggleButton = document.getElementById("togglePassword");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

// Show / Hide password
toggleButton.addEventListener("click", function () {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleButton.textContent = "Hide";
        toggleButton.setAttribute("aria-label", "Hide password");
    } else {
        passwordInput.type = "password";
        toggleButton.textContent = "Show";
        toggleButton.setAttribute("aria-label", "Show password");
    }
});

// Real Supabase Login
loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = passwordInput.value;

    loginMessage.textContent = "Signing in...";

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        loginMessage.textContent = "Login failed. Check your email and password.";
        return;
    }

    loginMessage.textContent = "Welcome to CABSHIA!";

window.location.href = "dashboard.html";

    // Dashboard will be connected in the next step.
});
