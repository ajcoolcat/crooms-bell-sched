function downloadApp() {
    document.getElementById("widget-board").classList.remove("active");
    document.getElementById("download").style.left = "0";

    setTimeout(() => {
        window.location.href = "https://app.croomssched.tech/download/win32/";
        document.getElementById("countdown").innerText = "has started";
    }, 2000)
}

function quitDownloader() {
    document.getElementById("download").removeAttribute("style");
    document.getElementById("countdown").innerText = "will begin shortly";
}