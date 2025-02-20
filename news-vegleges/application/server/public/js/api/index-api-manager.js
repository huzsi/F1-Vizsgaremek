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
});
document.addEventListener('DOMContentLoaded', () => {
    // Standlist API-s
    fetch('/driverStandlist')
        .then(response => response.json())
        .then(driverData => {
            const driverPoints = {};
            driverData.forEach(driver => {
                driverPoints[driver.driverId] = 0; // Kezdeti pontszám
            });

            // Eredmények lekérése és pontszámok frissítése
            fetch('/seasonRaceResults')
                .then(response => response.json())
                .then(results => {
                    console.log('Season Race Results:', results); // Naplózzuk a results tartalmát
                    if (!Array.isArray(results)) {
                        console.error('Unexpected results format:', results);
                        results = [results]; // Egyedi objektumot tömbbé alakítjuk
                    }

                    results.forEach(result => {
                        const points = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
                        for (let i = 1; i <= 20; i++) {
                            const driverId = result[`P${i}`];
                            if (driverId && driverPoints[driverId] !== undefined && points[i - 1] !== undefined) {
                                driverPoints[driverId] += points[i - 1];
                            }
                        }
                    });

                    // Pilóták rendezése a pontszámok alapján
                    driverData.sort((a, b) => driverPoints[b.driverId] - driverPoints[a.driverId]);

                    // Pilóta tábla frissítése
                    const driverTable = document.getElementById('driverTable');
                    driverTable.innerHTML = `
                        <tr>
                            <th colspan="3">Driver Standlist</th>
                        </tr>
                    `;

                    driverData.forEach((driver, index) => {
                        driverTable.innerHTML += `
                            <tr>
                                <td class="${driver.constructor}">${index + 1}</td>
                                <td>${driver.driverName}</td>
                                <td class="${driver.constructor}">${driverPoints[driver.driverId]}</td>
                            </tr>
                        `;
                    });
                })
                .catch(error => console.error('Error fetching season race results:', error));
        })
        .catch(error => console.error('Error fetching driver standlist:', error));

    fetch('/constructorStandlist')
        .then(response => response.json())
        .then(constructorData => {
            const constructorPoints = {};

            constructorData.forEach(constructor => {
                constructorPoints[constructor.constructor] = 0; // Kezdeti pontszám
            });

            // Eredmények lekérése és pontszámok frissítése
            fetch('/seasonRaceResults')
                .then(response => response.json())
                .then(results => {
                    console.log('Season Race Results:', results); // Naplózzuk a results tartalmát
                    if (!Array.isArray(results)) {
                        console.error('Unexpected results format:', results);
                        results = [results]; // Egyedi objektumot tömbbé alakítjuk
                    }

                    const driverConstructorMap = {};

                    // Pilóta és konstruktor párosítás
                    fetch('/driverStandlist')
                        .then(response => response.json())
                        .then(driverData => {
                            driverData.forEach(driver => {
                                driverConstructorMap[driver.driverId] = driver.constructor;
                            });

                            results.forEach(result => {
                                const points = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
                                for (let i = 1; i <= 20; i++) {
                                    const driverId = result[`P${i}`];
                                    if (driverId && driverConstructorMap[driverId] !== undefined && points[i - 1] !== undefined) {
                                        constructorPoints[driverConstructorMap[driverId]] += points[i - 1];
                                    }
                                }
                            });

                            // Konstruktorok rendezése a pontszámok alapján
                            constructorData.sort((a, b) => constructorPoints[b.constructor] - constructorPoints[a.constructor]);

                            // Konstruktor tábla frissítése
                            const constructorTable = document.getElementById('constructorTable');
                            constructorTable.innerHTML = `
                                <tr>
                                    <th colspan="3">Constructor Standlist</th>
                                </tr>
                            `;

                            constructorData.forEach((constructor, index) => {
                                constructorTable.innerHTML += `
                                    <tr>
                                        <td class="${constructor.constructor}">${index + 1}</td>
                                        <td>${constructor.constructorName}</td>
                                        <td class="${constructor.constructor}">${constructorPoints[constructor.constructor]}</td>
                                    </tr>
                                `;
                            });
                        })
                        .catch(error => console.error('Error fetching driver stand list:', error));
                })
                .catch(error => console.error('Error fetching season race results:', error));
        })
        .catch(error => console.error('Error fetching constructor standlist:', error));
});

/*Methods*/
function updateCountdown(element, eventDate) {
    const now = new Date();
    const distance = eventDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60)) / (1000 * 60));

    element.textContent = `${days} DAY | ${hours} HRS | ${minutes} MIN`;
}
