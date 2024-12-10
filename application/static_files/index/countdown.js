// Funkció, amely kiszámolja és frissíti a hátralévő időt
function updateCountdown() {
    // A cél dátuma (target-time id alapján)
    const targetDate = new Date(document.getElementById("target-time").innerText);

    // Aktuális dátum
    const now = new Date();

    // Különbség a két dátum között (milliszekundumban)
    const timeDifference = targetDate - now;

    // Ha a cél dátum elérkezett vagy már múlt
    if (timeDifference <= 0) {
        document.getElementById("time").innerText = "00:00:00:00";
        return;
    }

    // Számítások: napok, órák, percek, másodpercek
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    // A visszaszámláló frissítése
    document.getElementById("time").innerText = `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// A céldátum brit formátumban (dd/mm/yyyy) megjelenítése egyszer
const targetElement = document.getElementById("target-time");
const targetDate = new Date(targetElement.innerText);
targetElement.innerText = targetDate.toLocaleDateString("en-US");

// Visszaszámláló frissítése minden másodpercben
setInterval(updateCountdown, 1000);

// Inicializálás
updateCountdown();