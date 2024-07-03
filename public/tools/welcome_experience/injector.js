let intervals = {
    intA: false, intB: false, intC: false
};

fetch("/index.html").then((res) => {
    return res.text();
}).then((res) => {
    const HTMLParser = new DOMParser();
    const data = HTMLParser.parseFromString(res, "text/html");
    document.body.appendChild(data.querySelector("header"));
    document.body.appendChild(data.querySelector("footer"));
    createCBSHSched(document.getElementById("sched"));

    document.getElementById("date-time").classList.add("active");
    intervals.intA = setInterval(() => {
        document.getElementById("date-time").innerText = CBSHSched.time.date + "   " + CBSHSched.time.time;
        document.getElementById("current-period").innerText = CBSHSched.period.current + " ends in " + CBSHSched.period.remainingTime;
    }, 1000);

    intervals.intB = setInterval(() => {
        document.getElementById("date-time").removeAttribute("class");
        document.getElementById("current-period").classList.add("active");
    }, 30000);

    intervals.intC = setInterval(() => {
        document.getElementById("current-period").removeAttribute("class");
        document.getElementById("date-time").classList.add("active");
    }, 40000);
});