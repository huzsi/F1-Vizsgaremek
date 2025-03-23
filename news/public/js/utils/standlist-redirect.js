document.addEventListener('DOMContentLoaded', () => {
    const standlistLink = document.querySelector('a[href$="#standlist"]');
    
    if (standlistLink) {
        standlistLink.addEventListener('click', () => {
            sessionStorage.setItem('redirect', 'true');
        });
    }

    if (sessionStorage.getItem('redirect') === 'true') {
        sessionStorage.removeItem('redirect');
        
        // Ellenőrizd, hogy az URL tartalmazza a "#standlist" részt
        if (window.location.hash === '#standlist') {
            document.getElementById('standlist').scrollIntoView({ behavior: 'smooth' }); // Gördülj a standlist részhez
            window.location.hash = '';
        }
    }
});
