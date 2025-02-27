/**Ezeknek az APIk-nak az adatai csak az index oldalon kerülnek megjelenítésre
 * A script a két Standlist táblázat feltöltéséért és kiszámításért felelős.
 * Meghívott API-k:
 *  /driverStandlist
 *  /seasonRaceResults
 *  /constructorStandlist
 *  /raceResults
 * Frissítése várható.
 */
document.addEventListener('DOMContentLoaded', async () => {

    //API-k mehívása
    try {
        const driverData = await fetchData('/news/driverStandlist');
        const seasonRaceResults = await fetchData('/news/seasonRaceResults');

        const driverPoints = calculateDriverPoints(driverData, seasonRaceResults);
        updateDriverStandlist(driverData, driverPoints);

        const constructorData = await fetchData('/news/constructorStandlist');
        const driverConstructorMap = createDriverConstructorMap(driverData); //Map-et csinálok, mivel a pilóták pontjai alapján számítunk pontot a csapatoknak.

        const constructorPoints = calculateConstructorPoints(constructorData, seasonRaceResults, driverConstructorMap);
        updateConstructorStandlist(constructorData, constructorPoints);

        const raceResults = await fetchData('/news/raceResults'); //Race-result táblához lett létrehozva, ha tudom akkor ezt fogom beleépíteni a /seasonRaceResults helyett.
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
        driverPoints[driver.driverId] = 0; // Kezdeti pontszám
    });

    if (!Array.isArray(results)) {
        results = [results]; // Egyedi objektumot tömbbé alakítjuk
    }

    results.forEach(result => {
        const points = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
        for (let i = 1; i <= 20; i++) {
            const driverId = result[`P${i}`];
            if (driverId && driverPoints[driverId] !== undefined && points[i - 1] !== undefined) {
                driverPoints[driverId] += points[i - 1];
            }
        }
    });

    return driverPoints;
}
//Driver táblába az adatok integrálása
function updateDriverStandlist(driverData, driverPoints) {
    driverData.sort((a, b) => driverPoints[b.driverId] - driverPoints[a.driverId]);

    const driverTable = document.getElementById('driverTable');
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
//csapat pontszámítás:
function calculateConstructorPoints(constructorData, results, driverConstructorMap) {
    const constructorPoints = {};
    constructorData.forEach(constructor => {
        constructorPoints[constructor.constructor] = 0; // Kezdeti pontszám
    });

    if (!Array.isArray(results)) {
        results = [results]; // Egyedi objektumot tömbbé alakítjuk
    }

    results.forEach(result => {
        const points = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
        for (let i = 1; i <= 20; i++) {
            const driverId = result[`P${i}`];
            if (driverId && driverConstructorMap[driverId] !== undefined && points[i - 1] !== undefined) {
                constructorPoints[driverConstructorMap[driverId]] += points[i - 1];
            }
        }
    });

    return constructorPoints;
}
//Csapat táblázat integrálása
function updateConstructorStandlist(constructorData, constructorPoints) {
    constructorData.sort((a, b) => constructorPoints[b.constructor] - constructorPoints[a.constructor]);

    const constructorTable = document.getElementById('constructorTable');
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

    const raceTable = document.getElementById('raceTable');
    if (!resultData || resultData.length === 0) {
        return;
    } else if (resultData.length === 1) { // Tesztadat miatt nem valós adatot mutat
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
            raceTable.insertAdjacentHTML('beforeend', `
                <tr>
                    <td><a href="#">${results.raceName}</a></td>
                </tr>
            `);
        });
    }
}
