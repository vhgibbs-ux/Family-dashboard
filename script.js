function updateClock(){

    const now = new Date();

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

}

updateClock();
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

document.getElementById("message").innerHTML = greeting;
setInterval(updateClock,1000);
