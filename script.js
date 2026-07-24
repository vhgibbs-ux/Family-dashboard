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

// =========================
// Tasks
// =========================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks(){

    localStorage.setItem("tasks", JSON.stringify(tasks));

}

function renderTasks(){

    const list = document.getElementById("taskList");

    list.innerHTML = "";

    tasks.forEach((task,index)=>{

        const li = document.createElement("li");

        li.innerHTML =
        `<input type="checkbox"
        onchange="toggleTask(${index})">

        ${task}`;

        list.appendChild(li);

    });

}

function addTask(){

    const input = document.getElementById("taskInput");

    if(input.value.trim() === "") return;

    tasks.push(input.value);

    input.value="";

    saveTasks();

    renderTasks();

}

function toggleTask(index){

    tasks.splice(index,1);

    saveTasks();

    renderTasks();

}

renderTasks();
