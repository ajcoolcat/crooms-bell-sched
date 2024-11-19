let saveSettings = () => {}
let Settings, DefaultSettings = {};
let periodNameElements = [];
const isWeb = determineIfInWeb();

function fixMissingSettings() {
    fetch("/sched/defaultSettings.json").then(async (res) => {
        return JSON.parse(await res.text());
    }).then((res) => {
        DefaultSettings = res;
        Settings = JSON.parse(localStorage.getItem("settings"));

        for (let setting in Settings) {
            if (Settings[setting] === undefined || Settings[setting] === null) {
                try {
                    Settings[setting] = DefaultSettings[setting];
                    console.warn(setting + " was not found, so we reset it to the default.");
                } catch (e) {
                    console.error(setting + " could not be found, and was not reset because of an error.\n\nDetails: " +
                        e.message);
                }
            }
        }

        for (let setting in DefaultSettings.font.values) {
            if (Settings.font.values[setting] === undefined || Settings.font.values[setting] === null) {
                try {
                    Settings.font.values[setting] = DefaultSettings.font.values[setting];
                    console.warn(setting.name + " was not found, so we added the font.");
                } catch (e) {
                    console.error(setting.name + " could not be found, and was not reset because of an error.\n\nDetails: " +
                        e.message);
                }
            }
        }
        if (!isWeb) document.querySelectorAll(".webOnly").forEach((element) => element.classList.add("hidden"));
        localStorage.setItem("settings", JSON.stringify(Settings));
        start();
    });
}

function start() {
    for (let i = 1; i < 8; i++) {
        periodNameElements.push(document.getElementById("period" + i + "Name"));
    }

    saveSettings = () => {
        Settings.clippy = document.getElementById("allowClippy").checked;
        Settings.theme = document.getElementById("themeSelector").value;
        Settings.showSeconds = document.getElementById("showSeconds").checked;
        Settings.showTimeRemainingRing = document.getElementById("showRing").checked;
        Settings.defaultLunch = document.getElementById("DefaultLunchDropdown").value;
        Settings.periodNames[1] = periodNameElements[0].value;
        Settings.periodNames[2] = periodNameElements[1].value;
        Settings.periodNames[3] = periodNameElements[2].value;
        Settings.periodNames[4] = periodNameElements[3].value;
        Settings.periodNames[5] = periodNameElements[4].value;
        Settings.periodNames[6] = periodNameElements[5].value;
        Settings.periodNames[7] = periodNameElements[6].value;
        localStorage.setItem("settings", JSON.stringify(Settings));
    }

    document.getElementById("themeSelector").addEventListener("change", saveSettings);
    document.getElementById("showSeconds").addEventListener("change", saveSettings);
    document.getElementById("showRing").addEventListener("change", saveSettings);
    document.getElementById("DefaultLunchDropdown").addEventListener("change", saveSettings);
    document.getElementById("fontSelector").addEventListener("change", saveSettings);
    document.getElementById("allowClippy").addEventListener("change", saveSettings);
    for (let i = 0; i < periodNameElements.length; i++) {
        periodNameElements[i].addEventListener("change", saveSettings);
    }


    let fontName = Settings.font.values.find((font) => {if (font.id === Settings.font.value) {return font}});
    document.querySelector(`div[data-isFontSetting="true"][title="${fontName.name}"]`).className = "active";

    document.querySelectorAll(`div[data-isFontSetting="true"]`).forEach((elem) => {
       elem.addEventListener("click", () => {
          let fontName = elem.getAttribute("title");
          let fontID = Settings.font.values.find((font) => {if (font.name === fontName) {return font}}).id;
          setFont(fontID);
       });
    });

    document.getElementById("themeSelector").value = Settings.theme;
    document.getElementById("showSeconds").checked = Settings.showSeconds === true;
    document.getElementById("showRing").checked = Settings.showTimeRemainingRing === true;
    document.getElementById("allowClippy").checked = Settings.clippy === true;

    periodNameElements[0].value = Settings.periodNames[1];
    periodNameElements[1].value = Settings.periodNames[2];
    periodNameElements[2].value = Settings.periodNames[3];
    periodNameElements[3].value = Settings.periodNames[4];
    periodNameElements[4].value = Settings.periodNames[5];
    periodNameElements[5].value = Settings.periodNames[6];
    periodNameElements[6].value = Settings.periodNames[7];

    document.getElementById("DefaultLunchDropdown").value = Settings.defaultLunch;

    Settings.font.values.forEach((font) => {
        const option = document.createElement("option");
        option.text = font.name;
        option.value = font.value;
        document.getElementById("fontSelector").appendChild(option);
    })
}

document.addEventListener("DOMContentLoaded", fixMissingSettings);

function onDone() {
    saveSettings();
    try {
        window.close();
    } catch (e) {
        console.warn(e);
    }
}

function resetSettings(answer) {
    if (answer === true) {
        localStorage.setItem("settings", JSON.stringify(DefaultSettings)); location.reload();
    } else if (answer === false) {
        document.querySelector(".modal").remove();
        document.querySelector(".dialog").remove();
    } else {
        playAudio("Confirmation");
        alertClient("Reset Settings?",
            "Resetting your settings will require you to set it all up again. Are you sure you want to do this?" +
            '<br><footer style="text-align: center; margin-top: 1rem;"><button onclick="resetSettings(true)">Yes</button>' +
            '&nbsp;<button onclick="resetSettings(false)">No</button></footer>',
            3);
    }
}

function determineIfInWeb() {
    try {return typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.includes('Electron') === false;}
    catch {return true;}
}