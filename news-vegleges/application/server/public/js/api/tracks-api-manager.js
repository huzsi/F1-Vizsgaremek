/**--------------------------------------------------------------------
 * 
 * This code displays information about the tracks hosting individual races.
 * Only used by tracks.html.
 * 
 * --------------------------------------------------------------------
 * 
 * The track is determined by the data sent in the link.
 * Therefore, the correct implementation of schedule-api-manager.js and dropdown-api-manager.js
 * also affects the functionality of this code!
 * 
 * The code uses the following APIs:
 *      /trackinfo (GET)
 *      /circuitdatas (GET)
 *      /race-schedule (GET)
 * 
 * --------------------------------------------------------------------
 * 
 * Optional updates in the code:
 *      - Highlights videos from the past 5 years.
 * 
 * --------------------------------------------------------------------
 * Created by: Ináncsi Krisztián
 * Last updated: 2025-03-02
 * 
 */

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const raceId = urlParams.get('id');
    const trackName = urlParams.get('trackName');
    const raceName = urlParams.get('fullName');
    const eventBtn = document.getElementById('event-btn');

    try {
        // Felső timer betöltése
        if (raceId) {
            const trackData = await fetchData(`/news/trackinfo?id=${raceId}`); //Pálya id alapján szűrök az adathalmazban
            document.querySelector('.track-img').innerHTML = `
                <img class="circuit-image" src="/static/img/tracks/${raceId}_Circuit.avif" alt="">
            `;
            document.getElementById("headline-flag").innerHTML = `
                <img src="/static/img/flags/${raceId}.svg" alt="${raceId}" class="flag-icon"> `;
            const raceFullname = document.getElementById("race-name-headline"); //HTML elem betöltése. (Ez a rész még változhat.)
            if (raceFullname) {
                raceFullname.textContent = raceName;
            }

            // Pályaadatok megjelenítése
            const circuitData = await fetchData(`/news/circuitdatas?id=${raceId}`); //Pálya id alapján szűrök az adathalmazban
            const datasSection = document.getElementById('circuit-datas-content'); //HTML elem betöltése.
            if (datasSection) {
                datasSection.innerHTML = `
                    <h2 id="circuitName">${trackName}</h2>
                    <div>
                        <h3>First Grand Prix</h3>
                        <p> - ${circuitData.firstGP}</p>
                    </div>
                    <div>
                        <h3>Number of Laps</h3>
                        <p> - ${circuitData.lapNumber}<span class="unit"> laps</span></p>
                    </div>
                    <div>
                        <h3>Circuit Length</h3>
                        <p> - ${circuitData.length}<span class="unit"> km</span></p> 
                    </div>
                    <div>
                        <h3>Race Distance</h3>
                        <p> - ${circuitData.raceDistance}<span class="unit"> km</span></p>
                    </div>
                    <div>
                        <h3>Lap Record</h3>
                        <p> - ${circuitData.record} <span class="driverSpan">(${circuitData.driver}</span> - <span class="yearSpan">${circuitData.recordYear})</span></p>
                    </div>
                `;
            } else {
                console.error('Element with ID "datas" not found.');
            }

            // Futam dátumok
            const scheduleData = await fetchData('/news/race-schedule');
            const events = scheduleData.filter(race => race.id === raceId); //ID alapján szűrök az adathalmazban.

            if (events.length > 0) {
                const eventDate = new Date(events[0].event1);
                const countdownElem = document.createElement('p');
                countdownElem.id = 'countdown';
                document.getElementById("race-name-headline").appendChild(countdownElem); // Visszaszámláló betöltése a header alatt.
                updateCountdown(countdownElem, eventDate);
                setInterval(() => updateCountdown(countdownElem, eventDate), 60000); // Időzítő Frissítés percenként

                //Gombnyomást követően jeleníti meg a táblázatot.
                eventBtn.addEventListener('click', () => {
                    // Regular Events
                    const regularEvents = events.filter(event => event.type === 1);
                    if (regularEvents.length > 0) {
                        createTable('regular-event-date-content', [
                            { event: 'FP1', date: regularEvents[0].event1 },
                            { event: 'FP2', date: regularEvents[0].event2 },
                            { event: 'FP3', date: regularEvents[0].event3 },
                            { event: 'Qualify', date: regularEvents[0].event4 },
                            { event: 'Race', date: regularEvents[0].event5 }
                        ]);
                    }

                    // Sprint Events
                    const sprintEvents = events.filter(event => event.type === 2);
                    if (sprintEvents.length > 0) {
                        createTable('sprint-event-date-content', [
                            { event: 'FP1', date: sprintEvents[0].event1 },
                            { event: 'Sprint Qualify', date: sprintEvents[0].event2 },
                            { event: 'Sprint', date: sprintEvents[0].event3 },
                            { event: 'Qualify', date: sprintEvents[0].event4 },
                            { event: 'Race', date: sprintEvents[0].event5 }
                        ]);
                    }
                    /**
                     * Mivel két féle hétvége kerülhet megrendezésre, így a type mező alapján szűröm ki,
                     * hogy milyen adatok lehetnek a táblázatban. (Csak az első oszlop változhat a típus alapján, a dátumok adatosoronként
                     * módosulhatnak.)
                     * 
                     */
                });
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

//API hívó függvény.
async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch data from ${url}`);
    }
    return await response.json();
}

//táblázatot létrehozó függvény.
function createTable(divId, events) {
    const div = document.getElementById(divId);
    div.classList.remove('hidden');
    //Táblázat fejléce.
    div.innerHTML = `
        <h2>Grand Prix Events</h2>
        <table>
            <tr>
                <th>Event</th>
                <th colspan="2">Date</th>
            </tr>
            ${events.map(event => {
                const eventDate = new Date(event.date);
                const day = eventDate.getDate();
                const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]; //Date típus miatt a hónapokat számmal jelölné a rendszer. Így érem el, hogy a hónap rövidítése jelenjen meg helyette.
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
    `
}

//Időzítő.
function updateCountdown(eventDate) {
    const now = new Date();
    const diff = eventDate - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    const countdownElem = document.getElementById('countdown');
    if (countdownElem) {
        countdownElem.textContent = `${days} DAY | ${hours} HRS | ${minutes} MIN`;
    }
}
