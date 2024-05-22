function skipTask() {}

const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const monthnames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const d = new Date();
let year = d.getFullYear();
let month = d.getMonth();
let date = d.getDate();
let day = weekday[d.getDay()];
let hour = d.getHours();
let minutes = d.getMinutes();
let seconds = d.getSeconds();
if (0 < d.getDay() && d.getDay() < 6) {document.getElementById(day + "Lunch").className += " active";}

let x = setInterval(function() {
  const ds = new Date();
  let year = ds.getFullYear();
  let month = ds.getMonth();
  let date = ds.getDate();
  let hour = ds.getHours();
  let minutes = ds.getMinutes();
  let hourshort; let apm;
  if (hour >= 13) {hourshort = hour - 12; apm = "PM";}
  else if (hour === 12) {hourshort = hour; apm = "PM";}
  else if (hour === 0) {hourshort = 12; apm = "AM";}
  else {hourshort = hour; apm = "AM";}

  // CLOCK //
  if (minutes < 10) {minutes = "0" + minutes;}
  document.getElementById("datetime").innerHTML = (month+1) + "/" + date + "/" + year + " " + hourshort + ":" + minutes + " " + apm
}, 1000);

hoverListener("#time-shell-dialog-trigger", "#time-shell-dialog");
hoverListener("#navbutton6", "#dp-shell-dialog");
hoverListener("#copyrights", "#copy-shell-dialog")

if (month < 10) {month = "0"+month;}
if (date < 10) {date = "0"+date;}

function alertClient(title, text) {
  document.querySelector("#alert [title-content]").innerText = title;
  document.querySelector("#alert [text-content]").innerHTML = text;
  document.getElementById("alert").style.display = "block";
}

const welcomeExperience = () => {
  document.getElementById("alert").innerHTML = '' +
      '<div class="details">' +
        '<p style="text-align: center; font-size: 1.3em; font-weight: 600; letter-spacing: 0.3px;">Welcome</p>' +
        '<p style="text-align: center; font-size: 0.8em;">You made it to the new hosting site for the Crooms Bell Schedule! <br> The bell schedule is now <a class="links" href="https://github.com/ajcoolcat/croomssched" target="_blank">open-source</a>, so if there\'s any bugs, make an "issue" (or a <a class="links" href="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests" target="_blank">pull-request</a> if you think you can fix it yourself) on the GitHub repository. ' +
        '<br><br>You also might want to update your bookmarks for the site. <br><br> Anyways, welcome, and enjoy the uninterrupted experience of the new Crooms Bell Schedule website.</p>' +
        '<p style="text-align:center;">' +
          '<button onclick="alertClient(false,null,null)">Close</button>' +
        '</p>' +
      '</div>'
  document.getElementById("alert").style.display = "block";
}

document.body.onload = () => {
  let params = new URL(document.location).searchParams;
  if (params.get("welcomeExperience") === "true") {
    welcomeExperience();
  } else if (params.get("goto") === "gradecalc") {
    gradecalc();
  }
  resizeGradeCalc();
}

window.addEventListener("resize", resizeGradeCalc);

function resizeGradeCalc() {
  document.querySelector(":root").style.setProperty("--window-height",  window.innerHeight - (document.querySelector("ul.navbar").clientHeight + document.querySelector("ul.footbar").clientHeight) + 1 + "px");
}

function randomWindow() {
  const urls = [
    "/bob",
    "/teacher",
    "//croomssched.glitch.me/poll",
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

  let window_to_open = urls[getRandomInt(1, 13)];
  window.open(window_to_open);
}

function clippyFact() {
  const facts = [
    "The Eiffel Tower in Paris was originally intended to be a temporary structure.",
    "The world's oldest known living tree is over 4,800 years old.",
    "The shortest war in history lasted only 38 to 45 minutes.",
    "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.",
    "The average person walks the equivalent of three times around the world in their lifetime.",
    "The world's largest snowflake ever recorded was 15 inches wide.",
    "The Great Wall of China is visible from space.",
    "Penguins have only one mate their entire life.",
    "The world's smallest mammal is the bumblebee bat, weighing about the same as a penny.",
    "The Hawaiian alphabet has only 12 letters.",
    "The oldest known musical instrument is a flute made from a bird bone and over 40,000 years old.",
    "There are more stars in the universe than grains of sand on all the beaches of Earth.",
    "The world's largest pizza was 13,580.28 square feet.",
    "The average person spends six months of their lifetime waiting for red lights to turn green.",
    "The first known use of the word 'hello' as a greeting was in 1826.",
    "The shortest war in history was between Britain and Zanzibar in 1896, lasting only 38 minutes.",
    "The world's largest jigsaw puzzle had over 551,232 pieces.",
    "The largest volcano in the solar system is on Mars.",
    "The average person blinks about 15 to 20 times per minute.",
    "The shortest complete sentence in the English language is 'I am.'",
    "The largest living organism is a fungus in Oregon, USA, covering 2,200 acres.",
    "The world's deepest underwater postbox is in Susami Bay, Japan.",
    "The average person produces enough saliva in their lifetime to fill two swimming pools.",
    "The longest recorded flight of a chicken is 13 seconds.",
    "The first recorded Olympic Games were held in ancient Greece in 776 BC.",
    "The world's largest recorded snowflake was 15 inches wide.",
    "The average person laughs about 15 times a day.",
    "The longest recorded flight of a chicken is 13 seconds.",
    "The world's largest recorded snowflake was 15 inches wide.",
    "The average person laughs about 15 times a day.",
    "The Eiffel Tower in Paris was originally intended to be a temporary structure.",
    "The world's oldest known living tree is over 4,800 years old.",
    "The shortest war in history lasted only 38 to 45 minutes.",
    "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.",
    "The average person walks the equivalent of three times around the world in their lifetime.",
    "The world's largest snowflake ever recorded was 15 inches wide.",
    "The Great Wall of China is visible from space.",
    "Penguins have only one mate their entire life.",
    "The world's smallest mammal is the bumblebee bat, weighing about the same as a penny.",
    "The Hawaiian alphabet has only 12 letters.",
    "The oldest known musical instrument is a flute made from a bird bone and over 40,000 years old.",
    "There are more stars in the universe than grains of sand on all the beaches of Earth.",
    "The world's largest pizza was 13,580.28 square feet.",
    "The average person spends six months of their lifetime waiting for red lights to turn green.",
    "The first known use of the word 'hello' as a greeting was in 1826.",
    "The shortest war in history was between Britain and Zanzibar in 1896, lasting only 38 minutes.",
    "The world's largest jigsaw puzzle had over 551,232 pieces.",
    "The largest volcano in the solar system is on Mars.",
    "The average person blinks about 15 to 20 times per minute.",
    "The shortest complete sentence in the English language is 'I am.'",
    "The largest living organism is a fungus in Oregon, USA, covering 2,200 acres.",
    "The world's deepest underwater postbox is in Susami Bay, Japan.",
    "The average person produces enough saliva in their lifetime to fill two swimming pools.",
    "The longest recorded flight of a chicken is 13 seconds.",
    "The first recorded Olympic Games were held in ancient Greece in 776 BC.",
    "The world's largest recorded snowflake was 15 inches wide.",
    "The average person laughs about 15 times a day.",
    "The longest recorded flight of a chicken is 13 seconds.",
    "The world's largest recorded snowflake was 15 inches wide.",
    "The average person laughs about 15 times a day."
  ];

  clippyAgent.speak(facts[getRandomInt(0, facts.length - 1)]);
}

function allowClippyStartup() {
  localStorage.setItem("clippyStart", "allowed");
}

function blockClippyStartup() {
  localStorage.setItem("clippyStart", "blocked");
}

if (window.history.length > 1) {
  document.querySelector("[menu-id=main] [role=back]").style.display = "block";
  document.querySelector("[menu-id=main] [role=forward]").style.display = "block";
} else {
  document.querySelector("[menu-id=main] [role=back]").style.display = "none";
  document.querySelector("[menu-id=main] [role=forward]").style.display = "none";
}

document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});
document.addEventListener('DOMContentLoaded', () => {
  setRightClick(document.querySelector("main"), document.querySelector("[menu-id=main]"));
  setRightClick(document.querySelector("ul.navbar"), document.querySelector("[menu-id=random]"));
  document.querySelectorAll("window").forEach((window) => {
    setRightClick(
        document.querySelector("window[windowid='"+ window.attributes.windowid.value + "'] header"),
        document.querySelector("[menu-id=dialog-controls]")
    );
  });

  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    setRightClick(document.querySelector("clippy"), document.querySelector("[menu-id=clippy-debug]"));
  } else {setRightClick(document.querySelector("clippy"), document.querySelector("[menu-id=clippy]"));}

  const schedMessenger = new BroadcastChannel("sched-messenger");
  schedMessenger.onmessage = (event) => {
    if (event.data === "lessThan10Minutes") {
      clippyAgent.play("GetAttention");
      clippyAgent.speak("You have less than 10 minutes remaining in the current period.");
    } else if (event.data === "oneMinute") {
      clippyAgent.play("GetAttention");
      clippyAgent.speak("You have one minute remaining in the current period." +
          " Consider packing up and getting ready to go.");
    } else if (event.data === "startClass") {
      clippyAgent.speak("Class has started.")
    }
  };

  resizeGradeCalc();
  getInfo(); setInterval(getInfo, 60000);
  getAlerts(); setInterval(getAlerts, 60000);
  getFeed(); setInterval(getFeed, 30000);
  getForecast(); setInterval(getForecast, 60000);
});
document.body.click();
main();