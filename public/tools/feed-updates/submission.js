document.querySelector("#feed-form > footer > button").addEventListener("click", async () => {
    const feed = document.getElementById("feed-update");
    const link = document.getElementById("feed-link");
    const regex = /^https:?\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4])|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+[a-z\u00a1-\uffff]{2,}\.?)(?::\d{2,5})?(?:[\/?#]\S*)?$/i

    if (!regex.test(link.value) && link.value !== "") {
        const error = document.createElement("p");
        error.innerText = "That is not a valid link.";
        document.querySelector("main").appendChild(error);
        error.classList.add("error");
        link.addEventListener("keydown", () => {error.remove()});
        document.querySelector("button").addEventListener("click", () => {error.remove()});
        return;
    }

    if (feed.value === "") {
        const error = document.createElement("p");
        error.innerText = "Please enter a Feed Update.";
        document.querySelector("main").appendChild(error);
        error.classList.add("error");
        feed.addEventListener("keydown", () => {error.remove()});
        document.querySelector("button").addEventListener("click", () => {error.remove()});
        return;
    }

    let data = feed.value;

    if (link.value !== "") {
        data = "<a target='CBSH-feed' href='"+ link.value +"'>"+ feed.value +"</a>";
    }

    const request = new Request("https://api.croomssched.tech/feed", {
        method: "POST",
        body: JSON.stringify({
            "data": data
        }),
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    })

    const response = await fetch(request);
    const status = await response.json();

    if (status.data.error === "One of the following keys is missing or is empty in request body: 'name', 'link'") {
        const error = document.createElement("p");
        error.innerText = "Please enter a Feed Update.";
        document.querySelector("main").appendChild(error);
        error.classList.add("error");
        document.querySelector("button").addEventListener("click", () => {error.remove()});
    } else if (status.data.error) {
        const error = document.createElement("p");
        error.innerText = status.data.error;
        document.querySelector("main").appendChild(error);
        error.classList.add("error");
        document.querySelector("button").addEventListener("click", () => {error.remove()});
    } else {
        showSuccessMessage();
    }

    function showSuccessMessage() {
        document.querySelector("main").remove();
        const successHeader = document.createElement("h2");
        successHeader.innerText = "Your Feed Update was submitted";
        document.querySelector("header > h1").replaceWith(successHeader);
        document.querySelector("header > p").innerText = "It may take a moment for the Feed Update to be reviewed.";
        document.querySelector("button").innerText = "Add another";
        document.querySelector("button").addEventListener("click", () => {location.reload();})
    }
});