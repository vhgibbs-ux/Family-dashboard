/* ==========================================
   Grubbins Family Dashboard
   script.js

   Controls the live information shown on the
   dashboard.

   Last updated: Session 7
========================================== */

function updateClock(){

    // =========================
    // Current date and time
    // =========================

    const now = new Date();


    // =========================
    // Update today's date
    // =========================

    document.getElementById("today").innerHTML =
    now.toLocaleDateString("en-GB",{
        weekday:"long",
        day:"numeric",
        month:"long"
    });


    // =========================
    // Update the clock
    // =========================

    document.getElementById("clock").innerHTML =
    now.toLocaleTimeString("en-GB",{
        hour:"2-digit",
        minute:"2-digit"
    });


    // =========================
    // Choose a greeting
    // =========================

    const hour = now.getHours();

    let greeting = "";

    if(hour < 12){
        greeting = "☀️ God morgon!";
    }
    else if(hour < 18){
        greeting = "🌤️ God afton!";
    }
    else{
        greeting = "🌙 God kväll!";
    }


    // =========================
    // Bin reminder
    // (Temporary placeholder)
    // =========================

    const bin = document.getElementById("bin");

    if (bin){
        bin.innerHTML = "⬛ Black Bin<br><small>Collection Monday</small>";
    }


    // =========================
    // Display the greeting
    // =========================

    document.getElementById("message").innerHTML = greeting;

}


// =========================
// Start Grubbins
// =========================

updateClock();


// =========================
// Refresh every second
// =========================

setInterval(updateClock,1000);
