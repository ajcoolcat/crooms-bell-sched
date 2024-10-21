document.querySelector("#feed-form > footer > button").addEventListener("click", async () => {
    const feed = document.getElementById("feed-update");

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