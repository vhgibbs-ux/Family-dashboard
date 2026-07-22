const today = new Date();

document.getElementById("today").innerHTML =
today.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long"
});
