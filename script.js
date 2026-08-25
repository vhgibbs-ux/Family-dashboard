/* ==========================================
   Grubbins Family Dashboard
   script.js

   Controls the live information shown on the
   dashboard.

   VERSION 27 JULY - TEST
========================================== */

// ================================
// Grubbins Configuration
// ================================

const GRUBBINS = {
  CORE_URL: "https://grubbins-core.v-h-gibbs.workers.dev",
  API_KEY: "ErasmusFamilj04"
};

async function loadCalendar() {

  try {

    const response = await fetch(
      `${GRUBBINS.CORE_URL}/calendar`,
      {
        headers: {
          "X-Grubbins-Key": GRUBBINS.API_KEY
        }
      }
    );
function displayCalendar(data) {

  const todayContainer = document.getElementById("today-events");
  const weekContainer = document.getElementById("week-events");

  const events = data.items || [];

  const today = new Date().toDateString();

  const todayEvents = events.filter(event => {

    if (!event.start.dateTime) {
      return false;
    }

    return new Date(event.start.dateTime).toDateString() === today;

  });

  const renderEvents = (container, eventList, emptyMessage) => {

    if (!container) return;

    if (eventList.length === 0) {
      container.innerHTML = `<li>${emptyMessage}</li>`;
      return;
    }

    container.innerHTML = eventList.map(event => {

      const start = event.start.dateTime
        ? new Date(event.start.dateTime).toLocaleTimeString(
            "en-GB",
            {
              hour: "2-digit",
              minute: "2-digit"
            }
          )
        : "All day";

      return `
        <li class="calendar-event">
          <strong>${start}</strong>
          ${event.summary}
        </li>
      `;

    }).join("");

  };


  renderEvents(
    todayContainer,
    todayEvents,
    "No events today 🎉"
  );


  renderEvents(
    weekContainer,
    events,
    "No upcoming events"
  );

}
    const data = await response.json();


window.grubbinsCalendar = data;
displayCalendar(data);
console.log("Calendar loaded:", data);

  } catch (err) {

    console.error("Calendar error:", err);

  }

}
function updateBinIndicator() {

    const indicator = document.getElementById("bin-indicator");

    if (!indicator) return;

    // Wednesday 19 August 2026 marks the start of a BLUE week.
    const referenceWednesday = new Date("2026-08-19");

    const today = new Date();

    // Find the Wednesday for the current week
    const currentWednesday = new Date(today);

    while (currentWednesday.getDay() !== 3) {
        currentWednesday.setDate(currentWednesday.getDate() - 1);
    }

    const weeks = Math.floor(
        (currentWednesday - referenceWednesday) /
        (1000 * 60 * 60 * 24 * 7)
    );

    const blueWeek = weeks % 2 === 0;

    indicator.className =
        blueWeek ? "bin blue" : "bin black";

}
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

updateClock();
updateBinIndicator();

setInterval(updateClock,1000);
loadCalendar();
// =========================
// Tasks
// =========================

let tasks = [];

async function loadTasks() {

    const response = await fetch(

        `${GRUBBINS.CORE_URL}/tasks`,

        {
            headers:{
                "X-Grubbins-Key":GRUBBINS.API_KEY
            }
        }

    );

    tasks = await response.json();

    renderTasks();

}

async function saveTasks(){

    await fetch(

        `${GRUBBINS.CORE_URL}/tasks`,

        {
            method:"POST",

            headers:{
                "Content-Type":"application/json",
                "X-Grubbins-Key":GRUBBINS.API_KEY
            },

            body:JSON.stringify(tasks)

        }

    );

}
const familyIcons = {

    "Everyone":"🤍",
    "Mumum":"❤️",
    "Dad":"💙",
    "Elizabeth":"🩵",
    "Markus":"💛"

};

function renderTasks(){

    const list = document.getElementById("taskList");

    list.innerHTML = "";

    tasks.forEach((task,index)=>{

    const li = document.createElement("li");

    li.innerHTML =
    `<input type="checkbox"
    onchange="toggleTask(${index})">

    <strong>${familyIcons[task.owner]} ${task.owner}</strong><br>

    ${task.text}`;

    list.appendChild(li);

});
}

async function addTask(){

    const input = document.getElementById("taskInput");
    const owner = document.getElementById("taskOwner").value;

    if (input.value.trim() === "") return;

    tasks.push({

        text: input.value,
        owner: owner

    });

    input.value="";


    saveTasks();

    renderTasks();

}

async function toggleTask(index){

    tasks.splice(index,1);

    await saveTasks();

    renderTasks();

}

loadTasks();
