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
        minute:"2-digit",
        second:"2-digit"
    });

}

updateClock();

setInterval(updateClock,1000);
