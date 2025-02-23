document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("themeToggle");
    const currentTheme = localStorage.getItem("theme") || "dark"; 

    document.documentElement.setAttribute("data-theme", currentTheme);
    themeToggle.textContent = currentTheme === "light" ? "dark" : "light";

    themeToggle.addEventListener("click", function () {
        let newTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        themeToggle.textContent = newTheme === "light" ? "dark" : "light";
    });
});
