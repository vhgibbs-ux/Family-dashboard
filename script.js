function updateClock(){
    // Current date and time

    const now = new Date();

    // Update today's date

    document.getElementById("today").innerHTML =
    now.toLocaleDateString("en-GB",{
        weekday:"long",
        day:"numeric",
        month:"long"
    });

    document.getElementById("clock").innerHTML =
    now.toLocaleTimeString("en-GB",{
        hour:"2-digit",
        minute:"2-digit"
    });
    
const hour = now.getHours();

// Choose a greeting
    
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

// Update the bin reminder
document.getElementById("bin").innerHTML =
"⬛ Black Bin<br><small>Collection Monday</small>";

// Display the greeting
document.getElementById("message").innerHTML = greeting;

}

updateClock();

// Refresh every second
setInterval(updateClock,1000);
