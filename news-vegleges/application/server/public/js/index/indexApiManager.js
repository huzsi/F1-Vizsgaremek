document.addEventListener('DOMContentLoaded', () => {
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const container = document.getElementById('racenames-container');
    /*event API*/
    fetch('/racenames')
        .then(response => response.json())
        .then(raceData => {
            /*Dropdown API */
            fetch('/race-schedule')
                .then(response => response.json())
                .then(scheduleData => {
                    let nextRace = scheduleData.find(schedule => new Date(schedule.event1) > new Date());

                    scheduleData.forEach(schedule => {
                        const event1Date = new Date(schedule.event1);
                        const correspondingRace = raceData.find(race => race.id === schedule.id);
                        const day = event1Date.getDate();
                        const month = monthNames[event1Date.getMonth()];

                        container.innerHTML += `
                            <a href="tracks.html?id=${correspondingRace.id}&trackName=${correspondingRace.trackName}&fullName=${correspondingRace.fullName}" id="${correspondingRace.id}">
                                <img src="/static/img/flags/${correspondingRace.id}.svg" alt="${correspondingRace.name}">
                                <br>
                                ${correspondingRace.name}
                                <hr>
                                <p>
                                    <span>${day}</span><br>
                                    ${month}
                                </p>
                            </a>
                        `;
                    });

                    if (nextRace) {
                        const event1Date = new Date(nextRace.event1);
                        const day = event1Date.getDate();
                        const month = monthNames[event1Date.getMonth()];
                        const raceNameHeader = document.getElementById('RaceName');
                        const timerParagraph = document.getElementById('timerParagraph');

                        raceNameHeader.textContent = nextRace.name;

                        const events = nextRace.type === 1 ? [
                            { event: 'FP1', date: nextRace.event1 },
                            { event: 'FP2', date: nextRace.event2 },
                            { event: 'FP3', date: nextRace.event3 },
                            { event: 'Qualify', date: nextRace.event4 },
                            { event: 'Race', date: nextRace.event5 }
                        ] : [
                            { event: 'FP1', date: nextRace.event1 },
                            { event: 'Sprint Qualify', date: nextRace.event2 },
                            { event: 'Sprint', date: nextRace.event3 },
                            { event: 'Qualify', date: nextRace.event4 },
                            { event: 'Race', date: nextRace.event5 }
                        ];

                        const targetTable = nextRace.type === 1 ? document.getElementById('regularEvent') : document.getElementById('sprintEvent');

                        if (targetTable) {
                            targetTable.innerHTML = `
                                <table class="event-Table">
                                    <tr>
                                        <th>Event</th>

                                        <th colspan="2">Date</th>
                                    </tr>
                                    ${events.map(event => {
                                        const eventDate = new Date(event.date);
                                        const day = eventDate.getDate();
                                        const month = monthNames[eventDate.getMonth()];
                                        const time = eventDate.toTimeString().slice(0, 5);

                                        return `
                                            <tr>
                                                <td>${event.event}</td>
                                                <td>${day} <br> ${month}</td>
                                                <td>${time}</td>
                                            </tr>
                                        `;
                                    }).join('')}
                                </table>
                            `;
                        }

                        updateCountdown(timerParagraph, new Date(nextRace.event1));
                        setInterval(() => updateCountdown(timerParagraph, new Date(nextRace.event1)), 60000);
                    }
                })
                .catch(error => console.error('Error fetching race schedule:', error));
        })
        .catch(error => console.error('Error fetching racenames:', error));
    /*Scroll-menu API*/
    fetch('/race-schedule')
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
                        <a href="tracks.html?id=${race.id}&trackName=${race.trackName}&fullName=${race.fullName}" id="${race.id}">
                            <fieldset>
                                <legend>
                                    <p>Round ${race.raceNumber}</p>
                                </legend>
                                <img src="static/img/flags/${race.id}.svg" alt="${race.name}">
                                <h4>${race.name}</h4>
                                <p>${formattedDate}</p>
                            </fieldset>
                        </a>
                    </div>
                `;
            });
        })
        .catch(error => console.error('Error fetching race schedule:', error));
    /*Standlist API-s*/ 
    fetch('/driverStandlist')
        .then(response => response.json())
        .then(data => {
            const driverTable = document.getElementById('driverTable');
            
            driverTable.innerHTML += `
                <tr>
                    <th colspan="3">Driver Standlist</th>
                </tr>
            `;

            data.forEach((driver, index) => {
                driverTable.innerHTML += `
                    <tr>
                        <td class="${driver.constructor}">${index + 1}</td>
                        <td>${driver.driverName}</td>
                        <td class="${driver.constructor}">300</td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error('Error fetching driver standlist:', error));

    fetch('/constructorStandlist')
        .then(response => response.json())
        .then(data => {
            const constructorTable = document.getElementById('constructorTable');
            
            constructorTable.innerHTML += `
                <tr>
                    <th colspan="3">Constructor Standlist</th>
                </tr>
            `;
            data.forEach((constructor, index) => {
                constructorTable.innerHTML += `
                    <tr>
                        <td class="${constructor.constructor}">${index + 1}</td>
                        <td>${constructor.constructorName}</td>
                        <td class="${constructor.constructor}">500</td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error('Error fetching constructor standlist:', error));
});

/*Methods*/
function updateCountdown(element, eventDate) {
    const now = new Date();
    const distance = eventDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    element.textContent = `${days} DAY | ${hours} HRS | ${minutes} MIN`;
}
