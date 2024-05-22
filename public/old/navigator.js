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