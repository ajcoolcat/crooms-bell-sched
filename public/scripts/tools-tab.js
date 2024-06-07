fetch("/tabs/tools.json").then((res) => {
    return res.text();
}).then((res) => {
    return JSON.parse(res);
}).then((res) => {
    return res.tools;
}).then((tools) => {
    tools.forEach((tool) => {
        const item = document.createElement("div");
        item.tabIndex = 1;
        item.addEventListener("click", () => {
            loadTool(tool.id, tool.link, tool.check);
        });
        item.innerText = tool.name;

        document.getElementById("tools-list").appendChild(item);
    });
});

const loadTool = (id, path, check) => {
    document.getElementById("widget-board").classList.remove("active");
    quitDownloader();
    let tools = document.getElementById("others").children;

    if (check === true) {
        try {
            navigator.userAgentData.brands;

            document.getElementById("widget-board").classList.add("hidden");
            document.getElementById("others").classList.remove("hidden");
            for (let i = 0; i < tools.length; i++) {
                document.getElementById("others").children[i].classList.remove("active");
            }
            document.getElementById(id).classList.add("active");
        } catch {
            window.open(path);
        }
    } else {
        try {
            document.getElementById("widget-board").classList.add("hidden");
            document.getElementById("others").classList.remove("hidden");
            for (let i = 0; i < tools.length; i++) {
                document.getElementById("others").children[i].classList.remove("active");
            }
            document.getElementById(id).classList.add("active");
        } catch {
            for (let i = 0; i < tools.length; i++) {
                document.getElementById("others").children[i].classList.remove("active");
            }

            let newTool = document.createElement("div");
            newTool.id = id;
            newTool.innerHTML = '<iframe src="'+ path +'"></iframe>';

            document.getElementById("others").appendChild(newTool);
            newTool.classList.add("active");
        }
    }
}

const home = () => {
    quitDownloader();
    document.getElementById("others").classList.add("hidden");
    let tools = document.getElementById("others").children;

    for (let i = 0; i < tools.length; i++) {
        document.getElementById("others").children[i].classList.remove("active");
    }

    document.getElementById("widget-board").classList.remove("hidden");
    document.getElementById("widget-board").classList.add("active");
}