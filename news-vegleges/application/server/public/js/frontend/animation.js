/**
 * Teszt kód:
 * Működni csak nagy képernyőn fog
 * hozzá be kell állítani
 *
 * Jelenleg a kód nem használja ezt, így a css fájlokat visszaállítom.
 * A beállítások amiket kiszedtem:
 * 
 * main {
        margin-top: 100vh;
        position: relative;
        z-index: 1;
        background-color: var(--background-color);
    }
    ---
    .header-container {
        width: 100%;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        position: fixed; 
        top: 0;
        left: 0;
        right: 0;
        z-index: 0;
        height: 95vh;
    }
    --Később Javítani fogom--   
 */
document.addEventListener("DOMContentLoaded", function() {
    
    const totalHeight = mainContent.height + footer.height;
    document.documentElement.style.height = `${totalHeight}px`;
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        const mainContent = document.querySelector('main');
        const footer = document.querySelector('footer');
        
     

        // Az oldal teljes magasságának beállítása, hogy pontosan a footer végéig lehessen görgetni
        
        // Max görgetési távolság (footer alá ne menjen)
        const maxScroll = mainContent.offsetHeight + footer.offsetHeight;

        
        mainContent.style.transform = `translateY(-${scrollY}px)`;
        footer.style.transform = `translateY(-${scrollY}px)`;
        
    });
});
