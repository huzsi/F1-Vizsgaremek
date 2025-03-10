/**--------------------------------------------------------------------
 * 
 * Code handling the JS API for loading race results.
 * 
 * --------------------------------------------------------------------
 * 
 * All data stored in the database will be displayed first.
 * When clicking the "Load result" button, the final results of the given race will be listed.
 * 
 * --------------------------------------------------------------------
 * 
 * APIs used by the code:
 *              /news/raceResults
 * 
 * --------------------------------------------------------------------
 * 
 * In case of modification, make sure that the list of the previous race results is cleared by the code.
 * The listing of the final results should remain in the event handler of the "Load result" button
 * to avoid unnecessary reloads.
 * 
 * --------------------------------------------------------------------
 * Created by: Krisztián Ináncsi
 * Last updated: 2025-02-05
 */

let allRaceResults = [];

document.addEventListener('DOMContentLoaded', () => {
    // Az összes futam adatainak betöltése
    fetch('/news/raceResults')
        .then(response => response.json())
        .then(resultData => {
            

            allRaceResults = resultData;
            const raceListSection = document.getElementById('race-list-section');
            if (!Array.isArray(resultData)) {
                resultData = [resultData];
            }
            if (!resultData || resultData.length === 0) {
                raceListSection.innerHTML = `<h2>The Season has not started yet. Please come back when the first race is finished.</h2>`;
            } else {
                resultData.forEach((result, index) => {
                    const raceId = result.raceId;
                    raceListSection.innerHTML += `<div class="race-div" id="race-${raceId}">
                                                    <img src="/static/img/flags/${result.raceId}.svg" height="25px"></img>
                                                    <h2>${result.raceName}</h2>
                                                    <button onclick="loadRaceResult(${index})" id="load-btn">Load result</button>
                                                </div>`;
                });
            }
            const urlParams = new URLSearchParams(window.location.search);
            const racenumber = urlParams.get('id');
            loadRaceResult(racenumber-1);
        })
        .catch(error => console.error('Error fetching race results: ' + error));
});

function loadRaceResult(index) {
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
