document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const raceId = urlParams.get('id');
    const trackName = urlParams.get('trackName');
    const raceName = urlParams.get('fullName');
    
    if (raceId) {
        fetch(`/trackinfo?id=${raceId}`)
            .then(response => response.json())
            .then(trackData => {
                const imgSection = document.querySelector('.img-section');
                imgSection.innerHTML = `
                    <img src="static/img/tracks/${raceId}_Circuit.avif" alt="" height="500px">
                `;
                
                const circuitName = document.getElementById("circuitName");
                const headlineImg = document.getElementById("headline-flag");

                if (circuitName) {
                    headlineImg.innerHTML = `<img src="/static/img/flags/${raceId}.svg" alt="${raceId}" class="flag-icon"> `;
                    circuitName.textContent = trackName;
                } else {
                    console.error('Element with ID "circuitName" not found.');
                }

                const raceFullname = document.getElementById("RaceName");
                if (raceFullname) {
                    raceFullname.textContent = raceName;
                }

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
