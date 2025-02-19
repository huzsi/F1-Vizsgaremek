document.addEventListener('DOMContentLoaded', () => {
    // Ellenőrizzük, hogy a jelenlegi URL tartalmazza-e a "/profile" részt
    if (!window.location.pathname.includes('/about')) {
        return; // Ha nem a about oldal, akkor kilépünk a scriptből
    }
    

    const mainContent = document.getElementById('main-content');

    mainContent.innerHTML = `
        <section class="about-section">
            <dib>
                <h3>Contact</h3>
                <p>-</p>
            </div>
            <div>
                <h3>Licence</h3>
                <p>-</p>
            </div>
            <div>
                <h3>Github</h3>
                <p>-</p>
            </div>
            <div>
                <h3>Links</h3>
            </div>
        </section>
    `;

});