/*document.addEventListener('DOMContentLoaded', () => { 
    const aboutBtn = document.getElementById('about-btn');

    document.getElementById('about-btn').addEventListener('click', (e) =>{
        window.location.href = "/layout.html/about";
    });

});
*/
const scheduleBtn = document.getElementById('full-schedule-btn');

if(scheduleBtn){
    scheduleBtn.addEventListener('click', () => {
        window.location.href = "http://localhost:3000/layout.html/schedule";
    });
}

const newsCreatorBtn = document.getElementById('news-creator-btn');

if (newsCreatorBtn) {
    newsCreatorBtn.addEventListener('click', function () {
        // Ellenőrizzük, hogy a news-creator.js már betöltődött-e
        if (!window.newsCreatorScript) {
            // Dinamikusan betöltjük a news-creator.js-t
            const script = document.createElement('script');
            script.src = 'http://localhost:3000/static/js/util/creator.js'; // A helyes útvonalra cseréld
            script.onload = function() {
                console.log('creator.js sikeresen betöltve.');
            };
            document.body.appendChild(script);
            
            // Hozzárendelünk egy flag-et, hogy ne töltsük be újra
            window.newsCreatorScript = true;
        } else {
            console.log('A news-creator.js már betöltődött.');
        }
    });
}