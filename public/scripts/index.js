function skipTask() {}

const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const today = new Date();
let day = weekday[today.getDay()];
if (0 < today.getDay() && today.getDay() < 6) {
    document.getElementById(day + "Lunch").classList.add("active");
}

function randomWindow() {
    const urls = ["/bob", "/teacher", "https://google.com", "https://bing.com", "https://catsinsinks.com",
        "https://app.croomssched.tech", "https://outlook.com", "https://collegeboard.org", "https://example.com",
        "https://github.com", "https://derpybird.glitch.me/error/404.html", "https://pcjs.org",];

    window.open(urls[getRandomInt(1, 13)]);
}

function createRotatingInfo() {
    document.getElementById("date-time").classList.add("active");
    setInterval(() => {
        document.getElementById("date-time").innerText = CBSHSched.time.date + "   " + CBSHSched.time.time;
        document.getElementById("current-period").innerText = CBSHSched.period.current + " ends in " + CBSHSched.period.remainingTime;
    }, 1000);

    setInterval(() => {
        document.getElementById("date-time").removeAttribute("class");
        document.getElementById("current-period").classList.add("active");
    }, 30000)

    setInterval(() => {
        document.getElementById("current-period").removeAttribute("class");
        document.getElementById("date-time").classList.add("active");
    }, 40000)
}

document.addEventListener('DOMContentLoaded', () => {
    const schedMessenger = new BroadcastChannel("sched-messenger");
    schedMessenger.onmessage = (event) => {
        if (event.data === "lessThan10Minutes") {
            let newBalloon = alertBalloon("Heads up!", "You have 10 minutes left in " + CBSHSched.period.current + ".", 0);

            setTimeout(() => {
                newBalloon.remove();
            }, 10000);
        } else if (event.data === "oneMinute") {
            let newBalloon = alertBalloon("Almost time!", "You have less than a minute left in " +
                CBSHSched.period.current + ". You might want to start getting ready to go.", 1);

            setTimeout(() => {
                newBalloon.remove();
            }, 10000);
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

    let visitCounter = parseInt(localStorage.getItem("visitCounter"));
    if (isNaN(visitCounter)) {
        welcome("index.html");
        localStorage.setItem("visitCounter", (1).toString());
    } else {
        visitCounter++;
        localStorage.setItem("visitCounter", visitCounter.toString());
    }

    let hurricaneCounter = parseInt(localStorage.getItem("hurricaneCounter"));
    if (isNaN(hurricaneCounter)) {
        welcome("hurricane.html");
        localStorage.setItem("hurricaneCounter", (1).toString());
    }

    createCBSHSched(document.getElementById("sched"));
    createRotatingInfo();
});