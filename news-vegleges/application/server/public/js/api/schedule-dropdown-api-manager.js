// Fetches race schedule data and processes it
document.addEventListener("DOMContentLoaded", function () { 
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
