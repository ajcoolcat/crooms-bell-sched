function importSettings() {
    alertClient("Import Settings","<p style='text-align: center;'><input type=\"file\" id=\"imported-settings\" /></p>"+
        "\n<p style='text-align: center;'>Your file will be checked and validated before being applied.</p>", 5);

    function readSingleFile(e) {
        let file = e.target.files[0];
        if (!file) {
            return;
        }
        let reader = new FileReader();
        reader.onload = function(e) {
            try {
                let contents = e.target.result;
                prepareSettings(JSON.parse(contents));
            } catch (e) {
                alertClient("Error Importing Settings", "The settings file is invalid or corrupt." +
                    " Please try a different file.", 2);
            }
        };
        reader.readAsText(file);
    }

    document.getElementById("imported-settings").addEventListener("change", readSingleFile, false);
    
    function prepareSettings(Settings) {
        try {
            document.querySelector(".dialog > main > p:last-child")
                .innerText = "Success! Your settings have been imported.";
            document.querySelector(".dialog > footer > button")
                .innerText = "Keep Old Settings";

            const acceptButton = document.createElement("button");
            acceptButton.innerText = "Apply New Settings";
            acceptButton.addEventListener("click", () => {
                localStorage.setItem("settings", JSON.stringify(JSON.parse(Settings)));
                location.reload();
            });
            acceptButton.style.marginLeft = "0.5rem";
            document.querySelector(".dialog > footer").appendChild(acceptButton);
        } catch {
            alertClient("Error Importing Settings", "The settings file is invalid or corrupt." +
                " Please try a different file.", 2);
        }
    }
}