
// CABSHIA LOGIN INTERACTIONS

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

// Temporary login message
// Real authentication will be connected to Supabase later.

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    loginMessage.textContent =
        "Login is being prepared. Please come back soon.";

});

