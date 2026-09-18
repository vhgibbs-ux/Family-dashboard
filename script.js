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
// Snoopy Selection
// =========================

function getSnoopyCategoryWeights() {

    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const hour = today.getHours();

    const categories = [];

    // ALWAYS available
    categories.push({
        category: "Random",
        weight: 1
    });

    // SEASONS
    if ([12, 1, 2].includes(month)) {
        categories.push({
            category: "Winter",
            weight: 2
        });
    }

    if ([3, 4, 5].includes(month)) {
        categories.push({
            category: "Spring",
            weight: 2
        });
    }

    if ([6, 7, 8].includes(month)) {
        categories.push({
            category: "Summer",
            weight: 2
        });
    }

    if ([9, 10, 11].includes(month)) {
        categories.push({
            category: "Autumn",
            weight: 2
        });
    }

        // =========================
    // SPECIAL DAYS
    // =========================

    // CHRISTMAS
    if (month === 12 && day >= 1 && day <= 25) {
        categories.push({
            category: "Christmas",
            weight: day === 25 ? 999 : 4
        });
    }

    // NEW YEAR
    if (month === 12 && day >= 28 && day <= 31) {
        categories.push({
            category: "New Year",
            weight: 4
        });
    }

    // HALLOWEEN
    if (month === 10 && day >= 15 && day <= 31) {
        categories.push({
            category: "Halloween",
            weight: day === 31 ? 999 : 3
        });
    }

    // EASTER
    const easter = getEasterSunday(today.getFullYear());

    const easterStart = new Date(easter);
    easterStart.setDate(easter.getDate() - 14);

    if (today >= easterStart && today <= easter) {
        categories.push({
            category: "Easter",
            weight: today.toDateString() === easter.toDateString() ? 999 : 3
        });
    }

    // VALENTINE'S DAY
    const valentines = new Date(today.getFullYear(), 1, 14);

    const valentinesStart = new Date(valentines);
    valentinesStart.setDate(valentines.getDate() - 14);

    if (today >= valentinesStart && today <= valentines) {
        categories.push({
            category: "Valentine's Day",
            weight: today.toDateString() === valentines.toDateString() ? 999 : 3
        });
    }

    // THANKSGIVING
    const thanksgiving = getThanksgiving(today.getFullYear());

    const thanksgivingStart = new Date(thanksgiving);
    thanksgivingStart.setDate(thanksgiving.getDate() - 14);

    if (today >= thanksgivingStart && today <= thanksgiving) {
        categories.push({
            category: "Thanksgiving",
            weight: today.toDateString() === thanksgiving.toDateString() ? 999 : 3
        });
    }

    // WEDNESDAY
    if (today.getDay() === 3) {
        categories.push({
            category: "Wednesday",
            weight: 1
        });
    }

    // TIME OF DAY
    if (hour <= 11) {
        categories.push({
            category: "Morning",
            weight: 1
        });
    } else if (hour <= 16) {
        categories.push({
            category: "Afternoon",
            weight: 1
        });
    } else {
        categories.push({
            category: "Evening",
            weight: 1
        });
    }

    // LUNCH
    if (hour >= 12 && hour <= 16) {
        categories.push({
            category: "Lunch",
            weight: 1
        });
    }

    return categories;
}
// =========================
// Calculate Easter Sunday
// =========================

function getEasterSunday(year) {

    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);

    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;

    return new Date(year, month - 1, day);
}
// =========================
// Calculate Thanksgiving
// =========================

function getThanksgiving(year) {

    const novemberFirst = new Date(year, 10, 1);
    const firstThursday = 1 + ((4 - novemberFirst.getDay() + 7) % 7);

    return new Date(year, 10, firstThursday + 21);
}

// =========================
// Find Snoopy images in a category folder
// =========================

async function getSnoopyImages(category) {

   const url = `https://api.github.com/repos/vhgibbs-ux/Family-dashboard/contents/images/Snoopy/Single/${category}`;

console.log("SNOOPY URL:", url);

const response = await fetch(url);

    const files = await response.json();
console.log("SNOOPY FILES:", files);
    return files
        .filter(file => file.name.toLowerCase().endsWith(".png"))
        .map(file => file.download_url);
}
// =========================
// Choose Snoopy function
// =========================

function chooseSnoopyCategory(categories) {

    const totalWeight = categories.reduce(
        (total, item) => total + item.weight,
        0
    );

    let random = Math.random() * totalWeight;

    for (const item of categories) {
        random -= item.weight;

        if (random < 0) {
            return item.category;
        }
    }
}
async function loadSnoopy() {

    const categories = getSnoopyCategoryWeights();
    const category = chooseSnoopyCategory(categories);
    const images = await getSnoopyImages(category);

    if (images.length === 0) {
        console.warn("No Snoopy images found for:", category);
        return;
    }

    const randomImage = images[Math.floor(Math.random() * images.length)];
    document.getElementById("snoopy-image").src = randomImage;
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
loadSnoopy();
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
    "food-scene",
     "snoopy-strip"

];

const sceneTimings = [
    30,  // Today
    20,  // This Week
    20,  // On the Radar
    30,  // Food Planning
    20   // Snoopy Strip
];

let sceneTimer;
function resetSceneTimer() {
    clearTimeout(sceneTimer);

    sceneTimer = setTimeout(() => {
        nextScene();
    }, sceneTimings[currentScene] * 1000);
}
let currentScene = 0;
function showScene() {

    scenes.forEach(sceneId => {

        document.getElementById(sceneId).style.display = "none";

    });

    document.getElementById(scenes[currentScene]).style.display = "block";
 resetSceneTimer();

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
showScene();
// =========================
// SWIPE SCENE NAVIGATION
// =========================

let touchStartX = 0;

document.addEventListener("touchstart", function(event) {
    touchStartX = event.changedTouches[0].screenX;
});

document.addEventListener("touchend", function(event) {
    const touchEndX = event.changedTouches[0].screenX;
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) < 50) {
        return;
    }

    if (swipeDistance < 0) {
        nextScene();
    } else {
        prevScene();
    }
});