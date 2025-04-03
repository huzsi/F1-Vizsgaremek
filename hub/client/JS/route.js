document.addEventListener("DOMContentLoaded", function () {
    const redirectButton = document.getElementById("newsButton");
    
    if (redirectButton) {
        redirectButton.addEventListener("click", function () {
            window.location.href = "https://news.f1statsandnews.com/news/index.html";
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const redirectButton = document.getElementById("statisticsButton");
    
    if (redirectButton) {
        redirectButton.addEventListener("click", function () {
            window.location.href = "https://https://statistics.f1statsandnews.com/";
        });
    }
});