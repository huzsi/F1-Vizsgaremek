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
        const scheduleData = await fetchData('/news/race-schedule');
        displayRaceSchedule(scheduleData, monthNames, container);
        
        const nextRace = getNextClosestEvent(scheduleData);
        if (nextRace) {
            displayNextRace(nextRace, monthNames);
        }
        
        displayEventTables(scheduleData, monthNames);
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
}

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
}

function getNextClosestEvent(scheduleData) {
    if (!Array.isArray(scheduleData)) return null;  // Ellenőrzés, hogy a scheduleData tömb-e

    const now = new Date();

    for (let schedule of scheduleData) {
        const events = schedule.type === 1 ? [
            { event: 'FP1', date: new Date(schedule.event1) },
            { event: 'FP2', date: new Date(schedule.event2) },
            { event: 'FP3', date: new Date(schedule.event3) },
            { event: 'Qualify', date: new Date(schedule.event4) },
            { event: 'Race', date: new Date(schedule.event5) }
        ] : [
            { event: 'FP1', date: new Date(schedule.event1) },
            { event: 'Sprint Qualify', date: new Date(schedule.event2) },
            { event: 'Sprint', date: new Date(schedule.event3) },
            { event: 'Qualify', date: new Date(schedule.event4) },
            { event: 'Race', date: new Date(schedule.event5) }
        ];

        const closestEvent = events.find(e => e.date > now);
       
        if (closestEvent) return { ...schedule, nextEvent: closestEvent };
    }
    return null;
}

function displayNextRace(nextRace, monthNames) {
    const { nextEvent } = nextRace;
    const eventDate = new Date(nextEvent.date);
    const day = eventDate.getDate();
    const month = monthNames[eventDate.getMonth()];
    const raceDiv = document.getElementById('race-div');
    const timerParagraph = document.getElementById('timer-paragraph');

    raceDiv.innerHTML = `
        
        <img class="flag" src="/static/img/flags/${nextRace.id}.svg" alt="${nextRace.name}">
        <h3 id="RaceName">${nextRace.name}</h3>
        <h2>Next Event: ${nextEvent.event}</h2>
    `;
    
    updateCountdown(timerParagraph, eventDate, nextRace, monthNames);
    setInterval(() => updateCountdown(timerParagraph, eventDate, nextRace, monthNames),3600);
}
function displayEventTables(scheduleData, monthNames) {
    const regularTable = document.getElementById('regular-event-table');
    const sprintTable = document.getElementById('sprint-event-table');
    regularTable.innerHTML = '';
    sprintTable.innerHTML = '';

    const now = new Date();

    const nextRace = scheduleData.find(schedule => {
        const events = [
            new Date(schedule.event1),
            new Date(schedule.event2),
            new Date(schedule.event3),
            new Date(schedule.event4),
            new Date(schedule.event5)
        ];
        return events.some(eventDate => eventDate > now);
    });

    if (!nextRace) return; // Ha nincs közelgő esemény, ne tegyen semmit

    const isRegular = nextRace.type === 1;
    const targetTable = isRegular ? regularTable : sprintTable;
    
    const events = isRegular ? [
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

    targetTable.innerHTML = `
        <table class="event-Table">
            ${events.map(event => {
                const eventDate = new Date(event.date);
                if (isNaN(eventDate)) return ''; // Hibás dátumokat kihagyjuk

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
    
    regularTable.classList.toggle('hidden', !isRegular);
    sprintTable.classList.toggle('hidden', isRegular);
}
function updateCountdown(element, targetDate, nextRaceData, monthNames) {
    const now = new Date();
   
    const distance = targetDate - now;

    if (distance <= 0) {
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    element.innerHTML = `${days} DAY | ${hours} HRS | ${minutes} MIN`;
}
