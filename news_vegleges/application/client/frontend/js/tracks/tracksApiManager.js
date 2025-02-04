document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const raceId = urlParams.get('id');
    const trackName = urlParams.get('trackName');
    const raceName = urlParams.get('fullName');
    
    if (raceId) {
        fetch(`/trackinfo?id=${raceId}`)
            //Pálya kép
            .then(response => response.json())
            .then(trackData => {
                const imgSection = document.querySelector('.track-img');
                imgSection.innerHTML = `
                    <img src="static/img/tracks/${raceId}_Circuit.avif" alt="" height="500px">
                `;
                
                const headlineImg = document.getElementById("headline-flag");
                headlineImg.innerHTML = `<img src="/static/img/flags/${raceId}.svg" alt="${raceId}" class="flag-icon"> `;
                
                const raceFullname = document.getElementById("RaceName");
                if (raceFullname) {
                    raceFullname.textContent = raceName;
                }
                //Futam dátumai
                fetch(`/racedates?id=${raceId}`)
                    .then(response => response.json())
                    .then(raceData => {
                        const eventDateBtn = document.getElementById('eventBtn');
                        eventDateBtn.addEventListener('click', () => {
                            const type = raceData.type;
                            if (type === 2) {
                                createTable('sprintEvents', [
                                    { event: 'FP1', date: raceData.event1 },
                                    { event: 'Sprint Qualify', date: raceData.event2 },
                                    { event: 'Sprint', date: raceData.event3 },
                                    { event: 'Qualify', date: raceData.event4 },
                                    { event: 'Race', date: raceData.event5 },
                                ]);
                            } else if (type === 1) {
                                createTable('regularEvents', [
                                    { event: 'FP1', date: raceData.event1 },
                                    { event: 'FP2', date: raceData.event2 },
                                    { event: 'FP3', date: raceData.event3 },
                                    { event: 'Qualify', date: raceData.event4 },
                                    { event: 'Race', date: raceData.event5 },
                                ]);
                            } else {
                                console.error('Unknown race type');
                            }
                        });
                    })
                    .catch(error => console.error('Error fetching race dates:', error));
            })
            .catch(error => console.error('Error fetching track data:', error));

        // Pálya adatok API lekérdezés feldolgozása
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
});

function createTable(divId, events) {
    const div = document.getElementById(divId);
    div.classList.remove('hidden');
    div.innerHTML = `
        <h2>Grand Prix Events</h2>
        <table>
            <tr>
                <th>Event</th>
                <th>Date</th>
            </tr>
            ${events.map(event => `
            <tr>
                <td>${event.event}</td>
                <td>${event.date}</td>
            </tr>
            `).join('')}
        </table>
    `;
}
