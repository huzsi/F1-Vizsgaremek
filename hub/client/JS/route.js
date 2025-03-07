document.addEventListener("DOMContentLoaded", function () {
    const redirectButton = document.getElementById("newsButton");
    
    if (redirectButton) {
        redirectButton.addEventListener("click", function () {
            window.location.href = "http://localhost:3002/news/index.html";
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const redirectButton = document.getElementById("statisticsButton");
    
    if (redirectButton) {
        redirectButton.addEventListener("click", function () {
            window.location.href = "http://localhost:3001";
        });
    }
});