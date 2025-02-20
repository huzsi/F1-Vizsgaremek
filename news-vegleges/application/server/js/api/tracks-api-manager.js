document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const raceId = urlParams.get('id');
    const trackName = urlParams.get('trackName');
    const raceName = urlParams.get('fullName');
    const eventBtn = document.getElementById('eventBtn');

    if (raceId) {
        fetch(`/trackinfo?id=${raceId}`)
            .then(response => response.json())
            .then(trackData => {
                const imgSection = document.querySelector('.track-img');
                imgSection.innerHTML = `
                    <img class="circuit-image" src="static/img/tracks/${raceId}_Circuit.avif" alt="" height="500px">
                `;
                
                const headlineImg = document.getElementById("headline-flag");
                headlineImg.innerHTML = `<img src="/static/img/flags/${raceId}.svg" alt="${raceId}" class="flag-icon"> `;
                
                const raceFullname = document.getElementById("RaceName");
                if (raceFullname) {
                    raceFullname.textContent = raceName;
                }
            })
            .catch(error => console.error('Error fetching track data:', error));

        fetch(`/circuitdatas?id=${raceId}`)
            .then(response => response.json())
            .then(circuitData => {
                const datasSection = document.getElementById('datas');
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
            })
            .catch(error => console.error('Error fetching circuit data:', error));
    }

    // API feldolgozása
    fetch('/race-schedule')
        .then(response => response.json())
        .then(data => {
            const events = data.filter(race => race.id === raceId);

            if (events.length > 0) {
                const eventDate = new Date(events[0].event1);
                const countdownElem = document.createElement('p');
                countdownElem.id = 'countdown';
                document.getElementById("RaceName").appendChild(countdownElem);
                updateCountdown(eventDate);
                setInterval(() => updateCountdown(eventDate), 60000); // Frissítés percenként

                eventBtn.addEventListener('click', () => {
                    // Regular Events
                    const regularEvents = events.filter(event => event.type === 1);
                    if (regularEvents.length > 0) {
                        createTable('regularEvent', [
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
                        createTable('sprintEvent', [
                            { event: 'FP1', date: sprintEvents[0].event1 },
                            { event: 'Sprint Qualify', date: sprintEvents[0].event2 },
                            { event: 'Sprint', date: sprintEvents[0].event3 },
                            { event: 'Qualify', date: sprintEvents[0].event4 },
                            { event: 'Race', date: sprintEvents[0].event5 }
                        ]);
                    }
                });
            }
        })
        .catch(error => console.error('Error fetching race schedule:', error));
});

function createTable(divId, events) {
    const div = document.getElementById(divId);
    div.classList.remove('hidden');
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
                const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
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
