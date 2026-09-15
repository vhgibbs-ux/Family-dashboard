console.log("SCRIPT VERSION = SEPT 10 TEST");
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
// ================================
// Family Profiles
// ================================

const familyProfiles = {

    Victoria: {

        aliases: ["Victoria", "Mum", "Toria", "Mummm"],

        displayName: "Mumbot",

        heart: "❤️",

        colour: "#D9534F"

    },

    Dave: {

        aliases: ["Dave", "Dad"],

        displayName: "Daddy My Lord",

        heart: "💙",

        colour: "#4A90E2"

    },

    Elizabeth: {

        aliases: ["Elizabeth", "Bean"],

        displayName: "Elizabeth",

        heart: "🩵",

        colour: "#7DD3FC"

    },

    Markus: {

        aliases: ["Markus", "Moo", "Goose", "Goosey"],

        displayName: "Markus",

        heart: "💛",

        colour: "#F4C542"

    },

    Everyone: {

        aliases: [],

        displayName: "Everyone",

        heart: "🤍",

        colour: "#B0BEC5"

    }

};
function getProfile(name) {

    for (const profile of Object.values(familyProfiles)) {

        if (profile.aliases.includes(name)) {
            return profile;
        }

    }

    return familyProfiles.Everyone;

}

function populateTaskOwnerMenu() {
    const select = document.getElementById("taskOwner");
    if (!select) return;

    select.innerHTML = Object.entries(familyProfiles)
        .map(([key, profile]) => `
            <option value="${key}">
                ${profile.heart} ${profile.displayName}
            </option>
        `)
        .join("");
}

// =========================
// Calendar Today
// =========================

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

        const data = await response.json();

        displayCalendar(data);

        console.log("Calendar loaded:", data);

    } catch (err) {

        console.error("Calendar error:", err);

    }

}

function displayCalendar(data) {

    const todayContainer = document.getElementById("today-events");
    const weekContainer = document.getElementById("week-events");

    const events = data.items || [];

    const today = new Date();
    today.setHours(0,0,0,0);

    const todayEvents = events.filter(event => {

        const start = new Date(event.start.dateTime || event.start.date);
        start.setHours(0,0,0,0);

        return start.getTime() === today.getTime();

    });

    renderEvents(
        todayContainer,
        todayEvents,
        "No events today 🎉"
    );

    const weekStart = new Date(today);

    const day = (weekStart.getDay() + 6) % 7;

    weekStart.setDate(weekStart.getDate() - day);

    const weekEnd = new Date(weekStart);

    weekEnd.setDate(weekEnd.getDate() + 7);

    const weekEvents = events.filter(event => {

        const start = new Date(event.start.dateTime || event.start.date);

        return start >= weekStart && start < weekEnd;

    });

    renderWeek(weekContainer, weekEvents);

}

function renderEvents(container, eventList, emptyMessage) {

    if (!container) return;

    if (eventList.length === 0) {

        container.innerHTML = `<li>${emptyMessage}</li>`;
        return;

    }

    container.innerHTML = eventList.map(event => {

        const date = new Date(event.start.dateTime || event.start.date);

        const start = event.start.dateTime
            ? date.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit"
            })
            : "All day";

        const profile = getProfile(event.calendarName);

        return `
<li class="calendar-event">
    <strong>${start}</strong>
    ${profile.heart}
    <span class="calendar-person">${profile.displayName}</span>
    — ${event.summary}
</li>`;

    }).join("");

}
// =========================
// Calendar this week
// =========================

function renderWeek(container, events) {

    if (!container) return;

    events.sort((a,b)=>
        new Date(a.start.dateTime || a.start.date) -
        new Date(b.start.dateTime || b.start.date)
    );

    let html = "";

    let currentDay = "";

events.forEach(event => {

    const date = new Date(event.start.dateTime || event.start.date);

    const day = date.toLocaleDateString("en-GB", {
        weekday: "long"
    });

    if (day !== currentDay) {
        currentDay = day;

        html += `
<div class="week-day-heading">
    ${day}
</div>`;
    }

    const profile = getProfile(event.calendarName);

    const start = event.start.dateTime
        ? date.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit"
        })
        : "All day";

    html += `
<div class="week-event">
    <span class="week-time">${start}</span>
    <span class="week-person">
        ${profile.heart} ${profile.displayName}
    </span>
    <span class="week-summary">${event.summary}</span>
</div>`;

});

    container.innerHTML = html;

}
// =========================
// Weather
// =========================

async function loadWeather() {

    const weather = document.getElementById("weather-content");

    try {

        const response = await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=50.7192&longitude=-1.8808&current=temperature_2m,weather_code,wind_speed_10m&timezone=Europe%2FLondon"
        );

        const data = await response.json();

        const temperature = Math.round(data.current.temperature_2m);
        const wind = Math.round(data.current.wind_speed_10m);
        const code = data.current.weather_code;

        let icon = "🌤️";
        let description = "Mixed weather";

        if (code === 0) {
            icon = "☀️";
            description = "Clear sky";
        } else if (code <= 3) {
            icon = "🌤️";
            description = "Partly cloudy";
        } else if (code <= 48) {
            icon = "🌫️";
            description = "Foggy";
        } else if (code <= 67) {
            icon = "🌧️";
            description = "Rain";
        } else if (code <= 77) {
            icon = "❄️";
            description = "Snow";
        } else {
            icon = "⛈️";
            description = "Showers / storms";
        }

        weather.innerHTML = `
            <div class="weather-main">
                <span class="weather-icon">${icon}</span>
                <span class="weather-temp">${temperature}°C</span>
            </div>
            <div class="weather-description">${description}</div>
            <div class="weather-wind">💨 Wind ${wind} km/h</div>
        `;

    } catch (error) {

        weather.innerHTML = "Weather unavailable right now.";

        console.error("Weather error:", error);
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

    person: "Elizabeth",

    title: "🎉 Happy Birthday Elizabeth! 🎂",

    message: "Have the most wonderful day ❤️"
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
if(!celebration){

    return;

}
document.body.classList.add("birthday");
showBirthdayScene(celebration);
document.getElementById("message").innerHTML =
    `<strong>${celebration.title}</strong><br>
     Today we're celebrating ${celebration.person}! ❤️<br>
     ${celebration.message}`;

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

    if (!document.body.classList.contains("birthday")) {
    document.getElementById("message").innerHTML =
        greeting;
}

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

// =========================
// BIRTHDAY CELEBRATION SCENE
// =========================
function showBirthdayScene(celebration) {

    const scene = document.getElementById("birthday-scene");

    scene.innerHTML = `
    <div id="birthday-confetti"></div>
       <div class="birthday-content">

      <div class="birthday-banner">
    ${celebration.title}
</div>

        <p>${celebration.message}</p>

        <img src="images/Dancing-Snoopy-1.png" id="birthday-snoopy">

    </div>
`;

// CONFETTI
const confetti = document.getElementById("birthday-confetti");

for (let i = 0; i < 80; i++) {
    const piece = document.createElement("span");

    piece.className = "confetti-piece";

    piece.style.left = Math.random() * 100 + "%";
    piece.style.animationDelay = Math.random() * 3 + "s";
    piece.style.animationDuration = 3 + Math.random() * 3 + "s";

    confetti.appendChild(piece);
}

// SNOOPY
 const snoopy = document.getElementById("birthday-snoopy");

    const snoopyFrames = [
        "images/Dancing-Snoopy-1.png",
        "images/Dancing-Snoopy-2.png",
        "images/Dancing-Snoopy-3.png",
        "images/Dancing-Snoopy-4.png",
        "images/Dancing-Snoopy-3.png",
        "images/Dancing-Snoopy-2.png"
    ];

    let frame = 0;

    setInterval(() => {
        frame = (frame + 1) % snoopyFrames.length;
        snoopy.src = snoopyFrames[frame];
    }, 250);

}
checkCelebrations();

setInterval(updateClock,1000);

loadCalendar();
loadWeather();
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

function renderTasks() {
  console.log("NEW renderTasks is running");

    const list = document.getElementById("taskList");

    list.innerHTML = "";

    tasks.forEach((task, index) => {

console.log(task.owner);

const profile = getProfile(task.owner);

        const li = document.createElement("li");

        li.innerHTML = `
            <input
                type="checkbox"
                onchange="toggleTask(${index})">

            <span style="color:${profile.colour}">
                ${profile.heart} ${profile.displayName}
            </span>

            — ${task.text}
        `;

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
populateTaskOwnerMenu();
loadTasks();
// =========================
// Scene Navigation
// =========================
const scenes = [
    "today-scene",
    "week-scene",
    "radar-scene",
    "food-scene"
];
let currentScene = 0;
function showScene() {

    scenes.forEach(sceneId => {

        document.getElementById(sceneId).style.display = "none";

    });

    document.getElementById(scenes[currentScene]).style.display = "block";
}
function nextScene() {

    currentScene++;

    if (currentScene >= scenes.length) {
        currentScene = 0;
    }

    showScene();
}
// Go right one scene arrow
document.getElementById("next-scene").addEventListener("click", nextScene);
function prevScene() {

    currentScene--;

    if (currentScene < 0) {
        currentScene = scenes.length - 1;
    }

    showScene();
}
// Go left one scene arrow
document.getElementById("prev-scene").addEventListener("click", prevScene);