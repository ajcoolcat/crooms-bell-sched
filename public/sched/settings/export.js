function exportSettings() {
    let settings = localStorage.getItem("settings");
    settings = JSON.stringify(settings);
    console.log(settings);

    function download(text, name, type) {
        let file = new Blob([text], {type: type});
        let a = document.createElement("a");
        a.download = name;
        a.href = URL.createObjectURL(file);
        a.click();
    }

    download(settings, "CBSHSettings.json", "text/json");
}