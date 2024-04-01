function main() {
  document.getElementById("host").style.display = "block";
  document.getElementById("gradecalc").style.display = "none";
  document.getElementById("special").style.display = "none";
  document.getElementById("loading").style.display = "none";
  document.getElementById("nav2").className = "active";
  document.getElementById("link2").className = "navlink";
  document.getElementById("link3").className = "navlink";
}

function gradecalc() {
  try {
    navigator.userAgentData.brands;
    document.getElementById("host").style.display = "none";
    document.getElementById("gradecalc").style.display = "block";
    document.getElementById("special").style.display = "none";
    document.getElementById("loading").style.display = "none";
    document.getElementById("nav2").className = "navlink";
    document.getElementById("link2").className = "active";
    document.getElementById("link3").className = "navlink";
  } catch {
    window.open("https://gradecalc.kones.tech");
  }
}

/*function special() {
  document.getElementById("host").style.display = "none";
  document.getElementById("gradecalc").style.display = "none";
  document.getElementById("special").style.display = "block";
  document.getElementById("loading").style.display = "none";
  document.getElementById("link1").className = "navlink";
  document.getElementById("link2").className = "navlink";
  document.getElementById("link3").className = "active";
}*/

function settings() {
  let x = (screen.width/2) - 200;
  let y = (screen.height/2) - 420;
  let settingsWindow = window.open("/sched/settings/", "settings", "status=0,toolbar=0,location=0,width=400,height=720,screenX="+ x +",screenY="+y+",popup=true");
  let isClosedInterval = setInterval(()=>{
    if (settingsWindow.closed){
      clearInterval(isClosedInterval);
      window.location.reload();
    }
  },50);
}

function objectLength(obj) {
  let result = 0;
  for(let prop in obj) {
    if (obj.hasOwnProperty(prop)) {result++;}
  } return result;
}

function skipTask() {}

const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const monthnames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const d = new Date();
let year = d.getFullYear();
let month = d.getMonth();
let date = d.getDate();
let day = weekday[d.getDay()];
let hour = d.getHours();
let minutes = d.getMinutes();
let seconds = d.getSeconds();
if (0 < d.getDay() && d.getDay() < 6) {document.getElementById(day + "Lunch").className += " active";}

function getInfo() {
  let info = new XMLHttpRequest();
  info.open('GET', 'https://croomssched.glitch.me/infoFetch.json');
  info.responseType = 'json';
  info.send();
  info.onload = () => {setInfo(JSON.parse(JSON.stringify(info.response)));}
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
  //document.getElementById("track").src = information.tropicalLink;
  document.getElementById("senseless").innerHTML = "\"" + information.senseless + "\"";
  document.getElementById("quickbit1").innerHTML = information.quickBits[1];
  document.getElementById("quickbit2").innerHTML = information.quickBits[2];
  document.getElementById("quickbit3").innerHTML = information.quickBits[3];
  document.getElementById("quickbit4").innerHTML = information.quickBits[4];
  document.getElementById("quickbit5").innerHTML = information.quickBits[5];
}

let x = setInterval(function() {
  const ds = new Date();
  let year = ds.getFullYear();
  let month = ds.getMonth();
  let date = ds.getDate();
  let hour = ds.getHours();
  let minutes = ds.getMinutes();
  let hourshort; let apm;
  if (hour >= 13) {hourshort = hour - 12; apm = "PM";}
  else if (hour === 12) {hourshort = hour; apm = "PM";}
  else if (hour === 0) {hourshort = 12; apm = "AM";}
  else {hourshort = hour; apm = "AM";}

  // CLOCK //
  if (minutes < 10) {minutes = "0" + minutes;}
  document.getElementById("datetime").innerHTML = (month+1) + "/" + date + "/" + year + " " + hourshort + ":" + minutes + " " + apm
}, 1000);

const hoverListener = (trigger, target) => {
  // The function will try to locate an element with the required CSS selector and use it.
  const triggerElement =  document.querySelector(trigger);
  const targetElement = document.querySelector(target);
  triggerElement.onmouseover = () => {targetElement.style.display = "block";}
  targetElement.onmouseover = () => {targetElement.style.display = "block";}
  triggerElement.onmouseout = () => {targetElement.style.display = "none";}
  targetElement.onmouseout = () => {targetElement.style.display = "none";}
}

hoverListener("#time-shell-dialog-trigger", "#time-shell-dialog");
hoverListener("#navbutton6", "#dp-shell-dialog");
hoverListener("#copyrights", "#copy-shell-dialog")

if (month < 10) {month = "0"+month;}
if (date < 10) {date = "0"+date;}

const getFeed = () => {
  let feed = new XMLHttpRequest();
  feed.open('GET',"https://croomssched.glitch.me/feed.json");
  feed.responseType = 'json';
  feed.send();
  feed.onload = function() {
    loadFeed(JSON.parse(JSON.stringify(feed.response)));
  }
}

const loadFeed = (feeds) => {
  let amnt = objectLength(feeds);
  if (amnt !== 0) {
    document.getElementById("feed-updates").innerHTML = null;
    let index = 1;
    let item = [];
    while (index <= amnt) {
      item[index] = document.createElement("li");
      item[index].innerHTML = feeds[index];
      document.getElementById("feed-updates").innerHTML += "<li>"+ item[index].innerHTML +"</li>";
      index++;
    }
  }
}

function alertClient(title, text) {
  document.querySelector("#alert [title-content]").innerText = title;
  document.querySelector("#alert [text-content]").innerHTML = text;
  document.getElementById("alert").style.display = "block";
}

const welcomeExperience = () => {
  document.getElementById("alert").innerHTML = '' +
      '<div class="details">' +
        '<p style="text-align: center; font-size: 1.3em; font-weight: 600; letter-spacing: 0.3px;">Welcome</p>' +
        '<p style="text-align: center; font-size: 0.8em;">You made it to the new hosting site for the Crooms Bell Schedule! <br> The bell schedule is now <a class="links" href="https://github.com/ajcoolcat/croomssched" target="_blank">open-source</a>, so if there\'s any bugs, make an "issue" (or a <a class="links" href="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests" target="_blank">pull-request</a> if you think you can fix it yourself) on the GitHub repository. ' +
        '<br><br>You also might want to update your bookmarks for the site. <br><br> Anyways, welcome, and enjoy the uninterrupted experience of the new Crooms Bell Schedule website.</p>' +
        '<p style="text-align:center;">' +
          '<button onclick="alertClient(false,null,null)">Close</button>' +
        '</p>' +
      '</div>'
  document.getElementById("alert").style.display = "block";
}

document.body.onload = () => {
  if (location.host === "croomssched.cyclic.app") {
    location.host = "croomssched.tech"
  }

  let params = new URL(document.location).searchParams;
  if (params.get("welcomeExperience") === "true") {
    welcomeExperience();
  } else if (params.get("goto") === "gradecalc") {
    gradecalc();
  }
  resizeGradeCalc();
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
        if (this.dayName === "Washington's Birthday") {this.dayName = "Monday";}
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
    let item = []
    document.getElementById("alert-list").innerHTML = null
    while (index <= amnt - 1) {
      let endtime = new Date(wxalert[index].properties.ends);
      let currentday = d.getDay();
      if (endtime == "Wed Dec 31 1969 19:00:00 GMT-0500 (Eastern Standard Time)") {endtime = "further notice"}
      else {
        let endday = endtime.getDay();
        if (endday === currentday) {endday = " "}
        else {endday = weekdays[endday] + " at "}
        let endhour = endtime.getHours();
        if (endhour >= 12) {endhour -= 12; apm = "PM"}
        else {apm = "AM"}
        let endminute = endtime.getMinutes();
        if (endminute < 10) {endminute = "0"+endminute}
        endtime = endday + endhour + ":" + endminute + " " + apm;
      }

      if (wxalert[index].properties.severity === "Extreme" && wxalert[index].properties.event.endsWith("Warning") || wxalert[index].properties.event.endsWith("Emergency"))
      {isUrgent = 'class="urgent"'}
      else {isUrgent = null}

      item[index] = document.createElement("li");
      item[index].innerHTML = wxalert[index].properties.event + " until " + endtime;
      document.getElementById("alert-list").innerHTML += "<li " + isUrgent + ">"+ item[index].innerHTML +"</li>";
      index++;
    } document.getElementById("alerts").style.display = "block";
  }
}

let altloc = "https://api.weather.gov/alerts/active?zone=FLC117"; //"https://api.weather.gov/alerts/active?area=FL"

const getAlerts = () => {
  let art = new XMLHttpRequest();
  art.open('GET', altloc);
  art.responseType = 'json';
  art.send();
  art.onload = () => {loadAlerts(JSON.parse(JSON.stringify(art.response.features)))}
}

window.addEventListener("resize", resizeGradeCalc);

function resizeGradeCalc() {
  document.querySelector(":root").style.setProperty("--window-height",  window.innerHeight - (document.querySelector("ul.navbar").clientHeight + document.querySelector("ul.footbar").clientHeight) + 1 + "px");
}

function randomWindow() {
  const urls = [
    "/bob",
    "/teacher",
    "//croomssched.glitch.me/poll",
    "//google.com",
    "//bing.com",
    "//catsinsinks.com",
    "//update.croomssched.tech",
    "//outlook.com",
    "//collegeboard.org",
    "//example.com",
    "//github.com",
    "//derpybird.glitch.me/error/404.html",
    "//pcjs.org",
  ];

  let window_to_open = urls[getRandomInt(1, 13)];
  window.open(window_to_open);
}

if (window.history.length > 1) {
  document.querySelector("[menu-id=main] [role=back]").style.display = "block";
  document.querySelector("[menu-id=main] [role=forward]").style.display = "block";
} else {
  document.querySelector("[menu-id=main] [role=back]").style.display = "none";
  document.querySelector("[menu-id=main] [role=forward]").style.display = "none";
}

document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});
document.addEventListener('DOMContentLoaded', () => {
  setRightClick(document.querySelector("main"), document.querySelector("[menu-id=main]"));
  setRightClick(document.querySelector("ul.navbar"), document.querySelector("[menu-id=random]"));
  document.querySelectorAll("window").forEach((window) => {
    setRightClick(
        document.querySelector("window[windowid='"+ window.attributes.windowid.value + "'] header"),
        document.querySelector("[menu-id=dialog-controls]")
    );
  });
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    setRightClick(document.querySelector("clippy"), document.querySelector("[menu-id=clippy-debug]"));
  } else {setRightClick(document.querySelector("clippy"), document.querySelector("[menu-id=clippy]"));}

  const schedMessenger = new BroadcastChannel("sched-messenger");
  schedMessenger.onmessage = (event) => {
    if (event.data === "lessThan10Minutes") {
      clippyAgent.play("GetAttention");
      clippyAgent.speak("You have less than 10 minutes remaining in the current period.");
    } else if (event.data === "oneMinute") {
      clippyAgent.play("GetAttention");
      clippyAgent.speak("You have one minute remaining in the current period." +
          " Consider packing up and getting ready to go.");
    } else if (event.data === "startClass") {
      clippyAgent.speak("Class has started.")
    }
  };

  resizeGradeCalc();
  getInfo(); setInterval(getInfo, 60000);
  getAlerts(); setInterval(getAlerts, 60000);
  getFeed(); setInterval(getFeed, 30000);
  getForecast(); setInterval(getForecast, 60000);
});
document.body.click();
main();