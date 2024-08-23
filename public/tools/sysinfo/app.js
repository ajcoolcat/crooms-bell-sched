const userAgentData = {
    brands: navigator.userAgentData.brands,
    isMobile: navigator.userAgentData.mobile,
    platform: navigator.userAgentData.platform,
    memory: navigator.deviceMemory * 2
};

document.getElementById("platform").innerText = userAgentData.platform;
document.getElementById("isMobile").innerText = userAgentData.isMobile ? "Mobile" : "Desktop";
navigator.userAgentData.getHighEntropyValues(["architecture"]).then((r) => {
    document.getElementById("architecture").innerText = r.architecture
});

if (userAgentData.brands[2].brand === "Vivaldi" || userAgentData.brands[2].brand === "Google Chrome" || userAgentData.brands[2].brand === "Microsoft Edge") {
    document.getElementById("browser").innerText = userAgentData.brands[2].brand + " v" + userAgentData.brands[2].version;
} else {
    document.getElementById("browser").innerText = userAgentData.brands[1].brand + " v" + userAgentData.brands[1].version;
}

document.getElementById("memory").innerText = `${userAgentData.memory} GiB`;