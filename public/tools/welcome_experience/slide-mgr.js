let slideMgr = {
    slide: 1,
    nextSlide: function() {
        slideMgr.slide++;
        window.scrollBy(0, screen.availHeight);
    },
    previousSlide: function() {
        slideMgr.slide--;
        window.scrollBy(0, (screen.availHeight) * -1);
    },
    activateBars: function() {
        document.querySelector("header").classList.add("active");
        document.querySelector("footer").classList.add("active");
    },
    deleteBars: function() {
        document.querySelector("header").remove();
        document.querySelector("footer").remove();
        clearInterval(intervals.intA);
        clearInterval(intervals.intB);
        clearInterval(intervals.intC);
    }
}