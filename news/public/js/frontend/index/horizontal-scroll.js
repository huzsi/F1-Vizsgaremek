document.addEventListener('DOMContentLoaded', () => {
    const scrollmenu = document.querySelector('.scrollmenu .inner');
    
    if (scrollmenu) {
        let isDown = false;
        let startX;
        let scrollLeft;
        let clickTimeout;

        scrollmenu.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - scrollmenu.offsetLeft;
            scrollLeft = scrollmenu.scrollLeft;
            clearTimeout(clickTimeout);
            e.preventDefault(); // Megakadályozza a szöveg kijelölését
        });
        
        scrollmenu.addEventListener('mouseleave', () => {
            isDown = false;

        });
        
        scrollmenu.addEventListener('mouseup', () => {
            isDown = false;
        });
        
        scrollmenu.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault(); // Megakadályozza a szöveg kijelölését
            const x = e.pageX - scrollmenu.offsetLeft;
            const walk = (x - startX) * 3; // A görgetés sebességének beállítása
            scrollmenu.scrollLeft = scrollLeft - walk;
        });
        
        // Az <a> tagekre is hozzáadunk egy eseménykezelőt, hogy megakadályozzuk a link kimásolását
        const links = scrollmenu.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('mousedown', (e) => {
                e.preventDefault(); // Megakadályozza a szöveg kijelölését
                clickTimeout = setTimeout(() => {
                    isDown = false; // Engedélyezi a kattintást
                }, 2000); // 1 másodperc késleltetés
            });
            link.addEventListener('click', (e) => {
                if (isDown) {
                    e.preventDefault(); // Ha a görgetés történik, megakadályozzuk a link követését
                }
            });
        });
    } else {
        console.error('Error: .scrollmenu .inner element not found.');
    }
});
