/**--------------------------------------------------------------------
 * 
 * Handling race schedule and next race display with countdown.
 * The race schedule is fetched from the API and displayed in a 
 * scrollable menu. The next race information is displayed with 
 * a countdown timer.
 * 
 * --------------------------------------------------------------------
 * 
 * APIs used:
 *      /news/race-schedule - (GET)
 * 
 * --------------------------------------------------------------------
 * 
 * Data is fetched and displayed when the page loads.
 * The next race is identified and displayed with a countdown timer.
 * 
 * Note: If the countdown reaches zero, it is replaced with a 
 * button that redirects to the F1TV website.
 * 
 * --------------------------------------------------------------------
 * 
 * The code includes functions for:
 *      - Fetching race schedule and populating the scrollable menu.
 *      - Displaying the next race and updating the countdown timer.
 * 
 * The fetchData function is used to load data from the API.
 * 
 * The generatePodiumDriverHTML and generateTableHTML functions handle the 
 * generation of HTML content for the race results.
 * 
 * --------------------------------------------------------------------
 * 
 * The async functions ensure that the data fetching and display 
 * operations are performed efficiently.
 * Do not modify them under any circumstances!
 * 
 * --------------------------------------------------------------------
 * Created by: Krisztián Ináncsi
 * Last updated: 2025-03-11
 */

document.addEventListener('DOMContentLoaded', async () => {
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const container = document.getElementById('racenames-container');

    try {
        // Fetch race schedule (includes race names)
        const scheduleData = await fetchData('/news/race-schedule');

        displayRaceSchedule(scheduleData, monthNames, container);
        
        const nextRace = getNextRace(scheduleData);
        if (nextRace) {
            displayNextRace(nextRace, monthNames);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch data from ${url}`);
    }
    return await response.json();
}//--//

// Scroll-menü-t integráló függvény:
function displayRaceSchedule(scheduleData, monthNames, container) {
    scheduleData.forEach(schedule => {
        const event1Date = new Date(schedule.event1);
        const day = event1Date.getDate();
        const month = monthNames[event1Date.getMonth()];

        container.innerHTML += `
            <a href="/news/tracks.html?id=${schedule.id}&trackName=${schedule.trackName}&fullName=${schedule.fullName}" id="${schedule.id}">
                <img class="flag" src="/static/img/flags/${schedule.id}.svg" alt="${schedule.name}">
                    <br>
                ${schedule.name}
                <hr>
                <p>
                    <span>${day}</span><br>
                    ${month}
                </p>
            </a>
        `;
    });
}//--//

// Következő futam függvénye:
function getNextRace(scheduleData) {
    return scheduleData.find(schedule => new Date(schedule.event1) > new Date());
}//--//

function displayNextRace(nextRace, monthNames) {
    const event1Date = new Date(nextRace.event1);
    const day = event1Date.getDate();
    const month = monthNames[event1Date.getMonth()];
    const raceDiv = document.getElementById('race-div');
    const timerParagraph = document.getElementById('timer-paragraph');

    raceDiv.innerHTML = `
        <h2>Next Race</h2>
        <img class="flag" src="/static/img/flags/${nextRace.id}.svg" alt="${nextRace.name}">
        <h3 id="RaceName">${nextRace.name}</h3>
    `;

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

    const targetTable = nextRace.type === 1 ? document.getElementById('regular-event-table') : document.getElementById('sprint-event-table');
    if (targetTable) {
        targetTable.innerHTML = `
            <table class="event-Table">
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

function updateCountdown(element, targetDate, nextRaceData, monthNames) {
    const now = new Date();
    const distance = targetDate - now;

    if (distance <= 0) {
        element.innerHTML = `<a href="https://f1tv.formula1.com" class="btn">Watch live on F1TV</a>`;

        setTimeout(() => {
            const nextRace = getNextRace(nextRaceData);
            if (nextRace) {
                const nextEventDate = new Date(nextRace.event1);
                updateCountdown(element, nextEventDate, nextRaceData, monthNames);
            }
        }, 60 * 60 * 1000); // 1 óra után újraindít
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    element.innerHTML = `${days} DAY ${hours} HRS ${minutes} MIN`;
}

