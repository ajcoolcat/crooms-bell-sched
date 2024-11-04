function poll() {
    let link;
    fetch("https://g-chrome-dino.glitch.me/cbsh.json").then((res) => {
        return res.text();
    }).then((data) => {
        link = JSON.parse(data).dailypoll;

        try {
            if (window.top.location.href === window.location.href) {
                window.location.replace("https://croomssched.tech?goto=poll");
            } else {
                window.location.replace(link);
            }
        } catch {
            window.location.replace(link);
        }
    });
}

setTimeout(poll, 2000);
