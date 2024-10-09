const switchTab = (tabContainer, tab) => {
    for (let i = 0; i < tabContainer.children.length; i++) {
        tabContainer.children.item(i).classList.remove("active");
    }

    tabContainer.parentElement.querySelector(".container .active").classList.remove("active");

    tab.classList.add("active");
    tabContainer.parentElement.querySelector(".container #" + tab.dataset.launch).classList.add("active");
}

const setTabListener = (tabContainer) => {
    for (let i = 0; i < tabContainer.children.length; i++) {
        tabContainer.children.item(i).addEventListener("click", () => {
            switchTab(tabContainer, tabContainer.children.item(i));
        });
    }
}

setTabListener(document.querySelector("#quickbits-and-feed > div.tabs"));