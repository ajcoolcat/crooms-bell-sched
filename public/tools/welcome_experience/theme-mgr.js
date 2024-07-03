fetch("/sched/defaultSettings.json").then((res) => {
    return res.text();
}).then((res) => {
    return JSON.parse(res);
}).then((NewSettings) => {
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
    let fontDropdown = document.getElementById("fontSelector");
    for (let i = 0; i < Settings.font.values.length; i++) {
        let fontOption = document.createElement("option");
        fontOption.innerText = Settings.font.values[i].name;
        fontOption.value = Settings.font.values[i].id;
        fontDropdown.appendChild(fontOption);
    }
}).catch((e) => {
    console.error(e);
});

document.getElementById("themeSelector").addEventListener("change", () => {
    document.documentElement.className = document.getElementById("themeSelector").value;
    Settings.theme = document.getElementById("themeSelector").value;
    localStorage.setItem("settings", JSON.stringify(Settings));
});

document.getElementById("fontSelector").addEventListener("change", () => {
    document.documentElement.style.setProperty("--font", document.getElementById("fontSelector").value);
    Settings.font.value = document.getElementById("fontSelector").value;
    localStorage.setItem("settings", JSON.stringify(Settings));
});

function setAccent(scheme) {
    document.documentElement.style.setProperty("--accent-color", "var(--" + scheme + ")");
    Settings.accentColor = scheme;
    localStorage.setItem("settings", JSON.stringify(Settings));
}