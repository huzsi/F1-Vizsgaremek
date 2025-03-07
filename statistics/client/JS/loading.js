window.onload = function() {
    const loader = document.querySelector('.loader');
    const content = document.querySelector('.content');

    // Betöltési idő szimulálása
    setTimeout(() => {
        loader.style.display = 'none';
        content.classList.remove('hidden');

        // Utána beállítjuk az opacity-t és a transformot
        setTimeout(() => {
            content.style.opacity = 1; // Változtassuk láthatóvá
            content.style.transform = 'translateY(0)'; // Mozgassuk vissza
        }, 50); // Kis késleltetés az átmenet miatt
    }, 1000); // 2 másodpercig tart a betöltés
};




