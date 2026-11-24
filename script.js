
/* =================================
   CABSHIA WEBSITE
   Main JavaScript
================================= */

// Live clock and date

function updateClock() {

    const now = new Date();

    const clock = document.getElementById("clock");
    const date = document.getElementById("date");

    if (!clock || !date) return;

    const time = now.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    const today = now.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    clock.textContent = time;
    date.textContent = today;
}

// Start clock

updateClock();

setInterval(updateClock, 1000);


// Welcome message in console

console.log("Welcome to CABSHIA!");
console.log("Two People. One Friendship. Many Memories.");

