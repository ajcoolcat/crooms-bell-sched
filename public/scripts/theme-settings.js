document.getElementById("themeSelector").addEventListener("change", () => {
    document.documentElement.className = document.getElementById("themeSelector").value;
    Settings.theme = document.getElementById("themeSelector").value;
    localStorage.setItem("settings", JSON.stringify(Settings));
});

function setAccent(scheme) {
    document.documentElement.style.setProperty("--accent-color", "var(--" + scheme + ")");
    Settings.accentColor = scheme;
    localStorage.setItem("settings", JSON.stringify(Settings));
}

function setFont(font) {
    let fontName = Settings.font.values.find((font) => {if (font.id === Settings.font.value) {return font}});
    document.querySelector(`div[data-isFontSetting="true"][title="${fontName.name}"]`).classList.remove("active");
    document.documentElement.style.setProperty("--font", font);
    Settings.font.value = font;
    localStorage.setItem("settings", JSON.stringify(Settings));
    let newFontName = Settings.font.values.find((font) => {if (font.id === Settings.font.value) {return font}});
    document.querySelector(`div[data-isFontSetting="true"][title="${newFontName.name}"]`).classList.add("active");
}