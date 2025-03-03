/**--------------------------------------------------------------------
 * 
 * Filling dropdown menus for all html files via API.
 * Each button is placed in its own document event handler for differentiation.
 * 
 * --------------------------------------------------------------------
 * 
 * APIs used:
 *      /race-schedule - (GET)
 *      /raceResults - (GET)
 *      /news - (GET - From Cache)
 *      /tech-news - (GET - From Cache)
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
 * The async functions at the end of the code are responsible for loading News API data from the Cache.
 * Do not modify them under any circumstances!
 * 
 * --------------------------------------------------------------------
 * Created by: Ináncsi Krisztián
 * Last updated: 2025-02-28.
 */

document.addEventListener('DOMContentLoaded', () => {
    const scheduleBtn = document.getElementById('schedule-btn');
    if(!scheduleBtn){
        return;
    }
    /**Schedule dropdown gomb */
    scheduleBtn.addEventListener('click', () => {
        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const container = document.getElementById('racenames-container');
        fetch('/news/race-schedule')
            .then(response => response.json())
        .then(data => {
            const scheduleContent = document.getElementById('schedule-content');
            const today = new Date();

            const upcomingRaces = data
                .filter(race => new Date(race.event1) >= today)
                .sort((a, b) => new Date(a.event1) - new Date(b.event1))
                .slice(0, 3);

            const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

            upcomingRaces.forEach(race => {
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
                                <img src="/static/img/flags/${race.id}.svg" alt="${race.name}">
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

    if(!resultBtn){
        return
    }
    /**Result dropdown gomb */
    resultBtn.addEventListener('click', () => {
        fetch('/news/raceResults')
            .then(response => response.json())
            .then(resultData => {

                if (!Array.isArray(resultData)) {
                
                    resultData = [resultData]; // Egyedi objektumot tömbbé alakítjuk, hogy tudjuk vizsgálni a hosszát.
                }
                
                const resultContent = document.getElementById('result-content');
                if (!resultData || resultData.length === 0) { //A vagy 0-ás feltételt akkor törlöm, ha a tesztadatokat töröltem!
                    return;
                } 
                else if (resultData.length === 1) { //Jelenleg 1-re rakom, mert tesztadat miatt nem valós adatot mutatna. Későbbiekben változni fog!
                    resultContent.innerHTML = `
                       <h3>Season is not started yet. Come back when first race is finished.</h3>
                    `;
                }
                else{
                    raceTable.innerHTML = `
                        <div class="race-div">
                            <a href="#">
                                <h4>${resultData.raceName}</h4>
                            </a>
                        </div>
                    `;
        
                resultData.forEach(results => {
                    raceTable.insertAdjacentHTML('beforeend', `
                         <div class="race-div">
                            <a href="#">
                                <h4>${resultData.raceName}</h4>
                            </a>
                        </div>
                    `);
                });
            }
        })
        .catch(error => console.error('Error fetching season race results:', error));
    });
});
document.addEventListener('DOMContentLoaded', async() => {
    const latestBtn = document.getElementById('latest-btn');
    
    // Event listeners for buttons
    if(latestBtn){
        latestBtn.addEventListener('click', () => {

            const dpTechNewsBtn = document.getElementById('dropdown-tech-news-btn');
            const dpLatestBtn = document.getElementById('dropdown-latest-btn');
       
            fetchAndDisplayNews('/news/news', 'news-content', 5); /**Ezt a sort ne töröld ki!
                                                                    Nem feleslegesen van itt, hanem így érem el, hogy minden
                                                                    dropdown megjelenítés során adatokkal legyen feltöltve a
                                                                    menüsáv!
                                                                     */
            
            if (dpLatestBtn) {
                dpLatestBtn.addEventListener('click', () => {
                        
                    fetchAndDisplayNews('/news/news', 'news-content', 5);
                });
            }
                
            if (dpTechNewsBtn) {
                dpTechNewsBtn.addEventListener('click', () => {
                    navBtnUsed = true;
                    console.log("megnyomva");
                    fetchAndDisplayNews('/news/tech-news', 'news-content', 5);
                });
            }    
        })
    }
});

async function fetchAndDisplayNews(apiEndpoint, containerId, articleCount) {
    try {
        const newsData = await fetchData(apiEndpoint);
        const newsContent = document.getElementById(containerId);
        newsContent.innerHTML = ''; // Clear previous content

        newsData.slice(0, articleCount).forEach(article => {
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