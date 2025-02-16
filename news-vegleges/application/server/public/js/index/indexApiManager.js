document.addEventListener('DOMContentLoaded', () => {
    fetch('/racenames')
        .then(response => response.json())
        .then(raceData => {
            const container = document.getElementById('racenames-container');
            const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

            fetch('/race-schedule')
                .then(response => response.json())
                .then(scheduleData => {
                    let nextRace = null;

                    // Feldolgozás és a legközelebbi futam kiválasztása
                    scheduleData.forEach(schedule => {
                        const event1Date = new Date(schedule.event1);
                        if (!nextRace || (event1Date > new Date() && event1Date < new Date(nextRace.event1))) {
                            nextRace = schedule;
                        }

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

                        const correspondingRace = raceData.find(race => race.id === nextRace.id);

                        // Event konténer feltöltése
                        const eventContainer = document.querySelector('.event-container .event');
                        const regularEventTable = document.getElementById('regularEvent');
                        const sprintEventTable = document.getElementById('sprintEvent');
                        const raceNameHeader = document.getElementById('RaceName');
                        const timerParagraph = document.getElementById('timerParagraph');

                        raceNameHeader.textContent = nextRace.name;

                        const events = (nextRace.type === 1) ? [
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

                        const targetTable = (nextRace.type === 1) ? regularEventTable : (nextRace.type === 2) ? sprintEventTable : null;

                        if (targetTable) {
                            targetTable.innerHTML = `
                                <table>
                                    <tr>
                                        <th>Event</th>
                                        <th colspan="2">Date</th>
                                    </tr>
                                    ${events.map(event => {
                                        const eventDate = new Date(event.date);
                                        const day = eventDate.getDate();
                                        const month = monthNames[eventDate.getMonth()];
                                        const time = eventDate.toTimeString().slice(0, 5);  // HH:MM formátum

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

                        // Visszaszámláló beállítása
                        updateCountdown(timerParagraph, new Date(nextRace.event1));
                        setInterval(() => updateCountdown(timerParagraph, new Date(nextRace.event1)), 60000);  // Frissítés minden percben
                    }
                })
                .catch(error => console.error('Error fetching race schedule:', error));
        })
        .catch(error => console.error('Error fetching racenames:', error));
});

function updateCountdown(element, eventDate) {
    const now = new Date();
    const distance = eventDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    element.textContent = `${days} DAY | ${hours} HRS | ${minutes} MIN`;
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('/race-schedule')
        .then(response => response.json())
        .then(data => {
            const scheduleContent = document.getElementById('schedule-content');
            
            // Szűrés a mai dátumhoz legközelebbi futamokra
            const today = new Date();
            const upcomingRaces = data
                .filter(race => new Date(race.event1) >= today)
                .sort((a, b) => new Date(a.event1) - new Date(b.event1))
                .slice(0, 3);

            upcomingRaces.forEach(race => {
                const raceDiv = document.createElement('div');

                const raceElement = document.createElement('a');
                raceElement.href = `tracks.html?id=${race.id}&trackName=${race.trackName}&fullName=${race.fullName}`;
                
                raceElement.addEventListener('click', (event) => {
                    event.preventDefault();
                    fetch(`/trackinfo?id=${race.id}`)
                        .then(response => response.json())
                        .then(trackData => {
                            console.log(trackData);
                            window.location.href = `tracks.html?id=${race.id}&trackName=${race.trackName}&fullName=${race.fullName}`;
                        })
                        .catch(error => console.error('Error fetching data:', error));
                });
                
                const fieldset = document.createElement('fieldset');
                
                const legend = document.createElement('legend');
                const legendText = document.createElement('p');
                legendText.textContent = `Round ${race.raceNumber}`;
                legend.appendChild(legendText);
                
                const img = document.createElement('img');
                img.src = `static/img/flags/${race.id}.svg`;
                img.alt = race.name;
                
                const h4 = document.createElement('h4');
                h4.textContent = race.name;
                
                const p = document.createElement('p');
                const event1Date = new Date(race.event1);
                const event5Date = new Date(race.event5);
                const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
                const formattedDate = `${monthNames[event1Date.getMonth()]} ${event1Date.getDate()} - ${event5Date.getDate()}`;
                p.textContent = formattedDate;
                
                fieldset.appendChild(legend);
                fieldset.appendChild(img);
                fieldset.appendChild(h4);
                fieldset.appendChild(p);
                
                raceElement.appendChild(fieldset);
                raceDiv.appendChild(raceElement);
                scheduleContent.appendChild(raceDiv);
            });
        })
        .catch(error => console.error('Error fetching race schedule:', error));
});
document.addEventListener('DOMContentLoaded', () => {
    fetch('/standlist')
        .then(response => response.json())
        .then(standlistData => {
            const driverTable = document.getElementById('driverTable');
            const constructorTable = document.getElementById('constructorTable');

            const constructorClasses = {
                1: 'McLaren',
                2: 'Ferrari',
                3: 'Red Bull Racing',
                4: 'Mercedes',
                5: 'Aston Martin',
                6: 'Alpine',
                7: 'Racing Bulls',
                8: 'Haas',
                9: 'Williams',
                10: 'Kick Sauber'
            };

            const addedConstructors = new Set(); // A már hozzáadott konstruktorok nyilvántartása

            // Tábla címsor hozzáadása
            driverTable.innerHTML = `<tr><th colspan="3">Driver Standlist</th></tr>`;
            constructorTable.innerHTML = `<tr><th colspan="3">Constructor Standlist</th></tr>`;

            // Adatok feltöltése a táblázatba
            standlistData.forEach((driver, index) => {
                const constructorId = Number(driver.constructorId); // Biztosan szám legyen
                
                // Pilóták adatai
                driverTable.innerHTML += `
                    <tr>
                        <td class="${driver.driverCode}">${index + 1}</td>
                        <td>${driver.driverCode}</td>
                        <td>0</td>
                    </tr>
                `;

                // Konstruktorok táblázata, csak egyszer adja hozzá az adatokat
                if (!addedConstructors.has(constructorId)) {
                    addedConstructors.add(constructorId);

                    const className = constructorClasses[constructorId] || 'Unknown';

                    constructorTable.innerHTML += `
                        <tr class="${className}">
                            <td>${addedConstructors.size}</td>
                            <td>${className}</td>
                            <td>0</td>
                        </tr>
                    `;
                }
            });

            // Az összes konstruktor megjelenítése, amely kimaradt volna
            Object.entries(constructorClasses).forEach(([constructorId, className], index) => {
                if (!addedConstructors.has(Number(constructorId))) {
                    constructorTable.innerHTML += `
                        <tr class="${className}">
                            <td>${addedConstructors.size + 1}</td>
                            <td>${className}</td>
                            <td>0</td>
                        </tr>
                    `;
                    addedConstructors.add(Number(constructorId));
                }
            });
        })
        .catch(error => console.error('Error fetching standlist:', error));
});

