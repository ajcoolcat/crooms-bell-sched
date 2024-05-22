PIXI.Assets.addBundle('fonts', {
    'SegUI': '/SegUIVar.woff2',
    'Torus': '/fonts/Torus.woff2',
    'CACula':'/fonts/CACula.woff2'
});

PIXI.Assets.loadBundle('fonts').then(() => {

    const schedMessenger = new BroadcastChannel("sched-messenger");

    function fixMissingSettings() {
        let Settings = {}
        let xhr = new XMLHttpRequest();
        xhr.open('GET', '/defaultSettings.json');
        xhr.responseType = 'json';
        xhr.send();
        xhr.onload = function () {
            Settings = xhr.response;
            let SavedSettings = JSON.parse(window.localStorage.getItem("settings"));
            if (SavedSettings){
                for (const obj in Settings) {

                    if (SavedSettings[obj] === undefined){
                        console.log(obj, " is missing!");
                        SavedSettings[obj] = Settings[obj];
                    }

                }
                SavedSettings.font.values = Settings.font.values;
            }
            else {
                SavedSettings = Settings;
            }
            window.localStorage.setItem("settings", JSON.stringify(SavedSettings));
            console.log("Fixed possible missing settings!");
            loadSettings();
        }
    }

    fixMissingSettings();

    const checkDarkTheme = () => {return window.matchMedia("(prefers-color-scheme: dark)").matches;}
    const inIframe = () => {try {return window.self !== window.top;} catch (e) {return true;}}

    let Settings = {
        "periodNames": {}
    };
    function loadSettings() {
        if (window.localStorage.getItem("settings") === null) {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', '/defaultSettings.json');
            xhr.responseType = 'json';
            xhr.send();
            xhr.onload = function () {
                Settings = xhr.response;

                const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
                if (darkThemeMq.matches) {
                    Settings.theme = "dark";
                } else {
                    Settings.theme = "light";
                }

                window.localStorage.setItem("settings", JSON.stringify(Settings));
                startSched();
            }
        }
        else {
            Settings = JSON.parse(window.localStorage.getItem("settings"));
            startSched();
        }
    }

    function startSched() {
        let theme = Settings.theme;

        class DayEvent {
            constructor(startHour, startMin, name, endHour, endMin) {
                this.startHour = startHour;
                this.startMin = startMin;
                this.name = name;
                this.endHour = endHour;
                this.endMin = endMin;
            }
        }

        let current_lunch = 1;

        let Monday1 = new Array(12);
        Monday1[0] = new DayEvent(1, 0, "Morning", 7, 20);
        Monday1[1] = new DayEvent(7, 20, Settings.periodNames.period1, 9, 25);
        Monday1[2] = new DayEvent(9, 30, Settings.periodNames.period2, 10, 9);
        Monday1[3] = new DayEvent(10, 14, Settings.periodNames.period3, 10, 53);
        Monday1[4] = new DayEvent(10, 53, "Lunch", 11, 23);
        Monday1[5] = new DayEvent(11, 28, Settings.periodNames.period4, 12, 7);
        Monday1[6] = new DayEvent(12, 12, Settings.periodNames.period5, 12, 51);
        Monday1[7] = new DayEvent(12, 56, Settings.periodNames.period6, 13, 35);
        Monday1[8] = new DayEvent(13, 40, Settings.periodNames.period7, 14, 20);
        Monday1[9] = new DayEvent(14, 20, "Dismissal", 14, 25);
        Monday1[10] = new DayEvent(14, 25, "After School", 23, 59);
        Monday1[11] = new DayEvent(23, 59, "End", 23, 59);

        let Monday2 = new Array(12);
        Monday2[0] = new DayEvent(1, 0, "Morning", 7, 20);
        Monday2[1] = new DayEvent(7, 20, Settings.periodNames.period1, 9, 25);
        Monday2[2] = new DayEvent(9, 30, Settings.periodNames.period2, 10, 9);
        Monday2[3] = new DayEvent(10, 14, Settings.periodNames.period3, 10, 53);
        Monday2[4] = new DayEvent(10, 58, Settings.periodNames.period4, 11, 37);
        Monday2[5] = new DayEvent(11, 37, "Lunch", 12, 7);
        Monday2[6] = new DayEvent(12, 12, Settings.periodNames.period5, 12, 51);
        Monday2[7] = new DayEvent(12, 56, Settings.periodNames.period6, 13, 35);
        Monday2[8] = new DayEvent(13, 40, Settings.periodNames.period7, 14, 20);
        Monday2[9] = new DayEvent(14, 20, "Dismissal", 14, 25);
        Monday2[10] = new DayEvent(14, 25, "After School", 23, 59);
        Monday2[11] = new DayEvent(23, 59, "End", 23, 59);

        let Wednesday = new Array(9);
        Wednesday[0] = new DayEvent(1, 0, "Morning", 7, 20);
        Wednesday[1] = new DayEvent(7, 20, Settings.periodNames.period2, 9, 25);
        Wednesday[2] = new DayEvent(9, 25, "Break", 9, 40);
        Wednesday[3] = new DayEvent(9, 45, Settings.periodNames.period3, 11, 45);
        Wednesday[4] = new DayEvent(11, 45, "Dismissal", 11, 50);
        Wednesday[5] = new DayEvent(11, 50, "After School", 23, 59);
        Wednesday[6] = new DayEvent(23, 59, "End", 23, 59);

        let Thursday = new Array(9);
        Thursday[0] = new DayEvent(1, 0, "Morning", 7, 20);
        Thursday[1] = new DayEvent(7, 20, Settings.periodNames.period4, 9, 25);
        Thursday[2] = new DayEvent(9, 25, "Break", 9, 40);
        Thursday[3] = new DayEvent(9, 45, Settings.periodNames.period5, 11, 45);
        Thursday[4] = new DayEvent(11, 45, "Dismissal", 11, 50);
        Thursday[5] = new DayEvent(11, 50, "After School", 23, 59);
        Thursday[6] = new DayEvent(23, 59, "End", 23, 59);

        let Friday = new Array(9);
        Friday[0] = new DayEvent(1, 0, "Morning", 7, 20);
        Friday[1] = new DayEvent(7, 20, Settings.periodNames.period6, 9, 25);
        Friday[2] = new DayEvent(9, 25, "Break", 9, 40);
        Friday[3] = new DayEvent(9, 45, Settings.periodNames.period7, 11, 45);
        Friday[4] = new DayEvent(11, 45, "Dismissal", 11, 50);
        Friday[5] = new DayEvent(11, 50, "After School", 23, 59);
        Friday[6] = new DayEvent(23, 59, "End", 23, 59);



        let inAnIframe = inIframe();
        let AppBgColor = "white";
        if (theme === "dark") {
            AppBgColor = "rgb(40,40,40)";
        }

        let textColor = "black";
        if (theme === "dark") {
            textColor = "white";
        }

        try {
            if (inAnIframe === true && window.top.location.hostname === "croomssched.tech") {
                document.body.style.margin = "0";
                AppBgColor = "#dddddd";
                if (checkDarkTheme() === true) {
                    AppBgColor = "#222222";
                    textColor = "white"
                }

                schedMessenger.postMessage("initialized");
            }
        } catch {inIframe()}

        document.body.style.backgroundColor = AppBgColor;

        const app = new PIXI.Application({background: AppBgColor, width: window.innerWidth, height: window.innerHeight, antialias:true, autoDensity:true, resolution: window.devicePixelRatio});
        document.body.appendChild(app.view);

        const DateAndTime = new PIXI.Text("Loading...", {fontFamily: Settings.font.value, fontSize: 17.5, fill: textColor});


        const SchoolDayType = new PIXI.Text("Loading...", {fontFamily: Settings.font.value, fontSize: 17.5, fill: textColor});
        SchoolDayType.y = DateAndTime.height + 2;


        const CurrentPeriod = new PIXI.Text("Loading...", {fontFamily: Settings.font.value, fontSize: 17.5, fill: textColor});
        CurrentPeriod.y = SchoolDayType.y + SchoolDayType.height + 2;


        const CurrentPeriodSeconds = new PIXI.Text("Loading...", {fontFamily: Settings.font.value, fontSize: 17.5, fill: "grey"});
        CurrentPeriodSeconds.y = SchoolDayType.y + CurrentPeriodSeconds.height + 2;
        CurrentPeriodSeconds.visible = Settings.showSeconds;


        app.stage.addChild(DateAndTime);
        app.stage.addChild(SchoolDayType);
        app.stage.addChild(CurrentPeriod);
        app.stage.addChild(CurrentPeriodSeconds);



        let ringBGColor = "grey";
        let ringColor = "white";


        const CurrentPeriodProgressRingContainer = new PIXI.Container();



        const CurrentPeriodProgressRingBG = new PIXI.Graphics();
        if (Settings.theme === "dark"){
            CurrentPeriodProgressRingBG.lineStyle(6, ringBGColor, 1);
            CurrentPeriodProgressRingBG.drawCircle(0,0,10);
        }
        else {
            CurrentPeriodProgressRingBG.lineStyle(1, ringBGColor, 1);
            CurrentPeriodProgressRingBG.drawCircle(0,0,13);
            CurrentPeriodProgressRingBG.drawCircle(0,0,7);
            CurrentPeriodProgressRingBG.lineStyle(7, ringBGColor, 1);
            CurrentPeriodProgressRingBG.drawCircle(0,0,10);
        }

        CurrentPeriodProgressRingContainer.addChild(CurrentPeriodProgressRingBG);

        const CurrentPeriodProgressRing = new PIXI.Graphics();
        CurrentPeriodProgressRing.lineStyle(57,ringColor, 1);
        let percent = 0;
        CurrentPeriodProgressRing.arc(0,0,100, -((Math.PI/100)*percent), (Math.PI/100)*percent);
        //CurrentPeriodProgressRing.mask = CurrentPeriodProgressRingMask;
        CurrentPeriodProgressRing.scale.x = 0.10;
        CurrentPeriodProgressRing.scale.y = 0.10;
        CurrentPeriodProgressRing.rotation =  ((Math.PI/100)*percent);
        CurrentPeriodProgressRingContainer.addChild(CurrentPeriodProgressRing);


        CurrentPeriodSeconds.x = CurrentPeriod.width;
        CurrentPeriodProgressRingContainer.y = SchoolDayType.y + CurrentPeriodSeconds.height + (CurrentPeriodProgressRingBG.height/2) - 2;
        app.stage.addChild(CurrentPeriodProgressRingContainer);

        CurrentPeriodProgressRingContainer.visible = Settings.showTimeRemainingRing;
        CurrentPeriodProgressRingContainer.rotation = -Math.PI/2;
        CurrentPeriodProgressRingContainer.scale.x = 0.7;
        CurrentPeriodProgressRingContainer.scale.y = -0.7;





        class Button {
            constructor(text, textColor, BGcolor, width, height, bgHighlightColor) {
                const buttonBG = new PIXI.Graphics();
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
                return buttonBG;
            }
        }

        let PrimaryColor = "#e0991d";
        let PrimaryColorHighlight = "#f7ab28";
        let SecondaryColor = "#640024";
        let SecondaryColorHighlight = "#740034";
        let width = 65;
        let height = 20;

        let isALunch;
        let isBLunch;

        if(Settings.defaultLunch === "B Lunch"){
            isALunch = false;
            isBLunch = true;
            current_lunch = 2;
        }
        else {
            isALunch = true;
            isBLunch = false;
            current_lunch = 1;
        }

        const ALunchButton = new Button("A Lunch", "white", isALunch ? PrimaryColor : SecondaryColor, width, height, isALunch ? PrimaryColorHighlight : SecondaryColorHighlight);
        ALunchButton.x = window.innerWidth - 80;
        const BLunchButton = new Button("B Lunch", "white", isBLunch ? PrimaryColor : SecondaryColor, width, height, isBLunch ? PrimaryColorHighlight : SecondaryColorHighlight);
        BLunchButton.x = window.innerWidth - 80;
        BLunchButton.y = 20 + 2;
        app.stage.addChild(ALunchButton);
        app.stage.addChild(BLunchButton);
        let eventNumber = 1;

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
        }
        //main loop is called twice before being used in setInterval so that the text doesn't say "Loading..." or the current period text isn't wrong for 2 seconds.
        mainLoop();
        mainLoop();

        setTimeout(()=>{
            setInterval(mainLoop, 1000);
        },new Date().getMilliseconds());


        const SettingsButton = new Button("Settings", "white", SecondaryColor, 65, 20, SecondaryColorHighlight);
        SettingsButton.x = window.innerWidth - 80;
        SettingsButton.y = 42 + 2;
        app.stage.addChild(SettingsButton);
        SettingsButton.on("click", settingsClick);
        SettingsButton.on("touchstart", settingsClick);
        function settingsClick() {
            let x = (screen.width/2) - 200;
            let y = (screen.height/2) - 420;
            let settingsWindow = window.open("./settings/", "settings", "status=0,toolbar=0,location=0,width=400,height=720,screenX="+x+",screenY="+y+",popup=true");
            let isClosedInterval = setInterval(()=>{
                if (settingsWindow.closed){
                    clearInterval(isClosedInterval);
                    window.location.href = "./";
                }
            },50);
        }

        window.addEventListener("resize", () => {
            app.renderer.resize(window.innerWidth, window.innerHeight);
            SettingsButton.x = window.innerWidth - 80;
            BLunchButton.x = window.innerWidth - 80;
            ALunchButton.x = window.innerWidth - 80;
        });

        function mainLoop() {
            let Periodmsg = "";
            drawDateTime();
            let currentDay = Monday1;
            let now = new Date();
            let day = now.getDay();
            let month = now.getMonth();
            let date = now.getDate();
            if (current_lunch === 1) {
                if (day === 1) {currentDay = Monday1; Periodmsg = "Today is a Normal Day.";}
                else if (day === 2) {currentDay = Monday1; Periodmsg = "Today is a Normal Exam Day.";}
                else if (day === 3) {currentDay = Wednesday; Periodmsg = "Today is a 2 & 3 Short Day.";}
                else if (day === 4) {currentDay = Thursday; Periodmsg = "Today is a 4 & 5 Short Day.";}
                else if (day === 5) {currentDay = Friday; Periodmsg = "Today is a 6 & 7 Short Day.";}
            } else if (current_lunch === 2) {
                if (day === 1) {currentDay = Monday2; Periodmsg = "Today is a Normal Day.";}
                else if (day === 2) {currentDay = Monday2; Periodmsg = "Today is a Normal Exam Day.";}
                else if (day === 3) {currentDay = Wednesday; Periodmsg = "Today is a 2 & 3 Short Day.";}
                else if (day === 4) {currentDay = Thursday; Periodmsg = "Today is a 4 & 5 Short Day.";}
                else if (day === 5) {currentDay = Friday; Periodmsg = "Today is a 6 & 7 Short Day.";}
            } else {current_lunch = 1}

            let currentEvent = currentDay[eventNumber - 1];

            for (let i = 0; i < currentDay.length; i++) {
                let event_sec = hms2sec(currentDay[i].endHour, currentDay[i].endMin, 0);
                let now_sec = hms2sec(now.getHours(), now.getMinutes(), now.getSeconds());
                //console.log(event_sec - now_sec < 0);
                if (event_sec - now_sec < 0) {
                    // hopefully this works
                    eventNumber = i + 2;
                }
                else {
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
            }
            else {
                hms = "0" + hours.toString() + ":";
            }
            if (minutes >= 10) {
                hms += minutes.toString();
            }
            else {
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
            DateAndTime.text = dayname + "  " + month + "/" + date + "/" + year + "  " + time12h;
        }
        function drawPeriodMsg(Periodmsg) {
            SchoolDayType.text = Periodmsg
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
            if (now_sec - event_sec === 300) {schedMessenger.postMessage("startClass")}
            if (event_sec - now_sec <= 600) {CurrentPeriod.style.fill = "rgb(255,100,100)";CurrentPeriodSeconds.style.fill = "rgb(255, 150, 150)";}
            if (event_sec - now_sec === 600) {schedMessenger.postMessage("lessThan10Minutes");}
            if (event_sec - now_sec === 60) {schedMessenger.postMessage("oneMinute");}
            if (event_sec - now_sec <= 60 && now_sec % 2 === 1) {CurrentPeriod.style.fill = textColor; CurrentPeriodSeconds.style.fill = "grey";}

            CurrentPeriod.text = EventName + ", Time Left: " + count_down.toString();

            CurrentPeriodSeconds.x = CurrentPeriod.width;
            CurrentPeriodSeconds.text = ":" + seconds;
            if (Settings.showSeconds) {
                CurrentPeriodProgressRingContainer.x = CurrentPeriodSeconds.x + CurrentPeriodSeconds.width + (CurrentPeriodProgressRingBG.width/2);
            }
            else {
                CurrentPeriodProgressRingContainer.x = CurrentPeriodSeconds.x + (CurrentPeriodProgressRingBG.width/2);
            }

            percent = ((event_sec-now_sec)/(event_sec-start_event_sec))*100;

            CurrentPeriodProgressRing.clear();
            CurrentPeriodProgressRing.lineStyle(50,ringColor, 1);
            CurrentPeriodProgressRing.arc(0,0,100, -((Math.PI/100)*percent), (Math.PI/100)*percent);
            CurrentPeriodProgressRing.rotation = ((Math.PI/100)*percent);
        }
    }
});