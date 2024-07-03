console.load = (value) => {
    window.$value = value;
};

function alertClient(title, content, severity) {
    document.body.style.userSelect = "none";

    let dialog = document.createElement("div");
    dialog.className = "dialog";

    let dialogHeader = document.createElement("header");
    let dialogTitle = document.createElement("h1");
    dialogHeader.appendChild(dialogTitle);
    dialogTitle.className = "small";
    dialogTitle.innerText = title;
    dialog.appendChild(dialogHeader);

    let dialogBody = document.createElement("main");
    dialogBody.innerHTML = content;
    dialog.appendChild(dialogBody);

    let dialogFooter = document.createElement("footer");
    let dialogClose = document.createElement("button");
    dialogClose.innerText = "Close";
    dialogClose.addEventListener("click", () => {
        dialog.remove();
        document.body.style.userSelect = null;
    }, false);

    dialogFooter.appendChild(dialogClose);
    dialog.appendChild(dialogFooter);

    document.body.appendChild(dialog);

    if (severity === 1) {
        dialogClose.innerText = "Okay";
    } else if (severity === 2) {
        dialogClose.innerText = "Okay";
        modalize();
    }

    function modalize() {
        let modal = document.createElement("div");
        modal.className = "modal";
        document.body.appendChild(modal);

        dialogClose.addEventListener("click", () => {
            modal.remove();
        }, false);
    }
}

function feedback() {
    window.open(
        "https://docs.google.com/forms/d/e/1FAIpQLSdi1UT8oGpJXhHpdzMpTUoZjGBHES0Rub7xJxGALzL8XXFPSA/viewform",
    );
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function share(triggerElement) {
    try {
        navigator
            .share({
                title: document.querySelector("title").innerText,
                text: document
                    .querySelector("meta[name=description]")
                    .content.toString(),
                url: window.location.href,
            })
            .then();
    } catch {
        attemptCopyShare().then();
    } finally {
        triggerElement.style.display = "none";
    }
}

async function attemptCopyShare() {
    try {
        await navigator.clipboard.writeText(window.location.href);
        let clipboardNote = document.createElement("div");
        clipboardNote.id = "share-clipboard-note";
        clipboardNote.innerText = "Link was copied to the clipboard."
        document.getElementById("share-clipboard-note").style.display = "block";
        document.getElementById("share-clipboard-note").style.opacity = "1";
        document.getElementById("share-clipboard-note").style.animation =
            "0.5s linear fadein";
        setTimeout(() => {
            document.getElementById("share-clipboard-note").style.animation =
                "0.5s linear fadeout";
            setTimeout(() => {
                document.getElementById("share-clipboard-note").style.opacity = "0";
                document.getElementById("share-clipboard-note").style.display = "none";
            }, 500);
        }, 5000);
    } catch (e) {
        alertClient(
            "Sharing Error",
            "There seems to be an issue sharing the link. Please copy this link manually with CTRL+C: <br>" +
            "<span style='user-select: all'>https://croomssched.tech</span><br><br>Details: " +
            e,
        );
    }
}

let mousePos;

document.onmousemove = handleMouseMove;

function handleMouseMove(event) {
    let eventDoc, doc, body;

    if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX =
            event.clientX +
            ((doc && doc.scrollLeft) || (body && body.scrollLeft) || 0) -
            ((doc && doc.clientLeft) || (body && body.clientLeft) || 0);
        event.pageY =
            event.clientY +
            ((doc && doc.scrollTop) || (body && body.scrollTop) || 0) -
            ((doc && doc.clientTop) || (body && body.clientTop) || 0);
    }

    mousePos = {
        x: event.pageX,
        y: event.pageY,
    };
}

function setRightClick(targetElement, targetMenuElement) {
    targetMenuElement.addEventListener(
        "contextmenu",
        function (e) {
            e.preventDefault();
        },
        false,
    );

    targetElement.addEventListener(
        "contextmenu",
        function (e) {
            e.preventDefault();
            if (targetMenuElement === document.querySelector("[menu-id=main]")) {
                if (window.getSelection().toString() !== "") {
                    document.querySelector("[menu-id=main] [role=copy]").style.display =
                        "block";
                } else {
                    document.querySelector("[menu-id=main] [role=copy]").style.display =
                        "none";
                }

                let elementsUnderMouse = document.elementsFromPoint(
                    mousePos.x,
                    mousePos.y,
                );
                for (let item of elementsUnderMouse) {
                    if (item.id === "lunch") {
                        link = showMoreInfo("https://fs3.scps.k12.fl.us/menu/1_HS.pdf");
                        break;
                    } else if (item.id === "weather") {
                        link = showMoreInfo(
                            "https://forecast.weather.gov/MapClick.php?lon=-81.28981590270996&lat=28.801779923490415",
                        );
                        break;
                    } else if (item.id === "quickbits") {
                        link = showMoreInfo(
                            "https://linustechtips.com/forum/13-tech-news/",
                        );
                        break;
                    } else {
                        document.querySelector("[menu-id=main] [role=more]").style.display =
                            "none";
                    }
                }
            }

            targetMenuElement.style.display = "block";
            targetMenuElement.style.opacity = "1";
            targetMenuElement.style.animation = "0.1s linear fadein";
            targetMenuElement.style.top = mouseY(e) + "px";
            targetMenuElement.style.left = mouseX(e) + "px";
        },
        false,
    );

    targetMenuElement.addEventListener(
        "mousedown",
        function (e) {
            e.preventDefault();
            e.target.click();
        },
        false,
    );

    function hideMenu() {
        targetMenuElement.style.opacity = "0";
        targetMenuElement.style.display = "none";
    }

    window.addEventListener("blur", hideMenu);
    targetElement.addEventListener("mousedown", hideMenu);
    document.querySelector("header").addEventListener("mousedown", hideMenu);
    document.querySelector("main").addEventListener("mousedown", hideMenu);
    document.querySelector("footer").addEventListener("mousedown", hideMenu);
    document.querySelector("#clippy").addEventListener("mousedown", function (e) {
        if (e.button === 2) {
            hideMenu();
        }
    });
}

function mouseX(e) {
    if (e.pageX) {
        return e.pageX;
    } else if (e.clientX) {
        return (
            e.clientX +
            (document.documentElement.scrollLeft
                ? document.documentElement.scrollLeft
                : document.body.scrollLeft)
        );
    } else {
        return null;
    }
}

function mouseY(e) {
    if (e.pageY) {
        return e.pageY;
    } else if (e.clientY) {
        return (
            e.clientY +
            (document.documentElement.scrollTop
                ? document.documentElement.scrollTop
                : document.body.scrollTop)
        );
    } else {
        return null;
    }
}

function showMoreInfo(newLink) {
    document.querySelector("[menu-id=main] [role=more]").style.display = "block";
    return newLink;
}

let link;

function openWindowLink() {
    window.open(link);
}

async function copyText() {
    try {
        await navigator.clipboard.writeText(window.getSelection().toString());
    } catch (e) {
        alertClient(
            "Copy Error",
            "There seems to be a problem copying text. Just use CTRL+C for now.<br><br>Details: " +
            e,
        );
    }
}

function objectLength(obj) {
    let result = 0;
    for(let prop in obj) {
        if (obj.hasOwnProperty(prop)) {result++;}
    } return result;
}