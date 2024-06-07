function skipTask() {}

const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const today = new Date();
let day = weekday[today.getDay()];
if (0 < today.getDay() && today.getDay() < 6) {document.getElementById(day + "Lunch").classList.add("active");}

function alertClient(title, text) {
  document.querySelector("#alert [title-content]").innerText = title;
  document.querySelector("#alert [text-content]").innerHTML = text;
  document.getElementById("alert").style.display = "block";
}

function randomWindow() {
  const urls = [
    "/bob",
    "/teacher",
    "//google.com",
    "//bing.com",
    "//catsinsinks.com",
    "//update.croomssched.tech",
    "//outlook.com",
    "//collegeboard.org",
    "//example.com",
    "//github.com",
    "//derpybird.glitch.me/error/404.html",
    "//pcjs.org",
  ];

  window.open(urls[getRandomInt(1, 13)]);
}

document.addEventListener('DOMContentLoaded', () => {
  const schedMessenger = new BroadcastChannel("sched-messenger");
  schedMessenger.onmessage = (event) => {
    if (event.data === "lessThan10Minutes") {

    }
  };

  let goto = new URL(document.location).searchParams.get("goto");
  if (goto === "gradecalc") {
    loadTool("gradecalc", "https://gradecalc.kones.tech", true);
  } else if (goto === "daily-poll" || goto === "poll") {
    loadTool("poll-viewer", "https://poll.croomssched.tech", false);
  } else if (goto === "download" || goto === "download-app" || goto === "app") {
    downloadApp();
  }
});