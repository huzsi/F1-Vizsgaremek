/**Hírek API kezelése. Két linkből kérdezek le 
 * index.html és további odlalak jeleníti meg 
 * -----
 * Minden adatot az oldal cache-ből töltöm be mivel limitálva van
 * az API kérések száma.
 * -----
 * Két API kerül meghívásra:
 * /news
 * /tech-news
 * -----
 * Az Index oldalon két szekció kapja az adatokat.
 * */
document.addEventListener('DOMContentLoaded', async () => {
    if (!window.location.pathname.includes('/index.html') && !window.location.pathname.includes('/regular-news') && !window.location.pathname.includes('/tech-news')) {
        return;
    }

    const regularDailyNews = document.getElementById('regular-daily-news-container');
    const techNewsContent = document.getElementById('tech-news-content');
    const newsSection = document.getElementById('news-section');

    try {
        if (window.location.pathname.includes('/index.html')) {
            await displayNews('/news/news', regularDailyNews, 12);
            await displayNews('/news/tech-news', techNewsContent, 12);

            const regularNewsBtn = document.getElementById('regular-news-btn');
            const techNewsBtn = document.getElementById('tech-news-btn');

            if (regularNewsBtn) {
                regularNewsBtn.addEventListener('click', () => {
                    window.location.href = "/news/news-layout.html/regular-news";
                });
            }
            if (techNewsBtn) {
                techNewsBtn.addEventListener('click', () => {
                    window.location.href = "/news/news-layout.html/tech-news";
                });
            }
        }

        if (window.location.pathname.includes('/regular-news')) {
            await displayNews('/news/news', newsSection);
        }

        if (window.location.pathname.includes('/tech-news')) {
            await displayNews('/news/tech-news', newsSection);
        }
    } catch (error) {
        console.error('Error fetching news:', error);
    }
});

async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch data from ${url}`);
    }
    return await response.json();
}

async function displayNews(url, container, limit = Infinity) {
    const newsData = await fetchData(url);
    let count = 0;
    newsData.forEach(article => {
        if (count < limit) {
            container.innerHTML += `
                <div class="newsDiv">
                    <a href="${article.url}" target="_newblank">
                        <h4>${article.title}</h4>
                        <p>${article.content}</p>
                    </a>
                    <p>Author: ${article.author}</p>
                </div>`;
            count++;
        }
    });
}
