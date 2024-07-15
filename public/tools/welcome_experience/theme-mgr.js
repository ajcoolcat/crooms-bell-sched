fetch("/sched/defaultSettings.json").then((res) => {
    return res.text();
}).then((res) => {
    return JSON.parse(res);
}).then((NewSettings) => {
    let Settings = JSON.parse(localStorage.getItem("settings"));
    if (Settings) {
        for (const obj in NewSettings) {
            if (Settings[obj] === undefined) {
                if (obj === "theme" && window.matchMedia("screen and (prefers-color-scheme: dark)")) {
                    Settings[obj] = "dark";
                } else {
                    Settings[obj] = NewSettings[obj];
                }
            }
        }
        Settings.font.values = NewSettings.font.values;
    } else {
        Settings = NewSettings;
    }
    localStorage.setItem("settings", JSON.stringify(Settings));

    document.getElementById("themeSelector").value = Settings.theme;
    document.querySelector(`[onclick="setFont('` + JSON.parse(localStorage.settings).font.value +
        `')"]`).classList.add("active");
    document.documentElement.style.setProperty("--font", JSON.parse(localStorage.settings).font.value);
}).catch((e) => {
    console.error(e);
});