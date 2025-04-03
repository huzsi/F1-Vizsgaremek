/**--------------------------------------------------------------------
 * 
 * API manager JS code for standlist tables displayed on index.html.
 * 
 * --------------------------------------------------------------------
 * 
 * Invoked APIs:
 *  /news/driver-standlist
 *  /news/season-race-results
 *  /news/constructor-standlist
 *  /news/race-results
 * 
 * --------------------------------------------------------------------
 * 
 * The code functions in a coordinated manner to calculate the scores of drivers and teams.
 * Therefore, do not make modifications in that section.
 * 
 * --------------------------------------------------------------------
 * Created by: Krisztián Ináncsi
 * Last Updated: 2025-03-02
 */

document.addEventListener('DOMContentLoaded', async () => {

    //API-k mehívása
    try {
        const driverData = await fetchData('/news/driver-standlist');
        const seasonRaceResults = await fetchData('/news/season-race-results');

        const driverPoints = calculateDriverPoints(driverData, seasonRaceResults);
        updateDriverStandlist(driverData, driverPoints);

        const constructorData = await fetchData('/news/constructor-standlist');
        const driverConstructorMap = createDriverConstructorMap(driverData); //Map-et csinálok, mivel a pilóták pontjai alapján számítunk pontot a csapatoknak.

        const constructorPoints = calculateConstructorPoints(constructorData, seasonRaceResults, driverConstructorMap);
        updateConstructorStandlist(constructorData, constructorPoints);

        const raceResults = await fetchData('/news/race-results'); //Race-result táblához lett létrehozva, ha tudom akkor ezt fogom beleépíteni a /seasonRaceResults helyett.
        updateRaceResults(raceResults);
    } catch (error) {
        console.error('Error:', error);
    }
});
//APIkat meghívó függvény:
async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch data from ${url}`);
    }
    return await response.json();
}

//Pontszámítás:
function calculateDriverPoints(driverData, results) {
    const driverPoints = {};
    driverData.forEach(driver => {
        driverPoints[driver.driverId] = 0;
    });

    if (!Array.isArray(results)) {
        results = [results];
    }

    results.forEach(result => {
        const type = result.type; // Itt vesszük figyelembe a 'type' mezőt
        const points = type === 1
            ? [25, 18, 15, 12, 10, 8, 6, 4, 2, 1] // Normál verseny
            : [8, 7, 6, 5, 4, 3, 2, 1]; // Sprint verseny

        for (let i = 1; i <= points.length; i++) {
            const driverId = result[`P${i}`];
            if (driverId && driverPoints[driverId] !== undefined) {
                driverPoints[driverId] += points[i - 1];
            }
        }
    });

    return driverPoints;
}
//Driver táblába az adatok integrálása
function updateDriverStandlist(driverData, driverPoints) {
    driverData.sort((a, b) => driverPoints[b.driverId] - driverPoints[a.driverId]);

    const driverTable = document.getElementById('driver-standlist-table');
    driverTable.innerHTML = `
        <tr>
            <th colspan="3">Driver Standlist</th>
        </tr>
    `;

    driverData.forEach((driver, index) => {
        driverTable.innerHTML += `
            <tr>
                <td class="${driver.constructor}">${index + 1}</td>
                <td>${driver.driverName}</td>
                <td class="${driver.constructor}">${driverPoints[driver.driverId]}</td>
            </tr>
        `;
    });
}
//Map létrehozása a csapatok miatt.
function createDriverConstructorMap(driverData) {
    const driverConstructorMap = {};
    driverData.forEach(driver => {
        driverConstructorMap[driver.driverId] = driver.constructor;
    });
    return driverConstructorMap;
}
function calculateConstructorPoints(constructorData, results, driverConstructorMap) {
    const constructorPoints = {};
    constructorData.forEach(constructor => {
        constructorPoints[constructor.constructor] = 0;
        console.log('Constructor name:', constructor.constructor);
    });

    console.log("DEBUG - Constructor lista:");
    constructorData.forEach(constructor => {
        console.log("constructor.constructor:", constructor.constructor, "|| constructor.constructorName:", constructor.constructorName);
    });

    if (!Array.isArray(results)) {
        results = [results];
    }

    results.forEach(result => {
        const type = result.type;
        const points = type === 1
            ? [25, 18, 15, 12, 10, 8, 6, 4, 2, 1] // Normál verseny
            : [8, 7, 6, 5, 4, 3, 2, 1]; // Sprint verseny

        for (let i = 1; i <= points.length; i++) {
            const driverId = result[`P${i}`];
            if (driverId && driverConstructorMap[driverId] !== undefined) {
                constructorPoints[driverConstructorMap[driverId]] += points[i - 1];
            }
        }
    });

	// ?? Pontm�dos�t�s a helyes nevekkel
    if (constructorPoints['redbull'] !== undefined) {
        constructorPoints['redbull'] -= 3;
    }

    if (constructorPoints['racingbulls'] !== undefined) {
        constructorPoints['racingbulls'] += 3;
    }

    return constructorPoints;
}

//Csapat táblázat integrálása
function updateConstructorStandlist(constructorData, constructorPoints) {
    constructorData.sort((a, b) => constructorPoints[b.constructor] - constructorPoints[a.constructor]);

    const constructorTable = document.getElementById('constructor-standlist-table');
    constructorTable.innerHTML = `
        <tr>
            <th colspan="3">Constructor Standlist</th>
        </tr>
    `;

    constructorData.forEach((constructor, index) => {
        constructorTable.innerHTML += `
            <tr>
                <td class="${constructor.constructor}">${index + 1}</td>
                <td>${constructor.constructorName}</td>
                <td class="${constructor.constructor}">${constructorPoints[constructor.constructor]}</td>
            </tr>
        `;
    });
}

function updateRaceResults(resultData) {
    if (!Array.isArray(resultData)) {
        resultData = [resultData]; // Egyedi objektumot tömbbé alakítjuk
    }

    const raceTable = document.getElementById('race-result-table');
    if (!resultData) {
        return;
    } else if (resultData.length === 0) { // Tesztadat miatt nem valós adatot mutat
        raceTable.innerHTML = `
            <tr>
                <th><h4>Come back when first race is ended</h4></th>
            </tr>
        `;
    } else {
        raceTable.innerHTML = `
            <tr>
                <th>Race Results</th>
            </tr>
        `;

        resultData.forEach(results => {
            if(results.type !== 2){
                raceTable.insertAdjacentHTML('beforeend', `
                    <tr>
                        <td><a href="/news/raceresult.html?id=${results.raceNumber}">${results.raceName} - Race</a></td>
                    </tr>
                `);
            }
            
        });
    }
}

