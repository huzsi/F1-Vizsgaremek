/**--------------------------------------------------------------------
 * 
 * Loading and displaying race results dynamically.
 * The race results are fetched from the API and displayed in the 
 * designated section of the HTML page.
 * 
 * --------------------------------------------------------------------
 * 
 * APIs used:
 *      /news/raceResults - (GET)
 * 
 * --------------------------------------------------------------------
 * 
 * Data is fetched when the page loads, and the race list is populated.
 * When a race result button is clicked, the corresponding race results 
 * are displayed.
 * 
 * Note: If only one race result is available, it is automatically 
 * displayed when the page loads.
 * 
 * --------------------------------------------------------------------
 * 
 * The code includes functions for:
 *      - Fetching all race results and populating the race list.
 *      - Displaying the race results when the "Load result" button is clicked.
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
let allRaceResults = [];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Az összes futam adatainak betöltése
        const response = await fetch('/news/raceResults');
        let resultData = await response.json();

        // Ha csak egy adatsor van, alakítsuk tömbbé
        if (!Array.isArray(resultData)) {
            resultData = [resultData];
        }

        allRaceResults = resultData;
        const raceListSection = document.getElementById('race-list-section');

        if (!resultData || resultData.length === 0) {
            raceListSection.innerHTML = `<h2>The Season has not started yet. Please come back when the first race is finished.</h2>`;
        } else {
            resultData.forEach((result, index) => {
                const raceId = result.raceId;
                raceListSection.innerHTML += `<div class="race-div" id="race-${raceId}">
                                                <img src="/static/img/flags/${result.raceId}.svg" height="25px"></img>
                                                <h2>${result.raceName}</h2>
                                                <button onclick="loadRaceResult(${index})" id="load-btn-${raceId}">Load result</button>
                                            </div>`;
            });

            // Ellenőrizzük az URL paramétereket és az egyetlen futam esetét
            const urlParams = new URLSearchParams(window.location.search);
            const raceNumber = urlParams.get('id');
            if (raceNumber !== null && raceNumber >= 1 && raceNumber <= resultData.length) {
                loadRaceResult(raceNumber - 1);
            } else if (resultData.length === 1) {
                loadRaceResult(0);
            }
        }
    } catch (error) {
        console.error('Error fetching race results: ' + error);
    }
});

async function loadRaceResult(index) {
    const raceData = allRaceResults[index];
    if (!raceData) return;

    const raceResultSection = document.getElementById('race-result-section');
    raceResultSection.innerHTML = ''; // Előző tartalom törlése

    const resultDiv = document.createElement('div');
    resultDiv.id = `race-result-${raceData.raceId}`;
    resultDiv.className = `result-div`;
    resultDiv.innerHTML = `
        <fieldset>
            <legend><h2>${raceData.raceName}</h2></legend>
            <div class="podium-drivers-div">
                ${generatePodiumDriverHTML(raceData.P2, 'second')}
                ${generatePodiumDriverHTML(raceData.P1, 'first')}
                ${generatePodiumDriverHTML(raceData.P3, 'third')}
            </div>
            <div class="result-table-div">
                <table>
                    ${generateTableHTML(raceData)}
                </table>
            </div>
        </fieldset>
    `;
    raceResultSection.appendChild(resultDiv);
}

function generatePodiumDriverHTML(driverName, positionClass) {
    const shortCode = getDriverShortCode(driverName);
    return `
        <div class="${positionClass}-div">
            <img src="/static/img/drivers/${shortCode}.avif" height="150px" alt="">
            <h3>${driverName}</h3>
            <h4>${positionClass.toUpperCase()}</h4>
        </div>
    `;
}

function generateTableHTML(raceData) {
    let tableRows = '';
    for (let i = 4; i <= 20; i++) {
        const position = `P${i}`;
        if (raceData[position]) {
            tableRows += `<tr><td>${position}</td><td>${raceData[position]}</td></tr>`;
        }
    }
    return tableRows;
}

function getDriverShortCode(driverName) {
    if (!driverName) return 'default';
    const lastName = driverName.split(' ').pop();
    return lastName.slice(0, 3).toUpperCase();
}
