const controlPanel = document.getElementById("control-center");
const clippyControlsHidden = document.getElementById("clippy-hidden");
const clippyControlsShown = document.getElementById("clippy-shown");
let settings_enabled = false;
controlPanel.style.transition = "all 0.2s ease-in-out";

document.querySelector("main").onclick = () => {if (settings_enabled === true) {toggleSettingsPanel()}}
document.querySelector("#gradeCalcMasterFrame").onclick = () => {if (settings_enabled === true) {toggleSettingsPanel()}}

function toggleSettingsPanel() {
    if (settings_enabled === false) {
        settings_enabled = true;
        controlPanel.className = "active";
    } else {
        settings_enabled = false;
        controlPanel.className = "";
    }
}

function showClippy() {
    clippyAgent.show();
    document.querySelector("#show-clippy").disabled = "true";
    document.querySelector("#show-clippy").innerHTML = "Please wait...";
    setTimeout(() => {
        document.querySelector("#show-clippy").innerHTML = "Show Clippy";
        document.querySelector("#show-clippy").removeAttribute("disabled");
        clippyControlsHidden.style.display = "none";
        clippyControlsShown.style.display = "block";
    }, 3500);
}

function hideClippy() {
    clippyAgent.hide();
    document.querySelector("#hide-clippy").disabled = "true";
    document.querySelector("#hide-clippy").innerHTML = "Please wait...";
    document.querySelector("#anim-clippy").disabled = "true";
    document.querySelector("#anim-clippy").innerHTML = "Please wait...";
    setTimeout(() => {
        document.querySelector("#hide-clippy").innerHTML = "Hide Clippy";
        document.querySelector("#hide-clippy").removeAttribute("disabled");
        document.querySelector("#anim-clippy").innerHTML = "Animate Clippy";
        document.querySelector("#anim-clippy").removeAttribute("disabled");
        clippyControlsShown.style.display = "none";
        clippyControlsHidden.style.display = "block";
    }, 3500);
}

function animateClippy() {
    clippyAgent.animate();
    document.querySelector("#hide-clippy").disabled = "true";
    document.querySelector("#hide-clippy").innerHTML = "Please wait...";
    document.querySelector("#anim-clippy").disabled = "true";
    document.querySelector("#anim-clippy").innerHTML = "Please wait...";
    setTimeout(() => {
        document.querySelector("#hide-clippy").innerHTML = "Hide Clippy";
        document.querySelector("#hide-clippy").removeAttribute("disabled");
        document.querySelector("#anim-clippy").innerHTML = "Animate Clippy";
        document.querySelector("#anim-clippy").removeAttribute("disabled");
    }, 3500);
}