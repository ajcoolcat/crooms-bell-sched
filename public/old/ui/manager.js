document.getElementById("styleManager") ? styleManager = document.getElementById("styleManager") : createStyleManager();

function createStyleManager() {
    let style = document.createElement("div");
    style.id = "styleManager";
    document.body.appendChild(style);
}