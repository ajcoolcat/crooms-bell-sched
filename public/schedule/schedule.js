const schedMessenger = new BroadcastChannel("sched-messenger");

function fixMissingSettings() {
    let Settings = {}
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/schedule/defaultSettings.json');
    xhr.responseType = 'json';
    xhr.send();
    xhr.onload = function () {
        try {
            Settings = xhr.response;
            let SavedSettings = JSON.parse(window.localStorage.getItem("settings"));
            if (SavedSettings) {
                for (const obj in Settings) {

                    if (SavedSettings[obj] === undefined) {
                        console.log(obj, " is missing!");
                        SavedSettings[obj] = Settings[obj];
                    }

                }
                SavedSettings.font.values = Settings.font.values;
            } else {
                SavedSettings = Settings;
            }
            window.localStorage.setItem("settings", JSON.stringify(SavedSettings));
            loadSettings();
        } catch (e) {
            console.error(e.message);
        }
    }
}

fixMissingSettings();
const appStyles = document.createElement("link");
appStyles.rel = "stylesheet";
appStyles.type = "text/css";
appStyles.href = "https://croomssched.tech/schedule/app.css";
document.head.appendChild(appStyles);

const inIframe = () => {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

let Settings = {
    "periodNames": {}
};

let Schedules = {};

function loadSettings() {
    let sxhr = new XMLHttpRequest();
    sxhr.open("GET", "/schedule/sched.json");
    sxhr.responseType = "json";
    sxhr.send();
    sxhr.onload = function() {
        Schedules = sxhr.response;
        console.log(sxhr.response);
    }

    if (window.localStorage.getItem("settings") === null) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "/schedule/defaultSettings.json");
        xhr.responseType = "json";
        xhr.send();
        xhr.onload = function () {
            Settings = xhr.response;
            window.localStorage.setItem("settings", JSON.stringify(Settings));
        }
    } else {
        Settings = JSON.parse(window.localStorage.getItem("settings"));
    }
}

function startSched(element) {
    let current_lunch = 1;

    let inAnIframe = inIframe();

    try {
        if (inAnIframe === true && window.top.location.hostname === "croomssched.tech") {
            document.body.style.margin = "0";
            schedMessenger.postMessage("initialized");
        }
    } catch {
        inIframe()
    }

    const application = document.createElement("div");
    application.id = "cbsh-application";
    element.appendChild(application);

    const DateAndTime = document.createElement("p");
    const SchoolDayType = document.createElement("p");
    const CurrentPeriodMain = document.createElement("p");
    const CurrentPeriod = document.createElement("span");
    const CurrentPeriodSeconds = document.createElement("span");

    DateAndTime.innerText = "Loading..."
    SchoolDayType.innerText = "Loading..."
    CurrentPeriod.innerText = "Loading..."
    CurrentPeriodSeconds.innerText = "Loading..."

    application.appendChild(DateAndTime);
    application.appendChild(SchoolDayType);
    application.appendChild(CurrentPeriodMain);
    CurrentPeriodMain.appendChild(CurrentPeriod);
    CurrentPeriodMain.appendChild(CurrentPeriodSeconds);

    CurrentPeriodSeconds.style.display = Settings.showSeconds;

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

    class Button {
        constructor(text, textColor, BGcolor, width, height, bgHighlightColor) {
            /*const buttonBG = new PIXI.Graphics();
            buttonBG.beginFill(BGcolor);
            buttonBG.drawRoundedRect(0, 0, width, height, 2);
            const buttonText = new PIXI.Text(text, {fontFamily: Settings.font.value, fontSize: 15, fill: textColor});
            buttonText.x = (width / 2) - (buttonText.width / 2);
            buttonText.y = (height / 2) - (buttonText.height / 2);
            buttonText.resolution = 3;
            buttonBG.addChild(buttonText);
            buttonBG.eventMode = "static";
            buttonBG.on("pointerover", () => {
                buttonBG.clear();
                buttonBG.beginFill(bgHighlightColor);
                buttonBG.drawRoundedRect(0, 0, width, height, 2);
            });
            buttonBG.on("pointerout", () => {
                buttonBG.clear();
                buttonBG.beginFill(BGcolor);
                buttonBG.drawRoundedRect(0, 0, width, height, 2);
            })
            buttonBG.cursor = 'pointer';
            return buttonBG;*/
        }
    }

    /*
    let PrimaryColor = "#e0991d";
    let PrimaryColorHighlight = "#f7ab28";
    let SecondaryColor = "#640024";
    let SecondaryColorHighlight = "#740034";
    let width = 65;
    let height = 20;*/

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

    /*
    const ALunchButton = new Button("A Lunch", "white", isALunch ? PrimaryColor : SecondaryColor, width, height, isALunch ? PrimaryColorHighlight : SecondaryColorHighlight);
    ALunchButton.x = window.innerWidth - 80;
    const BLunchButton = new Button("B Lunch", "white", isBLunch ? PrimaryColor : SecondaryColor, width, height, isBLunch ? PrimaryColorHighlight : SecondaryColorHighlight);
    BLunchButton.x = window.innerWidth - 80;
    BLunchButton.y = 20 + 2;
    app.stage.addChild(ALunchButton);
    app.stage.addChild(BLunchButton);*/
    let eventNumber = 1;

    /*
    ALunchButton.on("click", aButtonClick);
    ALunchButton.on("touchstart", aButtonClick);

    function aButtonClick() {
        current_lunch = 1;
        mainLoop();
        mainLoop();
        ALunchButton.clear();
        ALunchButton.beginFill(PrimaryColorHighlight);
        ALunchButton.drawRoundedRect(0, 0, width, height, 2);
        ALunchButton.on("pointerover", () => {
            ALunchButton.clear();
            ALunchButton.beginFill(PrimaryColorHighlight);
            ALunchButton.drawRoundedRect(0, 0, width, height, 2);
        });
        ALunchButton.on("pointerout", () => {
            ALunchButton.clear();
            ALunchButton.beginFill(PrimaryColor);
            ALunchButton.drawRoundedRect(0, 0, width, height, 2);
        })
        BLunchButton.clear();
        BLunchButton.beginFill(SecondaryColor);
        BLunchButton.drawRoundedRect(0, 0, width, height, 2);
        BLunchButton.on("pointerover", () => {
            BLunchButton.clear();
            BLunchButton.beginFill(SecondaryColorHighlight);
            BLunchButton.drawRoundedRect(0, 0, width, height, 2);
        });
        BLunchButton.on("pointerout", () => {
            BLunchButton.clear();
            BLunchButton.beginFill(SecondaryColor);
            BLunchButton.drawRoundedRect(0, 0, width, height, 2);
        })
    }

    BLunchButton.on("click", bButtonClick);
    BLunchButton.on("touchstart", bButtonClick);

    function bButtonClick() {
        current_lunch = 2;
        mainLoop();
        mainLoop();
        BLunchButton.clear();
        BLunchButton.beginFill(PrimaryColorHighlight);
        BLunchButton.drawRoundedRect(0, 0, width, height, 2);
        BLunchButton.on("pointerover", () => {
            BLunchButton.clear();
            BLunchButton.beginFill(PrimaryColorHighlight);
            BLunchButton.drawRoundedRect(0, 0, width, height, 2);
        });
        BLunchButton.on("pointerout", () => {
            BLunchButton.clear();
            BLunchButton.beginFill(PrimaryColor);
            BLunchButton.drawRoundedRect(0, 0, width, height, 2);
        })
        ALunchButton.clear();
        ALunchButton.beginFill(SecondaryColor);
        ALunchButton.drawRoundedRect(0, 0, width, height, 2);
        ALunchButton.on("pointerover", () => {
            ALunchButton.clear();
            ALunchButton.beginFill(SecondaryColorHighlight);
            ALunchButton.drawRoundedRect(0, 0, width, height, 2);
        });
        ALunchButton.on("pointerout", () => {
            ALunchButton.clear();
            ALunchButton.beginFill(SecondaryColor);
            ALunchButton.drawRoundedRect(0, 0, width, height, 2);
        })
    }*/

    //main loop is called twice before being used in setInterval so that the text doesn't say "Loading..." or the current period text isn't wrong for 2 seconds.
    mainLoop();
    mainLoop();

    setTimeout(() => {
        setInterval(mainLoop, 1000);
    }, new Date().getMilliseconds());

    /*
    const SettingsButton = new Button("Settings", "white", SecondaryColor, 65, 20, SecondaryColorHighlight);
    SettingsButton.x = window.innerWidth - 80;
    SettingsButton.y = 42 + 2;
    app.stage.addChild(SettingsButton);
    SettingsButton.on("click", settingsClick);
    SettingsButton.on("touchstart", settingsClick);

    function settingsClick() {
        let x = (screen.width / 2) - 200;
        let y = (screen.height / 2) - 420;
        let settingsWindow = window.open("./settings/", "settings", "status=0,toolbar=0,location=0,width=400,height=720,screenX=" + x + ",screenY=" + y + ",popup=true");
        let isClosedInterval = setInterval(() => {
            if (settingsWindow.closed) {
                clearInterval(isClosedInterval);
                window.location.href = "./";
            }
        }, 50);
    }

    window.addEventListener("resize", () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        SettingsButton.x = window.innerWidth - 80;
        BLunchButton.x = window.innerWidth - 80;
        ALunchButton.x = window.innerWidth - 80;
    });

     */

    function mainLoop() {
        let Periodmsg = "";
        drawDateTime();
        let now = new Date();
        let day = now.getDay();
        let month = now.getMonth();
        let date = now.getDate();


        let currentEvent = currentDay[eventNumber - 1];

        for (let i = 0; i < currentDay.length; i++) {
            let event_sec = hms2sec(currentDay[i].endHour, currentDay[i].endMin, 0);
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

        drawPeriodMsg(Periodmsg);
        drawEventCountDown(currentEvent);
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
        if (sec >= 36000) {
            hms = hours.toString() + ":";
        } else {
            hms = "0" + hours.toString() + ":";
        }
        if (minutes >= 10) {
            hms += minutes.toString();
        } else {
            hms += "0" + minutes.toString();
        }
        return hms;

    }

    function difTime(currentEvent) {
        let now = new Date();
        let event_sec = hms2sec(currentEvent.endHour, currentEvent.endMin, 0);
        let now_sec = hms2sec(now.getHours(), now.getMinutes(), now.getSeconds());
        return sec2hms(event_sec - now_sec);
    }

    function diffTimeNum(currentEvent) {
        let now = new Date();
        let event_sec = hms2sec(currentEvent.endHour, currentEvent.endMin, 0);
        let now_sec = hms2sec(now.getHours(), now.getMinutes(), now.getSeconds());
        return (event_sec - now_sec);
    }

    function drawDateTime() {
        let now = new Date();
        let day = now.getDay();
        let weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";
        let dayname = weekday[day];
        let month = now.getMonth() + 1
        let date = now.getDate()
        let year = now.getFullYear()
        let time12h = now.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true})
        DateAndTime.innerText = dayname + "  " + month + "/" + date + "/" + year + "  " + time12h;
    }

    function drawPeriodMsg(Periodmsg) {
        SchoolDayType.innerText = Periodmsg
    }

    function drawEventCountDown(currentEvent) {
        CurrentPeriod.style.fill = textColor;
        CurrentPeriodSeconds.style.fill = "grey";
        CurrentPeriodSeconds.visible = Settings.showSeconds;
        let now = new Date();
        let EventName = currentEvent.name;
        let hours = currentEvent.endHour - now.getHours();
        let minutes = currentEvent.endMin - now.getMinutes() - 1;
        let seconds = 60 - now.getSeconds();
        if (seconds === 60) seconds = 0;
        if (seconds < 10) seconds = "0" + seconds;
        let remaining = (hours * 3600) + (minutes * 60) + seconds;
        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        let event_sec = hms2sec(currentEvent.endHour, currentEvent.endMin, 0);
        let start_event_sec = hms2sec(currentEvent.startHour, currentEvent.startMin, 0);
        let now_sec = hms2sec(now.getHours(), now.getMinutes(), now.getSeconds());
        let count_down = sec2hms(event_sec - now_sec);
        if (now_sec - event_sec === 300) {
            schedMessenger.postMessage("startClass")
        }
        if (event_sec - now_sec <= 600) {
            CurrentPeriod.style.text = "rgb(255,100,100)";
            CurrentPeriodSeconds.style.fill = "rgb(255, 150, 150)";
        }
        if (event_sec - now_sec === 600) {
            schedMessenger.postMessage("lessThan10Minutes");
        }
        if (event_sec - now_sec === 60) {
            schedMessenger.postMessage("oneMinute");
        }
        if (event_sec - now_sec <= 60 && now_sec % 2 === 1) {
            CurrentPeriod.style.fill = textColor;
            CurrentPeriodSeconds.style.fill = "grey";
        }

        CurrentPeriod.text = EventName + ", Time Left: " + count_down.toString();

        CurrentPeriodSeconds.x = CurrentPeriod.width;
        CurrentPeriodSeconds.text = ":" + seconds;
        if (Settings.showSeconds) {
            CurrentPeriodProgressRingContainer.x = CurrentPeriodSeconds.x + CurrentPeriodSeconds.width + (CurrentPeriodProgressRingBG.width / 2);
        } else {
            CurrentPeriodProgressRingContainer.x = CurrentPeriodSeconds.x + (CurrentPeriodProgressRingBG.width / 2);
        }

        percent = ((event_sec - now_sec) / (event_sec - start_event_sec)) * 100;

        CurrentPeriodProgressRing.clear();
        CurrentPeriodProgressRing.lineStyle(50, ringColor, 1);
        CurrentPeriodProgressRing.arc(0, 0, 100, -((Math.PI / 100) * percent), (Math.PI / 100) * percent);
        CurrentPeriodProgressRing.rotation = ((Math.PI / 100) * percent);
    }
}