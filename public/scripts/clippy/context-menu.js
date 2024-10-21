function setUpClippyContextMenu() {
    document.querySelector("clippy").addEventListener("contextmenu", (e) => {
        e.preventDefault();
    });

    document.querySelector(".clippy").addEventListener("contextmenu", () => {
        let menuContent;

        const contextMenu = document.createElement("div");
        contextMenu.classList.add("context-menu");
        contextMenu.classList.add("fade-hide");
        contextMenu.style.left = mousePos.x + "px";
        contextMenu.style.top = mousePos.y + "px";

        fetch("/scripts/con-menu-templates/clippy.html").then((res) => {
            return res.text();
        }).then((res) => {
            const HTMLParser = new DOMParser();
            const menuDocument = HTMLParser.parseFromString(res, "text/html");
            menuContent = menuDocument.querySelector("body").children;

            for (let i = 0; i < menuContent.length; i++) {
                const item = document.createElement("div");
                item.innerHTML += menuContent.item(i).innerHTML;
                item.className = menuContent.item(i).className;
            }
        });

        document.querySelector("body > header").addEventListener("mousedown", hideContextMenu, false);
        document.querySelector("body > main").addEventListener("mousedown", hideContextMenu, false);
        document.querySelector("body > footer").addEventListener("mousedown", hideContextMenu, false);
        document.querySelector("clippy > .clippy").addEventListener("contextmenu", hideContextMenu, false);
        document.querySelector("clippy > .clippy").addEventListener("mousedown", hideContextMenu, false);
        contextMenu.addEventListener("contextmenu", (e) => {
            e.target.click();
        }, false);

        function hideContextMenu() {
            contextMenu.remove();
        }

        document.querySelector("clippy").appendChild(contextMenu);
    });
}