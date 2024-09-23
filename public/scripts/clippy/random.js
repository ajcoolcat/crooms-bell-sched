function clippyRandomQuote() {
    if (getRandomInt(0, 3) === 0) {
        fetch("https://croomssched.glitch.me/feed.json").then((res) => {
            return res.text();
        }).then((res) => {
            return JSON.parse(res);
        }).then((data) => {
           console.log(data)
        });
    } else if (getRandomInt(0, 3) === 1) {
        fetch("https://croomssched.glitch.me/infoFetch.json").then((res) => {
            return res.text();
        }).then((res) => {
            return JSON.parse(res);
        }).then((data) => {
            console.log(data.quickBits);
        });
    } else {
        fetch("https://croomssched.glitch.me/infoFetch.json").then((res) => {
            return res.text();
        }).then((res) => {
            return JSON.parse(res);
        }).then((data) => {
            console.log(data.senseless);
        });
    }
}