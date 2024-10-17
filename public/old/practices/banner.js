const bannerElement = document.createElement("div");
bannerElement.id = "ad-banner";
bannerElement.innerHTML = `<a href="/" target="_blank"><img src="/favicon.ico" style="width: 17px; height: 17px;"> Made by Crooms Bell Schedule</a>` +
                          `<style>#ad-banner {background-color: #eeeeee; width: 100vw; padding: 10px; position: fixed; bottom: 0; left: 0; user-select: none; font-family: SegUI, sans-serif;} #ad-banner a {text-decoration: none; color: black;} @font-face {font-family: SegUI; src: url("https://cdn.croomssched.tech/fonts/SegUIVar.woff2");}</style>`;
document.body.appendChild(bannerElement);