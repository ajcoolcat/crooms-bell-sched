function welcome(file) {
    document.body.style.userSelect = "none";
    document.body.style.overflow = "hidden";

    let dialog = document.createElement("div");
    dialog.className = "dialog welcome";

    let dialogHeader = document.createElement("header");
    let dialogTitle = document.createElement("span");
    let dialogClose = document.createElement("span");
    dialogHeader.appendChild(dialogTitle);
    dialogHeader.appendChild(dialogClose);
    dialogTitle.innerText = "Welcome Experience";
    dialogClose.className = "close icon";
    dialogClose.innerText = "close";
    dialog.appendChild(dialogHeader);

    let dialogBody = document.createElement("main");
    dialogBody.innerHTML = "<iframe src='/tools/welcome_experience/"+ file +"'></iframe>";
    dialog.appendChild(dialogBody);

    document.body.appendChild(dialog);

    let modal = document.createElement("div");
    modal.className = "modal";
    document.body.appendChild(modal);

    dialogClose.addEventListener("click", () => {
        document.body.removeAttribute("style");
        dialog.remove();
        modal.remove();
    }, false);

    if (file === "hurricane.html") {
        dialogTitle.innerText = "Hurricane Update #1";
    }
}