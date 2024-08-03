function viewAlert(id) {
    fetch("https://api.weather.gov/alerts/" + id).then(async (res) => {
        return JSON.parse(await res.text()).properties;
    }).then((properties) => {
        console.log(properties)
        document.querySelector("#wx-alert-panel > h3").innerText = properties.event;
        document.querySelector("#wx-alert-panel > ul > li:nth-child(1) > span").innerText = properties.senderName;
        document.querySelector("#wx-alert-panel > pre").innerText = properties.description;
        document.querySelector("#wx-alert-panel > h4 > span").innerText = properties.parameters.NWSheadline[0];

        if (properties.parameters.NWSheadline[0].length > 60) {
            document.querySelector("#wx-alert-panel > h4 > span").classList.add("marquee");
        } else {
            document.querySelector("#wx-alert-panel > h4 > span").classList.remove("marquee");
        }

        let endtime = new Date(properties.ends);
        let expiretime = new Date(properties.expires);
        let currentday = new Date().getDay();
        if (endtime.toString() === "Wed Dec 31 1969 19:00:00 GMT-0500 (Eastern Standard Time)" &&
            expiretime.toString() === "Wed Dec 31 1969 19:00:00 GMT-0500 (Eastern Standard Time)") {
            document.querySelector("#wx-alert-panel > ul > li:nth-child(2) > span").innerText = "When notified";
        } else if (endtime.toString() === "Wed Dec 31 1969 19:00:00 GMT-0500 (Eastern Standard Time)") {
            document.querySelector("#wx-alert-panel > ul > li:nth-child(2) > span").innerText = parseTime(expiretime);
        } else {
            document.querySelector("#wx-alert-panel > ul > li:nth-child(2) > span").innerText = parseTime(endtime);
        }

        function parseTime(endtime) {
            let endday = endtime.getDay();
            if (endday === currentday) {endday = " "}
            else {endday = weekday[endday] + " at "}

            let endhour = endtime.getHours();
            if (endhour > 12) {endhour -= 12; apm = "PM"}
            else if (endhour === 12) {apm = "PM"}
            else {apm = "AM"}

            let endminute = endtime.getMinutes();
            if (endminute < 10) {endminute = "0"+endminute}

            return endday + endhour + ":" + endminute + " " + apm;
        }
    });

    document.getElementById("wx-alert-panel").classList.add("active");
}

document.querySelector("#wx-alert-panel > div.icon").addEventListener("click", hideAlertPanel, false);

function hideAlertPanel() {
    document.getElementById("wx-alert-panel").classList.remove("active");
}