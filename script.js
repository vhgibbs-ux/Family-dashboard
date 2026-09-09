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

   const events = (data.items || []).filter(event => {

  const startString = event.start.dateTime || event.start.date;

  if (!startString) return false;

  const eventDate = new Date(startString);

  // Monday of this week
  const weekStart = new Date();
  weekStart.setHours(0, 0, 0, 0);

  const day = weekStart.getDay(); // Sun=0 ... Sat=6
  const daysSinceMonday = (day + 6) % 7;

  weekStart.setDate(weekStart.getDate() - daysSinceMonday);

  // Monday next week
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  return eventDate >= weekStart && eventDate < weekEnd;

});
   
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
console.log(event);
 const date = event.start.dateTime
  ? new Date(event.start.dateTime)
  : new Date(event.start.date);

const start = event.start.dateTime
  ? date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit"
    })
  : "All day";

return `
<li class="calendar-event">
  <strong>${start}</strong>
  ${event.calendarIcon}
  <span class="calendar-person">${event.calendarName}</span>
  — ${event.summary}
</li>
`;

    }).join("");

  };


  renderEvents(
    todayContainer,
    todayEvents,
    "No events today 🎉"
  );


  const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

let html = "";

for (let day = 1; day <= 7; day++) {

  const dayEvents = events.filter(event => {

    const date = new Date(event.start.dateTime || event.start.date);

    return date.getDay() === (day % 7);

  });

  html += `<h3>${weekdays[day % 7]}</h3>`;

  if (dayEvents.length === 0) {

    continue;

  }

  dayEvents.forEach(event => {

    const date = new Date(event.start.dateTime || event.start.date);

    const start = event.start.dateTime
      ? date.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit"
        })
      : "All day";

html += `
<div class="week-event">
  <span class="week-time">${start}</span>
  <span class="week-person">${event.calendarIcon} ${event.calendarName}</span>
  <span class="week-summary">${event.summary}</span>
</div>
`;

  });

}

weekContainer.innerHTML = html;

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
// =========================
// Celebrations
// =========================

const celebrations = [

    {
        month: 9,
        day: 20,
        title: "🎉 Happy Birthday Elizabeth! 🎂",
        message: "We hope you have the most wonderful day ❤️"
    }

];

function checkCelebrations(){

    const today = new Date();

    const month = today.getMonth() + 1;
    const day = today.getDate();

    const celebration = celebrations.find(event =>
        event.month === month &&
        event.day === day
    );

    if(!celebration) return;

    document.getElementById("message").innerHTML =
        `<strong>${celebration.title}</strong><br>${celebration.message}`;

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
checkCelebrations();

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
    "Mummm":"❤️",
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


await saveTasks();
renderTasks();

}

async function toggleTask(index){

    tasks.splice(index,1);

    await saveTasks();

    renderTasks();

}

loadTasks();
