function main() {
  document.getElementById("host").removeAttribute("hidden");
  document.getElementById("loading").setAttribute("hidden", "true");
  startCountdown();
}

const startCountdown = () => {
  setTimeout(() => {
    window.location.href = "https://cbsh-updater.vercel.app/download/win32/"; document.getElementById("countdown").innerText = "has started";
    alertClient(true, "Notice for SmartScreen", `If you recieve a popup from Windows SmartScreen, you must click the "more info" link in the middle of the window, and then click "run anyways" to start the installation process.`)
  }, 3000)
}

function community() {window.open("//github.com/ajcoolcat/croomssched/discussions");}

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector("html").style.cssText === "--theme: dark;"){
    document.querySelector("#githubLogo").style.backgroundImage = "url(/github-mark-white.svg)";
  }
}, 1000);

function alertClient(visible, title, text) {
  document.getElementById("alert").innerHTML = '<div class="details"><p style="text-align: center; font-size: 1.3em; font-weight: 600; letter-spacing: 0.3px;">'+title+'</p><p style="text-align: center; font-size: 0.8em;">'+text+'</p><p style="text-align:center;"><button onclick="alertClient(false,null,null)">OK</button></p></div>'
  if (visible == true) {document.getElementById("alert").removeAttribute("hidden");document.getElementById("alert-bkg").removeAttribute("hidden");}
  else if (visible == false) {document.getElementById("alert").setAttribute("hidden","true");document.getElementById("alert-bkg").setAttribute("hidden","true");}
  else {console.error("Parameter missing");}
}

function settings() {
  let x = (screen.width/2) - 200; let y = (screen.height/2) - 420;
  let settingsWindow = window.open("/sched/settings.html", "settings", "status=0,toolbar=0,location=0,width=400,height=720,screenX="+ x +",screenY="+y, "popup=true");
  let isClosedInterval = setInterval(()=>{if (settingsWindow.closed){clearInterval(isClosedInterval); window.location.href = "/";}},50);
}

const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const monthnames = ["January","Febuary","March","April","May","June","July","August","September","October","November","December"];
var x = setInterval(function() {
  const d = new Date(); let year = d.getFullYear(); let month = d.getMonth(); let monthname = monthnames[d.getMonth()]; let date = d.getDate(); let day = weekday[d.getDay()]; let hour = d.getHours(); let minutes = d.getMinutes(); let seconds = d.getSeconds();
  if (hour >= 13) {var hourshort = hour - 12; var apm = "PM";}
  else if (hour == 12) {var hourshort = hour; var apm = "PM";}
  else if (hour == 0) {var hourshort = 12; var apm = "AM"}
  else {var hourshort = hour; var apm = "AM";}

  // CLOCK //
  if (minutes < 10) {minutes = "0"+minutes} if (seconds < 10) {seconds = "0" + seconds}
  document.getElementById("datetime").innerHTML = (month+1) + "/" + date + "/" + year + " " + hourshort + ":" + minutes + " " + apm
}, 1000);

var timeshelltrigger = document.getElementById("time-shell-dialog-trigger"); var timeshell = document.getElementById("time-shell-dialog");
timeshelltrigger.addEventListener("mouseover", timeshow, false); timeshell.addEventListener("mouseover", timeshow, false);
timeshelltrigger.addEventListener("mouseout", timehide, false); timeshell.addEventListener("mouseout", timehide, false);
function timeshow() {timeshell.removeAttribute("hidden");} function timehide() {timeshell.setAttribute("hidden", "true");}

var cpshelltrigger = document.getElementById("copyrights"); var cpshell = document.getElementById("copy-shell-dialog");
cpshelltrigger.addEventListener("mouseover", cpshow, false); cpshell.addEventListener("mouseover", cpshow, false);
cpshelltrigger.addEventListener("mouseout", cphide, false); cpshell.addEventListener("mouseout", cphide, false);
function cpshow() {cpshell.removeAttribute("hidden");} function cphide() {cpshell.setAttribute("hidden", "true");}

main();