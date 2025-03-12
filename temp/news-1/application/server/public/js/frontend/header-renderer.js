document.addEventListener('DOMContentLoaded', () => {
    const headerContainer = document.querySelector('header');
    let logoText = 'F1 News';
    let standlistHref = '#standlist';  // Kezdetben csak egy #standlist hivatkozás

    if (window.location.pathname.includes('/news/about.html') || window.location.pathname.includes('/news/auth.html')) {
        logoText = 'F1 Stats &amp; News';
    } else if (window.location.pathname.includes('/news/forum-layout.html')) {
        logoText = 'F1 Forum';
    }

    if (!window.location.pathname.includes('/news/index.html')) {
        standlistHref = ''; // Ha nem az index oldalon vagyunk, ne jelenjen meg a Standlist gomb
    }

    headerContainer.innerHTML += `
        <div class="logo">
            <h2><a href="/news/index.html">${logoText}</a></h2>
        </div>
        <nav>
            <ul>
                <li><a href="#" id="latest-btn">Latest</a></li>
                <li><a href="#" id="schedule-btn">Schedule</a></li>
                <li><a href="#" id="result-btn">Results</a></li>
                ${standlistHref ? `<li><a href="${standlistHref}">Standlist</a></li>` : ''}  <!-- Csak akkor jelenik meg, ha standlistHref nem üres -->
            </ul>
        </nav>
    `;
});
