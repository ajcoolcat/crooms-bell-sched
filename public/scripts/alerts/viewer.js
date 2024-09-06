function viewAlert(id) {
    fetch("https://api.weather.gov/alerts/" + id).then(async (res) => {
        return JSON.parse(await res.text()).properties;
    }).then((properties) => {
        document.querySelector("#wx-alert-panel > h3").innerText = properties.event;
        document.querySelector("#wx-alert-panel > ul > li:nth-child(1) > span").innerText = properties.senderName;
        document.querySelector("#wx-alert-panel > pre").innerText = properties.description;
        document.querySelector("#wx-alert-panel > h4 > span").innerText = "";

        try {
            for (let i = 0; i < properties.parameters.NWSheadline[0].length; i++) {
                if (properties.parameters.NWSheadline[0][i] === "\n" || properties.parameters.NWSheadline[0][i] === "\r") {
                    document.querySelector("#wx-alert-panel > h4 > span").innerHTML += "&nbsp;";
                } else {
                    document.querySelector("#wx-alert-panel > h4 > span").innerHTML += properties.parameters.NWSheadline[0][i];
                }
            }
        } finally {
            try {
                if (properties.parameters.NWSheadline[0].length > 60) {
                    document.querySelector("#wx-alert-panel > h4 > span").classList.add("marquee");
                } else {
                    document.querySelector("#wx-alert-panel > h4 > span").classList.remove("marquee");
                }
            } catch {
                document.querySelector("#wx-alert-panel > h4 > span").innerText = "";
                document.querySelector("#wx-alert-panel > h4 > span").classList.remove("marquee");
            }
        }

        let endtime = new Date(properties.ends);
        let expiretime = new Date(properties.expires);
        if (endtime.toString() === "Wed Dec 31 1969 19:00:00 GMT-0500 (Eastern Standard Time)" &&
            expiretime.toString() === "Wed Dec 31 1969 19:00:00 GMT-0500 (Eastern Standard Time)") {
            document.querySelector("#wx-alert-panel > ul > li:nth-child(2) > span").innerText = "When notified";
        } else if (endtime.toString() === "Wed Dec 31 1969 19:00:00 GMT-0500 (Eastern Standard Time)") {
            document.querySelector("#wx-alert-panel > ul > li:nth-child(2) > span").innerText = parseTime(expiretime);
        } else {
            document.querySelector("#wx-alert-panel > ul > li:nth-child(2) > span").innerText = parseTime(endtime);
        }
    });

    document.getElementById("wx-alert-panel").classList.add("active");
}

document.querySelector("#wx-alert-panel > div.icon").addEventListener("click", hideAlertPanel, false);

function hideAlertPanel() {
    document.getElementById("wx-alert-panel").classList.remove("active");
    document.querySelector("#wx-alert-panel > h4 > span").innerText = "";
    document.querySelector("#wx-alert-panel > h4 > span").classList.remove("marquee");
    document.querySelector("#wx-alert-panel > ul > li > span").innerText = "";
    document.querySelector("#wx-alert-panel > ul > li:nth-child(2) > span").innerText = "";
    document.querySelector("#wx-alert-panel > pre").innerText = "";
    document.querySelector("#wx-alert-panel > h3").innerText = "Event Name";
}