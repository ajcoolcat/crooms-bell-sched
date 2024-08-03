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
        playAudio("Background");
    } else if (severity === 2) {
        dialogClose.innerText = "Okay";
        playAudio("Background");
        createModal();
    } else if (severity === 3) {
        createModal();
        dialogFooter.remove();
    } else if (severity === 4) {
        dialogClose.innerText = "Okay";
        playAudio("Foreground");
        createModal();
    }

    function createModal() {
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
        playAudio("Foreground");
        alertClient(
            "Sharing Error",
            "There seems to be an issue sharing the link. Please copy this link manually with CTRL+C: <br>" +
            "<span style='user-select: all'>https://croomssched.tech</span><br><br>Details: " +
            e,
            0
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

async function copyText() {
    try {
        await navigator.clipboard.writeText(window.getSelection().toString());
    } catch (e) {
        alertClient(
            "Copy Error",
            "There seems to be a problem copying text. Please use CTRL+C for now.<br><br>Details: " + e,
            0
        );
    }
}

function objectLength(obj) {
    let result = 0;
    for(let prop in obj) {
        if (obj.hasOwnProperty(prop)) {result++;}
    } return result;
}

document.addEventListener("DOMContentLoaded", () => {
    const currentTheme = JSON.parse(localStorage.getItem("settings")).theme ? JSON.parse(localStorage.getItem("settings")).theme : null;

    if (currentTheme) {
        document.documentElement.classList.add(currentTheme);
    }

    const accentColor = JSON.parse(localStorage.getItem("settings")).accentColor ? JSON.parse(localStorage.getItem("settings")).accentColor : null;
    document.documentElement.style.setProperty("--accent-color", "var(--" + accentColor + ")");
}, false);

const currentFont = JSON.parse(localStorage.getItem("settings")).font.value ? JSON.parse(localStorage.getItem("settings")).font.value : null;
document.documentElement.style.setProperty("--font", currentFont);

const audio = document.createElement("audio");
document.body.appendChild(audio);

audio.src = "https://cdn.croomssched.tech/data/79b63214-ebc7-4f01-8802-9e2e3a2b436a/Background.wav";
audio.src = "https://cdn.croomssched.tech/data/79b63214-ebc7-4f01-8802-9e2e3a2b436a/Foreground.wav";
audio.src = "https://cdn.croomssched.tech/data/79b63214-ebc7-4f01-8802-9e2e3a2b436a/Confirmation.wav";

function playAudio(soundName) {
    audio.src = "https://cdn.croomssched.tech/data/79b63214-ebc7-4f01-8802-9e2e3a2b436a/" + soundName + ".wav";
    audio.play().then(r => audio.currentTime = 0);
}