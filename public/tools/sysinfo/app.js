const userAgentData = {
    brands: navigator.userAgentData.brands[1],
    isMobile: navigator.userAgentData.mobile,
    platform: navigator.userAgentData.platform
};

document.getElementById("platform").innerText = userAgentData.platform;
document.getElementById("isMobile").innerText = userAgentData.isMobile ? "Mobile" : "Desktop";
document.getElementById("browser").innerText = userAgentData.brands.brand + " v" + userAgentData.brands.version;
navigator.userAgentData.getHighEntropyValues(["architecture"]).then((r) => {
    document.getElementById("architecture").innerText = r.architecture
});