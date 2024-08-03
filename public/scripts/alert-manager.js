function alertBalloon(title, content, severity) {
    let balloon = document.createElement("div");

    let balloonIcon = document.createElement("span");
    balloonIcon.className = "icon";

    let dialogBody = document.createElement("div");
    balloon.appendChild(dialogBody);
    dialogBody.appendChild(balloonIcon);

    let balloonBody = document.createElement("div");
    dialogBody.appendChild(balloonBody);

    let balloonHeader = document.createElement("h3");
    balloonHeader.innerHTML = title;
    balloonBody.appendChild(balloonHeader);

    let balloonContent = document.createElement("p");
    balloonContent.innerHTML = content;
    balloonBody.appendChild(balloonContent);

    let balloonClose = document.createElement("span");
    balloonClose.className = "close";
    let childBalloonClose = document.createElement("span");
    balloonClose.appendChild(childBalloonClose);
    childBalloonClose.addEventListener("click", () => {
        balloon.remove();
    }, false);

    balloon.appendChild(balloonClose);

    if (severity === "info" || severity === 0) {
        balloon.classList.add("info");
    } else if (severity === "warn" || severity === "warning" || severity === 1) {
        balloon.classList.add("warn");
    } else if (severity === "alert" || severity === "error" || severity === 2) {
        balloon.classList.add("alert");
    }

    document.getElementById("alert-floater").appendChild(balloon);

    setTimeout(() => {
        balloon.remove();
    }, 10000);

    return balloon;
}