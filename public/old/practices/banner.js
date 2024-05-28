const bannerElement = document.createElement("div");
bannerElement.id = "ad-banner";
bannerElement.innerHTML = /*html*/`<a href="/" target="_blank"><img src="/favicon.ico" style="width: 17px; height: 17px;"> Made with CroomsSched</a>` +
                          /*html*/`<style>#ad-banner {background-color: #eeeeee; width: 100vw; padding: 10px; position: fixed; bottom: 0px; left: 0px; user-select: none; font-family: SegUI, sans-serif;} #ad-banner a {text-decoration: none; color: black;} @font-face {font-family: SegUI; src: url("/SegUIVar.woff2");}</style>`;
document.body.appendChild(bannerElement);