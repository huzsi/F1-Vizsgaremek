/**--------------------------------------------------------------------
 * 
 * Filling dropdown menus for all html files via API.
 * Each button is placed in its own document event handler for differentiation.
 * 
 * --------------------------------------------------------------------
 * 
 * APIs used:
 *      /news/race-schedule - (GET)
 *      /news/raceResults - (GET)
 *      /news/news - (GET - From Cache)
 *      /news/tech-news - (GET - From Cache)
 * 
 * --------------------------------------------------------------------
 * 
 * Data is loaded only upon button click to avoid unnecessary data fetching.
 * 
 * Note: Always check if the respective button has been created, as the event-handled buttons are loaded dynamically!
 * 
 * In each HTML file, link header.js & dropdown.js files first, followed by dropdown-api-manager.js!
 * 
 * --------------------------------------------------------------------
 * 
 * The code includes functions for:
 *      - Displaying the race schedule in the dropdown when the 'Schedule' button is clicked.
 *      - Displaying the race results in the dropdown when the 'Result' button is clicked.
 *      - Loading the latest news articles in the dropdown via the 'Latest' button.
 *      - Handling the dropdown for tech news.
 * 
 * The fetchData function is used throughout to load data from the APIs.
 * 
 * The fetchAndDisplayNews function handles the fetching and displaying of news data based on the selected category (e.g., latest news or tech news).
 * 
 * --------------------------------------------------------------------
 * 
 * The async functions are responsible for fetching and displaying data, ensuring that the dropdown menus are populated dynamically.
 * Do not modify them under any circumstances!
 * 
 * --------------------------------------------------------------------
 * Created by: Krisztián Ináncsi
 * Last updated: 2025-01-31
 */
document.addEventListener('DOMContentLoaded', () => {
    const scheduleBtn = document.getElementById('schedule-btn');
    if (!scheduleBtn) {
        return;
    }

    /** Schedule dropdown gomb */
    scheduleBtn.addEventListener('click', () => {
        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const container = document.getElementById('racenames-container');
        fetch('/news/race-schedule')
            .then(response => response.json())
            .then(data => {
                const scheduleContent = document.getElementById('schedule-content');
                const today = new Date();

                const upcomingRaces = Array.isArray(data) ? data : [data];
                const filteredRaces = upcomingRaces
                    .filter(race => new Date(race.event1) >= today)
                    .sort((a, b) => new Date(a.event1) - new Date(b.event1))
                    .slice(0, 3);

                filteredRaces.forEach(race => {
                    const event1Date = new Date(race.event1);
                    const event5Date = new Date(race.event5);
                    const formattedDate = `${monthNames[event1Date.getMonth()]} ${event1Date.getDate()} - ${event5Date.getDate()}`;

                    scheduleContent.innerHTML += `
                        <div>
                            <a href="/news/tracks.html?id=${race.id}&trackName=${race.trackName}&fullName=${race.fullName}" id="${race.id}">
                                <fieldset>
                                    <legend>
                                        <p>Round ${race.raceNumber}</p>
                                    </legend>
                                    <img class="flag" src="/static/img/flags/${race.id}.svg" alt="${race.name}">
                                    <h4>${race.name}</h4>
                                    <p>${formattedDate}</p>
                                </fieldset>
                            </a>
                        </div>
                    `;
                });
            })
            .catch(error => console.error('Error fetching race schedule:', error));
    });

    const resultBtn = document.getElementById('result-btn');

    if (!resultBtn) {
        return;
    }

    /** Result dropdown gomb */
    resultBtn.addEventListener('click', () => {
        fetch('/news/raceResults')
            .then(response => response.json())
            .then(resultData => {
                const resultContent = document.getElementById('result-content');

                resultData = Array.isArray(resultData) ? resultData : [resultData];

                if (!resultData || resultData.length === 0) {
                    return;
                } else if (resultData.length === 0) {
                    resultContent.innerHTML = `
                        <h3>Season is not started yet. Come back when first race is finished.</h3>
                    `;
                } else {
                    resultData.forEach((results, index) => {
                        if (index !== 3) {
                            resultContent.insertAdjacentHTML('beforeend', `
                                <div>
                                    <a href="/news/raceresult.html?id=${results.raceNumber}">
                                        <fieldset>
                                            <legend>Round ${results.raceNumber}</legend>
                                            <img class="flag" src="/static/img/flags/${results.raceId}.svg" alt="${results.name}">
                                            <h4>${results.raceName}</h4>
                                        </fieldset>
                                    </a>
                                </div>
                            `);
                        }
                    });
                }
            })
            .catch(error => console.error('Error fetching season race results:', error));
    });
});

document.addEventListener('DOMContentLoaded', async () => {
    const latestBtn = document.getElementById('latest-btn');

    if (latestBtn) {
        latestBtn.addEventListener('click', () => {
            const dpTechNewsBtn = document.getElementById('dropdown-tech-news-btn');
            const dpLatestBtn = document.getElementById('dropdown-latest-btn');

            fetchAndDisplayNews('/news/news', 'news-content', 5);

            if (dpLatestBtn) {
                dpLatestBtn.addEventListener('click', () => {
                    fetchAndDisplayNews('/news/news', 'news-content', 5);
                });
            }

            if (dpTechNewsBtn) {
                dpTechNewsBtn.addEventListener('click', () => {
                    navBtnUsed = true;
                    fetchAndDisplayNews('/news/tech-news', 'news-content', 5);
                });
            }
        });
    }
});

async function fetchAndDisplayNews(apiEndpoint, containerId, articleCount) {
    try {
        const newsData = await fetchData(apiEndpoint);
        const newsContent = document.getElementById(containerId);
        newsContent.innerHTML = ''; // Clear previous content

        const articles = Array.isArray(newsData) ? newsData : [newsData];

        articles.slice(0, articleCount).forEach(article => {
            newsContent.innerHTML += `
                <a href="${article.url}" target="_newblank">
                    <h5>${article.title}</h5>
                </a>
            `;
        });
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch data from ${url}`);
    }
    return await response.json();
}