/**Minden dropdown API kezelése itt található! */

document.addEventListener('DOMContentLoaded', () => {
    const scheduleBtn = document.getElementById('schedule-btn');

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
                if (!resultData || resultData.length === 0) {
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
    // Event listeners for buttons
    const techNewsBtn = document.getElementById('tech-news-btn');
    const latestBtn = document.getElementById('latest-btn');

    if (latestBtn) {
        latestBtn.addEventListener('click', () => {
            fetchAndDisplayNews('/news/news', 'news-content', 5);
        });
    }

    if (techNewsBtn) {
        techNewsBtn.addEventListener('click', () => {
            console.log("megnyomva")
            fetchAndDisplayNews('/news/tech-news', 'news-content', 5);
        });
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

/**
 * 
 * 
 * <a href="${article.url}" target="_newblank">
                                    <h5>${article.title}</h5>
                                </a>
 */