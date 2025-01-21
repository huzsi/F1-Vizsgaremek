const RaceAndDates = [
    "Australian", "2025-03-14T00:00:00",
    "Chinese", "2025-03-23T00:00:00",
    "Japanese", "2025-04-06T00:00:00",
    "Bahrain", "2025-04-13T00:00:00",
    "Saud-Arabian", "2025-04-20T00:00:00",
    "Miami", "2025-05-04T00:00:00",
    "Emilia-Romagna", "2025-05-18T00:00:00",
    "Monaco", "2025-05-25T00:00:00",
    "Spain", "2025-06-01T00:00:00",
    "Canada", "2025-06-15T00:00:00",
    "Austrian", "2025-06-29T00:00:00",
    "British", "2025-07-06T00:00:00",
    "Belgian", "2025-07-27T00:00:00",
    "Hungarian", "2025-08-03T00:00:00",
    "Dutch", "2025-08-23T00:00:00",
    "Italian", "2025-09-07T00:00:00",
    "Azerbajan", "2025-09-21T00:00:00",
    "Singapore", "2025-10-05T00:00:00",
    "United States", "2025-10-19T00:00:00",
    "Mexico", "2025-10-26T00:00:00",
    "Sao Paulo", "2025-11-09T00:00:00",
    "Las Vegas", "2025-11-22T00:00:00",
    "Qatar", "2025-11-30T00:00:00",
    "Abu Dhabi", "2025-12-07T00:00:00"
];

// Elemeink kijelölése
const raceNameElement = document.getElementById('RaceName');
const timerParagraph = document.getElementById('timerParagraph');

// Dátum feldolgozása és legközelebbi futam meghatározása
function getClosestRace() {
    const now = new Date();
    let closestRace = null;
    let closestDate = null;
    let closestTimeDiff = Infinity;

    for (let i = 0; i < RaceAndDates.length; i += 2) {
        const raceName = RaceAndDates[i];
        const raceDateStr = RaceAndDates[i + 1];
        const raceDate = new Date(raceDateStr);

        const timeDiff = raceDate - now;
        if (timeDiff > 0 && timeDiff < closestTimeDiff) {
            closestRace = raceName;
            closestDate = raceDate;
            closestTimeDiff = timeDiff;
        }
    }

    return { closestRace, closestDate };
}

// Visszaszámláló indítása
function startCountdown() {
    const updateTimer = () => {
        const { closestRace, closestDate } = getClosestRace();

        if (!closestRace || !closestDate) {
            raceNameElement.textContent = "No upcoming races";
            timerParagraph.textContent = "";
            clearInterval(timerInterval);
            return;
        }

        const now = new Date();
        const timeDiff = closestDate - now;

        // Ha elérjük a futam dátumát, frissítjük a következő futamra
        if (timeDiff <= 0) {
            startCountdown();
            return;
        }

        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

        raceNameElement.textContent = `2025 ${closestRace} Grand Prix`;
        timerParagraph.textContent = `${days} days | ${hours} Hrs | ${minutes} Mins`;
    };

    updateTimer(); // Azonnali frissítés
    const timerInterval = setInterval(updateTimer, 1000 * 60); // Frissítés percenként
}

// Indítsuk el a visszaszámlálót, amikor betöltődik az oldal
document.addEventListener('DOMContentLoaded', startCountdown);
