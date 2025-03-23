document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.loadYearsSeason').addEventListener('click', () => {
    displayYearButtons('season');
  });

  document.querySelector('.loadYearsRace').addEventListener('click', () => {
    displayYearButtons('race');
  });
});

function displayYearButtons(type) {
  const yearButtons = document.getElementById('yearButtons');
  yearButtons.innerHTML = '';
  for (let year = 1950; year <= 2024; year++) {
    const button = document.createElement('button');
    button.className = 'loadYear';
    button.textContent = year;
    button.onclick = () => {
      if (type === 'season') {
        fetchSeasonData(year);
      } else if (type === 'race') {
        fetchRaces(year);
      }
    };
    yearButtons.appendChild(button);
    yearButtons.appendChild(document.createElement('br'));
  }
  yearButtons.style.display = 'flex';
}

async function fetchSeasonData(year) {
  try {
    const response = await fetch(`/api/seasonStats?year=${year}`);
    const data = await response.json();

    const drivers = data.drivers;
    const constructors = data.constructors;

    // Populate table head
    const tableHead = document.getElementById("tableHead");
    tableHead.innerHTML = `
      <tr>
        <th>Driver</th>
        <th>Points</th>
      </tr>
    `;

    // Populate table body with drivers data
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = drivers.map(driver => `
      <tr>
        <td>${driver.forename} ${driver.surname}</td>
        <td>${driver.total_points}</td>
      </tr>
    `).join('');

    // Add a separator row for constructors
    tableBody.innerHTML += `
      <tr>
        <td colspan="2"><b>Constructors</b></td>
      </tr>
    `;

    // Populate table body with constructors data
    tableBody.innerHTML += constructors.map(constructor => `
      <tr>
        <td>${constructor.name}</td>
        <td>${constructor.total_points}</td>
      </tr>
    `).join('');

    document.getElementById("yearButtons").style.display = "none";
    document.getElementById("dataTable").classList.remove("hidden");

  } catch (error) {
    console.error("Hiba történt az adatok betöltésekor:", error);
  }
}

async function fetchRaces(year) {
  try {
    const response = await fetch(`/races/${year}`);

    // Ellenőrizzük, hogy a válasz tartalmaz-e érvényes JSON-t
    const text = await response.text();
    try {
      var data = JSON.parse(text);
    } catch (error) {
      throw new Error(`Invalid JSON response: ${text}`);
    }

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("No race data found for this year.");
    }

    const raceButtons = document.getElementById("raceButtons");
    raceButtons.innerHTML = data.map(race => `
      <button class="loadRace" onclick="fetchRaceData(${race.raceId})">${race.race_name}</button>
    `).join('');
    raceButtons.style.display = "block";

  } catch (error) {
    console.error("Hiba történt az adatok betöltésekor:", error);
  }
}