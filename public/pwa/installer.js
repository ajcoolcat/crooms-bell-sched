let installPrompt = null;
const installRecommender = document.getElementById("pwa-installer");

window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event;
    installRecommender.classList.add("active");
});

document.getElementById("accept-pwa-installer").addEventListener("click", async () => {
    if (!installPrompt) {return;}
    const result = await installPrompt.prompt();
    console.log(`Install prompt was: ${result.outcome}`);
    disableInAppInstallPrompt();
});

document.getElementById("decline-pwa-installer").addEventListener("click", disableInAppInstallPrompt);

function disableInAppInstallPrompt() {
    installPrompt = null;
    installRecommender.classList.remove("active");
}

function openInAppInstallPrompt() {
    installRecommender.classList.add("active");
}