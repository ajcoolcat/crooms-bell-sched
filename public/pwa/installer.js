let installPrompt = null;
const installRecommender = document.getElementById("pwa-installer");

window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();

    if (document.cookie.includes("PWAIgnore=true;")) {
        installPrompt = event;
        installRecommender.classList.add("active");
    }
});

document.getElementById("accept-pwa-installer").addEventListener("click", async () => {
    if (!installPrompt) {return;}
    const result = await installPrompt.prompt();
    const expireDate = new Date();
    expireDate.setTime(expireDate.getTime() + (5*24*60*60*1000));
    document.cookie = "PWAIgnore=true; expires=" + expireDate.toUTCString();
    disableInAppInstallPrompt();
});

document.getElementById("decline-pwa-installer").addEventListener("click", disableInAppInstallPrompt);

function disableInAppInstallPrompt() {
    installPrompt = null;
    installRecommender.classList.remove("active");
}