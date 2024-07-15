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
    document.querySelector(`[onclick="setFont('` + Settings.font.value + `')"]`).classList.remove("active");
    document.documentElement.style.setProperty("--font", font);
    Settings.font.value = font;
    localStorage.setItem("settings", JSON.stringify(Settings));
    document.querySelector(`[onclick="setFont('` + font + `')"]`).classList.add("active");
}