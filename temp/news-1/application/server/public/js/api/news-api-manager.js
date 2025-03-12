/**--------------------------------------------------------------------
 * 
 * News API Management: index.html - news-layout.html
 * API data is fetched during server.js startup
 * Subsequently, a new request is made every hour.
 * 
 * --------------------------------------------------------------------
 * 
 * APIs used on the site:
 *      /news (GET - loaded from Cache)
 *      /tech-news (GET - loaded from Cache)
 * 
 * --------------------------------------------------------------------
 *  
 * The FetchData async function below ensures that data is loaded from the Cache,
 * so that users do not make requests each time they access the page.
 * 
 * --------------------------------------------------------------------
 * 
 * APIs are fetched from newsApi.org. All data is their property!
 * Since this file populates the news-layout.html files, always check
 * what is in the page link!
 * 
 * Currently, users are redirected to the original site to read the full articles!
 * 
 * --------------------------------------------------------------------
 * 
 * Upcoming Updates:
 *      - News will be displayed on a unified page after clicking the Read More button (news-layout.html)
 *      - Display full article content on our site.
 *      
 * --------------------------------------------------------------------
 * Created by: Krisztián Bartók & Krisztián Ináncsi
 * Last Updated: 2025-03-01
 */

document.addEventListener('DOMContentLoaded', async () => {
    if (!window.location.pathname.includes('/index.html') && !window.location.pathname.includes('/regular-news') && !window.location.pathname.includes('/tech-news')) {
        return;
    }

    const dailyNewsContainer = document.getElementById('daily-news-container');
    const techNewsContainer = document.getElementById('tech-news-container');
    const newsSection = document.getElementById('news-section');

    try {
        if (window.location.pathname.includes('/index.html')) {
            await displayNews('/news/news', dailyNewsContainer, 12);
            await displayNews('/news/tech-news', techNewsContainer, 12);

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
                        <p>${article.description}</p>
                    </a>
                    <p>Author: ${article.author}</p>
                </div>`;
            count++;
        }
    });
}
