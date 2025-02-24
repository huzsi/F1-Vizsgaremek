/**Minden dropdown API kezelése itt található! */
document.addEventListener('DOMContentLoaded', () => {
    const scheduleBtn = document.getElementById('schedule-btn');


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
//Latest btn dropdown content
document.addEventListener('DOMContentLoaded', () => {
    const latestBtn = document.getElementById('latest-btn');
    if(!latestBtn){
        return;
    }
    latestBtn.addEventListener('click', () => {
        
        fetch('/news/news')
            .then(response => response.json())
            .then(newsData => {
                
                const newsContent = document.getElementById('news-content');
                let count = 0;
                newsData.forEach(article => {
                    if (count < 5) {
                        newsContent.innerHTML += `
                                                    <h5><a href="${article.url}" target="_newblank">${article.title} </a></h5>         
                                                    `;
                    count++;
                    }
                }); //foreach end
                const regularNewsBtn = document.getElementById('regular-news-btn');
                const techNewsBtn = document.getElementById('tech-news-btn');

                if(regularNewsBtn){
                    regularNewsBtn.addEventListener('click', () =>{
                        window.location.href = "/news/news-layout.html/regular-news"
                    });
                }
                if(techNewsBtn){
                    techNewsBtn.addEventListener('click', () =>{
                        window.location.href = "/news-layout.html/tech-news"
                    });
                }   
            })
            .catch(error => console.log(error));
        });
});