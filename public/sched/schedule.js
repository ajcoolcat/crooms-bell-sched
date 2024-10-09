const schedMessenger = new BroadcastChannel("sched-messenger");
const appStyles = document.createElement("link");
appStyles.rel = "stylesheet";
appStyles.type = "text/css";
appStyles.href = "https://croomssched.tech/sched/app.css";
document.head.appendChild(appStyles);
let CBSHSched = {
    "time": {
        "date": "1/1/2024",
        "time": "12:00 AM"
    },
    "day": "Today is a day.",
    "period": {
        "current": "Current Period",
        "next": "Next Period",
        "remainingTime": "2:00:00"
    }
}

let Settings = {
    "periodNames": {}
};

let Schedules = {
    "days": {}
};

function createCBSHSched(element) {
    const application = document.createElement("div");
    application.id = "cbsh-application";
    element.appendChild(application);

    fetch("https://api.croomssched.tech/v1/today").then((res) => {
        return res.text();
    }).then((res) => {
        return JSON.parse(res).data;
    }).then((res) => {
        Schedules = res;
    }).finally(() => {
        fixMissingSettings();
    });
}

function fixMissingSettings() {
    fetch("https://croomssched.tech/sched/defaultSettings.json").then((res) => {
        return res.text();
    }).then((res) => {
        return JSON.parse(res);
    }).then((Settings) => {
        let SavedSettings = JSON.parse(window.localStorage.getItem("settings"));
        if (SavedSettings) {
            for (const obj in Settings) {
                if (SavedSettings[obj] === undefined) {
                    console.log(obj, " is missing!");

                    if (obj === "theme" && window.matchMedia("screen and (prefers-color-scheme: dark)")) {
                        SavedSettings[obj] = "dark";
                    } else {
                        SavedSettings[obj] = Settings[obj];
                    }
                }
            }
            SavedSettings.font.values = Settings.font.values;
        } else {
            SavedSettings = Settings;
        }
        window.localStorage.setItem("settings", JSON.stringify(SavedSettings));
        loadSettings();
    }).catch((e) => {
        console.error(e);
    });
}

const inIframe = () => {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

function loadSettings() {
    if (window.localStorage.getItem("settings") === null) {
        xhr = new XMLHttpRequest();
        xhr.open("GET", "https://croomssched.tech/schedule/defaultSettings.json");
        xhr.responseType = "json";
        xhr.send();
        xhr.onload = function () {
            Settings = xhr.response;
            window.localStorage.setItem("settings", JSON.stringify(Settings));
        }
        startSched();
    } else {
        Settings = JSON.parse(window.localStorage.getItem("settings"));
        startSched();
    }
}

let current_lunch = 1;

function startSched(element) {
    let inAnIframe = inIframe();

    try {
        if (inAnIframe && window.top.location.hostname === "croomssched.tech") {
            document.body.style.margin = "0";
            schedMessenger.postMessage("initialized");
        }

        if (inAnIframe && Settings.theme === "light") {
            document.body.backgroundColor = "white";
        } else if (inAnIframe && Settings.theme === "dark") {
            document.documentElement.backgroundColor = "#282828";
        }
    } catch {
        inIframe()
    }

    let isALunch;
    let isBLunch;

    if (Settings.defaultLunch === "B Lunch") {
        isALunch = false;
        isBLunch = true;
        current_lunch = 2;
    } else {
        isALunch = true;
        isBLunch = false;
        current_lunch = 1;
    }

    let eventNumber = 1;

    const application = document.getElementById("cbsh-application");

    const statusDiv = document.createElement("div");
    application.appendChild(statusDiv);
    const buttonDiv = document.createElement("div");
    application.appendChild(buttonDiv);

    const DateAndTime = document.createElement("p");
    const SchoolDayType = document.createElement("p");
    const CurrentPeriodMain = document.createElement("p");
    const CurrentPeriod = document.createElement("span");
    const CurrentPeriodSeconds = document.createElement("span");

    DateAndTime.innerText = "Loading..."
    SchoolDayType.innerText = "Loading..."
    CurrentPeriod.innerText = "Loading..."
    CurrentPeriodSeconds.innerText = "Loading..."

    statusDiv.appendChild(DateAndTime);
    statusDiv.appendChild(SchoolDayType);
    statusDiv.appendChild(CurrentPeriodMain);
    CurrentPeriodMain.appendChild(CurrentPeriod);
    CurrentPeriodMain.appendChild(CurrentPeriodSeconds);

    const ALunchButton = document.createElement("button");
    const BLunchButton = document.createElement("button");
    const SettingsButton = document.createElement("button");

    isALunch ? ALunchButton.className = "active" : ALunchButton.click();
    isBLunch ? BLunchButton.className = "active" : BLunchButton.click();

    ALunchButton.innerText = "A Lunch";
    ALunchButton.title = "Switch to A Lunch.";

    BLunchButton.innerText = "B Lunch";
    BLunchButton.title = "Switch to B Lunch.";

    SettingsButton.innerText = "Settings";
    SettingsButton.title = "Open the Bell Schedule settings.";

    buttonDiv.appendChild(ALunchButton);
    buttonDiv.appendChild(BLunchButton);
    buttonDiv.appendChild(SettingsButton);

    ALunchButton.addEventListener("click", () => {
        ALunchButton.classList.add("active")
        BLunchButton.classList.remove("active");
        CurrentPeriod.innerText = "Please wait...";
        CurrentPeriodSeconds.innerText = "";

        current_lunch = 1;
        mainLoop();
    }, false);

    BLunchButton.addEventListener("click", () => {
        ALunchButton.classList.remove("active")
        BLunchButton.classList.add("active");
        CurrentPeriod.innerText = "Please wait...";
        CurrentPeriodSeconds.innerText = "";

        current_lunch = 2;
        mainLoop();
    }, false);

    SettingsButton.addEventListener("click", () => {
        let x = (screen.width / 2) - 200;
        let y = (screen.height / 2) - 420;
        let settingsWindow = window.open("https://croomssched.tech/sched/settings/", "cbsh-settings",
            "status=0,toolbar=0,location=0,width=400,height=720,screenX=" + x + ",screenY=" + y + ",popup=true");
        let isClosedInterval = setInterval(() => {
            if (settingsWindow.closed) {
                clearInterval(isClosedInterval);
                window.location.reload();
            }
        }, 50);
    }, false);

    /*
    const CurrentPeriodProgressRingContainer = new PIXI.Container();


    const CurrentPeriodProgressRingBG = new PIXI.Graphics();
    if (Settings.theme === "dark") {
        CurrentPeriodProgressRingBG.lineStyle(6, ringBGColor, 1);
        CurrentPeriodProgressRingBG.drawCircle(0, 0, 10);
    } else {
        CurrentPeriodProgressRingBG.lineStyle(1, ringBGColor, 1);
        CurrentPeriodProgressRingBG.drawCircle(0, 0, 13);
        CurrentPeriodProgressRingBG.drawCircle(0, 0, 7);
        CurrentPeriodProgressRingBG.lineStyle(7, ringBGColor, 1);
        CurrentPeriodProgressRingBG.drawCircle(0, 0, 10);
    }

    CurrentPeriodProgressRingContainer.addChild(CurrentPeriodProgressRingBG);

    const CurrentPeriodProgressRing = new PIXI.Graphics();
    CurrentPeriodProgressRing.lineStyle(57, ringColor, 1);
    let percent = 0;
    CurrentPeriodProgressRing.arc(0, 0, 100, -((Math.PI / 100) * percent), (Math.PI / 100) * percent);
    //CurrentPeriodProgressRing.mask = CurrentPeriodProgressRingMask;
    CurrentPeriodProgressRing.scale.x = 0.10;
    CurrentPeriodProgressRing.scale.y = 0.10;
    CurrentPeriodProgressRing.rotation = ((Math.PI / 100) * percent);
    CurrentPeriodProgressRingContainer.addChild(CurrentPeriodProgressRing);


    CurrentPeriodSeconds.x = CurrentPeriod.width;
    CurrentPeriodProgressRingContainer.y = SchoolDayType.y + CurrentPeriodSeconds.height + (CurrentPeriodProgressRingBG.height / 2) - 2;
    app.stage.addChild(CurrentPeriodProgressRingContainer);

    CurrentPeriodProgressRingContainer.visible = Settings.showTimeRemainingRing;
    CurrentPeriodProgressRingContainer.rotation = -Math.PI / 2;
    CurrentPeriodProgressRingContainer.scale.x = 0.7;
    CurrentPeriodProgressRingContainer.scale.y = -0.7;
    */

    let currentDay = null;

    //main loop is called twice before being used in setInterval so that the text doesn't say "Loading..." or the current period text isn't wrong for 2 seconds.
    mainLoop();
    mainLoop();

    setTimeout(() => {
        setInterval(mainLoop, 1000);
    }, new Date().getMilliseconds());

    function mainLoop() {
        let periodMsg;
        drawDateTime();
        let now = new Date();

        currentDay = Schedules.schedule[current_lunch - 1];
        periodMsg = Schedules.msg;

        let currentEvent = currentDay[eventNumber - 1];
        let nextEvent = currentDay[eventNumber];

        for (let i = 0; i < currentDay.length; i++) {
            let event_sec = hms2sec(currentDay[i][3], currentDay[i][4], 0);
            let now_sec = hms2sec(now.getHours(), now.getMinutes(), now.getSeconds());
            //console.log(event_sec - now_sec < 0);
            if (event_sec - now_sec < 0) {
                // hopefully this works
                eventNumber = i + 2;
            } else {
                if (eventNumber >= currentDay.length) {
                    eventNumber = 0;
                }
                break;
            }
            if (eventNumber >= currentDay.length) {
                eventNumber = 0;
            }

        }

        drawPeriodMsg(periodMsg);
        drawEventCountDown(currentEvent);
        getNextPeriod(nextEvent);
    }

    function hms2sec(hours, minutes, seconds) {
        return (hours * 3600) + (minutes * 60) + seconds;
    }

    function sec2hms(sec) {
        let remaining = sec;
        let hms;
        let hours = Math.floor(sec / 3600);
        remaining -= hours * 3600;
        let minutes = Math.floor(remaining / 60);
        remaining -= minutes * 60;
        if (sec < 3600) {
          hms = "";
        } else {
            hms = hours.toString() + ":";
        }
        if (minutes >= 10) {
            hms += minutes.toString();
        } else if (sec >= 3600 && minutes <= 10) {
            hms += "0" + minutes.toString();
        } else {
            hms += minutes.toString();
        }
        return hms;

    }

    function difTime(currentEvent) {
        let now = new Date();
        let event_sec = hms2sec(currentEvent[3], currentEvent[4], 0);
        let now_sec = hms2sec(now.getHours(), now.getMinutes(), now.getSeconds());
        return sec2hms(event_sec - now_sec);
    }

    function diffTimeNum(currentEvent) {
        let now = new Date();
        let event_sec = hms2sec(currentEvent[3], currentEvent[4], 0);
        let now_sec = hms2sec(now.getHours(), now.getMinutes(), now.getSeconds());
        return (event_sec - now_sec);
    }

    function drawDateTime() {
        let now = new Date();
        let day = now.getDay();
        let weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let dayname = weekday[day];
        let month = now.getMonth() + 1
        let date = now.getDate()
        let year = now.getFullYear()
        let time12h = now.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true})
        DateAndTime.innerText = dayname + "  " + month + "/" + date + "/" + year + "  " + time12h;

        CBSHSched.time.time = time12h;
        CBSHSched.time.date = month + "/" + date + "/" + year;
    }

    function drawPeriodMsg(Periodmsg) {
        SchoolDayType.innerText = Periodmsg;
        CBSHSched.day = Periodmsg;
    }

    function drawEventCountDown(currentEvent) {
        CurrentPeriodSeconds.style.color = "grey";

        if (Settings.showSeconds === true) {CurrentPeriodSeconds.style.display = "inline";}
        else {CurrentPeriodSeconds.style.display = "none";}

        let now = new Date();
        let EventName = currentEvent[2];

        EventName = getEventName(EventName);

        let hours = currentEvent[3] - now.getHours();
        let minutes = currentEvent[4] - now.getMinutes() - 1;
        let seconds = 60 - now.getSeconds();
        if (seconds === 60) seconds = 0;
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        let remaining = (hours * 3600) + (minutes * 60) + seconds;
        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10 && hours > 0) {
            minutes = "0" + minutes;
        }
        let event_sec = hms2sec(currentEvent[3], currentEvent[4], 0);
        let start_event_sec = hms2sec(currentEvent[0], currentEvent[1], 0);
        let now_sec = hms2sec(now.getHours(), now.getMinutes(), now.getSeconds());
        let count_down = sec2hms(event_sec - now_sec);
        if (now_sec - event_sec === 300) {
            schedMessenger.postMessage("startClass")
        }
        if (event_sec - now_sec <= 600) {
            CurrentPeriod.style.color = "rgb(255,100,100)";
            CurrentPeriodSeconds.style.color = "rgb(255, 150, 150)";
        } else {
            CurrentPeriod.style.color = "unset";
        }
        if (event_sec - now_sec === 600) {
            schedMessenger.postMessage("lessThan10Minutes");
        }
        if (event_sec - now_sec === 60) {
            schedMessenger.postMessage("oneMinute");
        }
        if (event_sec - now_sec <= 60 && now_sec % 2 === 1) {
            CurrentPeriod.style.color = "unset";
            CurrentPeriodSeconds.style.color = "grey";
        }

        CurrentPeriod.innerText = EventName + ", Time Left: " + count_down.toString();

        CurrentPeriodSeconds.innerText = ":" + seconds;

        CBSHSched.period.current = EventName;
        CBSHSched.period.remainingTime = count_down.toString() + ":" + seconds;

        let percent = ((event_sec - now_sec) / (event_sec - start_event_sec)) * 100;

        /*
        CurrentPeriodProgressRing.clear();
        CurrentPeriodProgressRing.lineStyle(50, ringColor, 1);
        CurrentPeriodProgressRing.arc(0, 0, 100, -((Math.PI / 100) * percent), (Math.PI / 100) * percent);
        CurrentPeriodProgressRing.rotation = ((Math.PI / 100) * percent);
     */
    }

    function getEventName(EventName) {
        if (EventName === 1 || EventName === 2 || EventName === 3 || EventName === 4 || EventName === 5
            || EventName === 6 || EventName === 7) {
            EventName = Settings.periodNames[EventName];
        } else if (EventName === 0) {
            EventName = "Nothing";
        } else if (EventName === 100) {
            EventName = "Morning";
        } else if (EventName === 101) {
            EventName = "Welcome";
        } else if (EventName === 102) {
            EventName = "Lunch";
        } else if (EventName === 103) {
            EventName = "Homeroom";
        } else if (EventName === 104) {
            EventName = "Dismissal";
        } else if (EventName === 105) {
            EventName = "After School";
        } else if (EventName === 106) {
            EventName = "End";
        } else {
            EventName = "Unknown Event";
        }

        if (EventName === undefined) {
            EventName = "Unknown Event";
        }

        return EventName;
    }

    function getNextPeriod(Event) {
        try {
            CBSHSched.period.next = getEventName(Event[2]);
        } catch {
            CBSHSched.period.next = "None";
        }
    }
}