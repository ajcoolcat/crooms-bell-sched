function getInfo() {
    let info = new XMLHttpRequest();
    info.open('GET', 'https://croomssched.glitch.me/infoFetch.json');
    info.responseType = 'json';
    info.send();
    info.onload = () => {setInfo(JSON.parse(JSON.stringify(info.response)));}

    let fun = new XMLHttpRequest();
    fun.open('GET', 'https://g-chrome-dino.glitch.me/cbsh.json');
    fun.responseType = 'json';
    fun.send();
    fun.onload = () => {setFun(JSON.parse(JSON.stringify(fun.response)));}
}

function setInfo(information) {
    document.getElementById("MondayLunchItem").innerHTML = information.lunch[1].name;
    document.getElementById("TuesdayLunchItem").innerHTML = information.lunch[2].name;
    document.getElementById("WednesdayLunchItem").innerHTML = information.lunch[3].name;
    document.getElementById("ThursdayLunchItem").innerHTML = information.lunch[4].name;
    document.getElementById("FridayLunchItem").innerHTML = information.lunch[5].name;
    document.getElementById("AllLunchItem").innerHTML = information.lunch[6];
    const dates = new Date;
    let day = dates.getDay();
    if (0 < day && day < 6) {document.getElementById("DailyLunchImage").src = information.lunch[day].image;}
    document.querySelector("#quickbits > div > ol").innerHTML = "";
    information.quickBits.forEach((quickBit) => {
        let bitQuick = document.createElement("li");
        bitQuick.innerHTML = quickBit;
        document.querySelector("#quickbits > div > ol").appendChild(bitQuick);
    });
}

function setFun(information) {
    document.getElementById("senseless").innerHTML = information.senseless;
    document.getElementById("quote").innerHTML = information.teacherquote.quote;
    document.getElementById("teacher").innerHTML = information.teacherquote.teacher;
}

const getFeed = () => {
    let feed = new XMLHttpRequest();
    feed.open('GET',"https://api.croomssched.tech/feed");
    feed.responseType = 'json';
    feed.send();
    feed.onload = function() {
        loadFeed(JSON.parse(JSON.stringify(feed.response.data)));
    }
}

const loadFeed = (feeds) => {
    let amnt = objectLength(feeds);
    if (amnt !== 0) {
        document.getElementById("feed-updates").innerHTML = null;
        feeds.forEach((update) => {
            if (update.store === "public") {
                let fu = document.createElement("li");
                fu.innerHTML = update.data;
                document.getElementById("feed-updates").appendChild(fu);
            }
        });
    } else {
        let noFeed = document.createElement("span");
        noFeed.innerHTML = "There are no Feed Updates. <a class='links' onclick='loadTool(`new-feed`, `/tools/feed-updates`, false)'>Submit one.</a>";
        noFeed.style.userSelect = "none";
        document.getElementById("feed-updates").innerHTML = noFeed.outerHTML;
    }
}

const getForecast = () => {
    let foc = new XMLHttpRequest();
    foc.open('GET', 'https://api.weather.gov/gridpoints/MLB/28,80/forecast');
    foc.responseType = 'json';
    foc.send();
    foc.onload = () => {
        let forecasts = new Array(14);
        let data = JSON.parse(JSON.stringify(foc.response));
        class Forecast {
            constructor(dayName, iconFile, desc, temp, windSpeed, windDir) {
                this.dayName = dayName;
                this.icon = iconFile;
                this.desc = desc;
                this.temp = temp;
                this.windSpeed = windSpeed;
                this.windDir = windDir;

                if (this.dayName.startsWith("This")) {this.dayName = this.dayName.substring(5);}
                if (this.dayName.endsWith(" Night")) {this.dayName = "Night";}
            }
        }

        let index = 0;
        while (index <= 5) {
            forecasts[index] = new Forecast(
                data.properties.periods[index].name,
                data.properties.periods[index].icon,
                data.properties.periods[index].shortForecast,
                data.properties.periods[index].temperature,
                data.properties.periods[index].windSpeed,
                data.properties.periods[index].windDirection
            );
            index++;
        }

        index = 0;
        while (index <= 4) {
            document.getElementById(index+"-name").innerHTML = forecasts[index].dayName;
            document.getElementById(index+"-icon").src = forecasts[index].icon;
            document.getElementById(index+"-desc").innerHTML = forecasts[index].desc;
            document.getElementById(index+"-temp").innerHTML = forecasts[index].temp;
            document.getElementById(index+"-windd").innerHTML = forecasts[index].windDir;
            document.getElementById(index+"-winds").innerHTML = forecasts[index].windSpeed;
            index++;
        }
    }
}

const loadAlerts = (wxalert) => {
    let amnt = objectLength(wxalert);
    if (amnt !== 0) {
        let index = 0;
        let apm;
        let isUrgent;
        document.getElementById("alert-list").innerHTML = null
        while (index <= amnt - 1) {
            let endtime = new Date(wxalert[index].properties.ends);
            let expiretime = new Date(wxalert[index].properties.expires);
            if (endtime.toString() === "Wed Dec 31 1969 19:00:00 GMT-0500 (Eastern Standard Time)" &&
                expiretime.toString() === "Wed Dec 31 1969 19:00:00 GMT-0500 (Eastern Standard Time)") {
                endtime = "further notice"
            } else if (endtime.toString() === "Wed Dec 31 1969 19:00:00 GMT-0500 (Eastern Standard Time)") {
                endtime = parseTime(expiretime);
            } else {
                endtime = parseTime(endtime);
            }

            let alertItem = document.createElement("li");
            alertItem.innerHTML = wxalert[index].properties.event + " until " + endtime;
            alertItem.dataset.id = wxalert[index].properties.id;
            alertItem.addEventListener("click", () => {viewAlert(alertItem.dataset.id)}, false);

            if (wxalert[index].properties.severity === "Extreme" && wxalert[index].properties.event.endsWith("Warning") || wxalert[index].properties.event.endsWith("Emergency"))
            {alertItem.classList.add("urgent")}
            else if (wxalert[index].properties.severity === "Extreme" && wxalert[index].properties.event.endsWith("Watch"))
            {alertItem.classList.add("important")}

            document.getElementById("alert-list").appendChild(alertItem);
            index++;
        } document.getElementById("alerts").style.display = "block";
    }
}

let altloc = "https://api.weather.gov/alerts/active?zone=FLC117";
//altloc = "https://api.weather.gov/alerts/active?area=FL";

const getAlerts = () => {
    let art = new XMLHttpRequest();
    art.open('GET', altloc);
    art.responseType = 'json';
    art.send();
    art.onload = () => {loadAlerts(JSON.parse(JSON.stringify(art.response.features)))}
}

const getSurveys = () => {
    fetch("https://api.croomssched.tech/surveys").then((res) => {
        return res.text();
    }).then((res) => {
        return JSON.parse(res).data;
    }).then((data) => {
        loadSurveys(data);
    })
}

const loadSurveys = (surveys) => {
    document.querySelector("#survey-list").innerHTML = ""
    surveys.forEach((survey) => {
        let link = document.createElement("a");
        link.innerText = survey.name;
        link.href = survey.link;
        link.target = "CBSH-survey";

        let container = document.createElement("li");
        container.appendChild(link);
        document.querySelector("#survey-list").appendChild(container);
    })
}

function parseTime(endtime) {
    let apm;
    let endday = endtime.getDay();
    if (endday === new Date().getDay()) {endday = " "}
    else {endday = weekday[endday] + " at "}

    let endhour = endtime.getHours();
    if (endhour > 12) {endhour -= 12; apm = "PM"}
    else if (endhour === 12) {apm = "PM"}
    else if (endhour === 0) {endhour = 12; apm = "AM"}
    else {apm = "AM"}

    let endminute = endtime.getMinutes();
    if (endminute < 10) {endminute = "0"+endminute}

    return endday + endhour + ":" + endminute + " " + apm;
}

getInfo(); setInterval(getInfo, 60000);
getAlerts(); setInterval(getAlerts, 60000);
getFeed(); setInterval(getFeed, 30000);
getForecast(); setInterval(getForecast, 60000);
getSurveys(); setInterval(getSurveys, 60000);