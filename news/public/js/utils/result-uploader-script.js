/**--------------------------------------------------------------------
 * 
 * Race results submission form with dynamic driver selection and race details.
 * This script fetches race names and driver information from the server,
 * allows users to select drivers for each position in the race, 
 * and submits the results to the server.
 * 
 * --------------------------------------------------------------------
 * 
 * Features:
 *      1. **Fetching Race Names:**
 *         - The script fetches race names from the server (`/news/racenames`) and populates a dropdown menu.
 *         - Upon selecting a race, the selected race's name is displayed on the page.
 * 
 *      2. **Dynamic Driver Selection:**
 *         - A series of dropdowns (for each position from P1 to P20) are dynamically created based on the number of positions in the race.
 *         - Each dropdown allows the user to choose a driver for that position.
 *         - The driver options are fetched from the server (`/news/driver-standlist`), and each select element is populated with the available drivers.
 *         - When a driver is selected, other dropdowns are updated to prevent selecting the same driver more than once.
 * 
 *      3. **Form Submission:**
 *         - The user can submit the form with the selected drivers for each position.
 *         - When the form is submitted, the selected drivers for each position are sent to the server (`/news/save-race-results`) in JSON format, along with the race ID.
 *         - The form submission is handled using the `POST` method.
 * 
 * --------------------------------------------------------------------
 * 
 * Event Handlers:
 *      - **Race Name Selection:** Updates the displayed race name when a new race is selected from the dropdown.
 *      - **Driver Selection:** Dynamically populates the driver options, ensuring no driver is selected more than once for the positions.
 *      - **Form Submission:** Sends the selected drivers for each position to the server as race results.
 * 
 * --------------------------------------------------------------------
 * 
 * DOM Structure:
 *      - **Race Name Dropdown:** Contains the race names and is used to select a race.
 *      - **Driver Dropdowns:** 20 dropdowns (for P1 to P20) are dynamically generated, where each dropdown lets the user select a driver.
 *      - **Form Submission:** The form element submits the data when the "submit" event occurs.
 * 
 * --------------------------------------------------------------------
 * 
 * Key Functions:
 *      - **populateDriverSelects:** Creates 20 dropdowns for driver selection and populates them with driver options.
 *      - **updateDriverOptions:** Ensures that no driver is selected more than once in the various positions.
 *      - **Form Submission Handler:** Collects all the selected drivers and sends them to the server as JSON.
 * 
 * --------------------------------------------------------------------
 * Created by: Krisztián Bartók
 * Last updated: 2025-03-03
 */
document.addEventListener('DOMContentLoaded', function() {
    // Versenynevek lekérése
    fetch('/news/race-schedule')
      .then(response => response.json())
      .then(data => {
        const raceSelectElement = document.getElementById('raceName');

        data.forEach(race => {
          const option = document.createElement('option');
          option.value = race.id;
          option.textContent = race.name;
          raceSelectElement.appendChild(option);
        });

        raceSelectElement.addEventListener('change', function() {
          const selectedRace = data.find(race => race.id === parseInt(this.value));
          if (selectedRace) {
            document.getElementById('race-Name').textContent = selectedRace.name;
          }
        });
      })
      .catch(error => console.error('Error fetching race names:', error));

    // Pilóták listájának lekérése
    fetch('/news/driver-standlist')
      .then(response => response.json())
      .then(drivers => {
        const raceDataContainer = document.getElementById('raceData-input-container');
        const driverSelects = [];

        function populateDriverSelects() {
          raceDataContainer.innerHTML = '';

          for (let i = 1; i <= 20; i++) {
            const div = document.createElement('div');
            div.id = `P${i}-inputDiv`;

            const label = document.createElement('label');
            label.htmlFor = `driver${i}`;
            label.textContent = `P${i}`;

            const select = document.createElement('select');
            select.name = `driver${i}`;
            select.id = `driver${i}`;

            // Alapértelmezett opció
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Válassz pilótát';
            select.appendChild(defaultOption);

            // Pilóták hozzáadása a select mezőkhöz
            drivers.forEach(driver => {
              const option = document.createElement('option');
              option.value = driver.driverId;
              option.textContent = driver.driverName;
              select.appendChild(option);
            });

            select.addEventListener('change', function() {
              updateDriverOptions();
            });

            div.appendChild(label);
            div.appendChild(select);
            raceDataContainer.appendChild(div);

            driverSelects.push(select);
          }
        }

        function updateDriverOptions() {
          const selectedDrivers = new Set(driverSelects.map(select => select.value).filter(value => value !== ''));

          driverSelects.forEach(select => {
            const currentSelectedDriver = select.value;
            Array.from(select.options).forEach(option => {
              if (option.value !== '' && selectedDrivers.has(option.value) && option.value !== currentSelectedDriver) {
                option.disabled = true;
              } else {
                option.disabled = false;
              }
            });
          });
        }

        populateDriverSelects();
      })
      .catch(error => console.error('Error fetching driver stand list:', error));

    // Az űrlap elküldésekor az adatok mentése
    const form = document.getElementById('raceResultsForm');
    form.addEventListener('submit', function(event) {
      event.preventDefault();

      const raceId = document.getElementById('raceName').value;
      const type = document.getElementById('event-type').value;
      const raceResults = {};
      for (let i = 1; i <= 20; i++) {
        const select = document.getElementById(`driver${i}`);
        if (select && select.value) {
          const driverId = parseInt(select.value); // biztosítjuk, hogy szám legyen
          raceResults[`P${i}`] = driverId;
        }
      }

      // Adatok küldése a szerverre
      fetch('/news/save-race-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ raceId: raceId,type: type, results: raceResults })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        alert('Eredmények sikeresen mentve!');
      })
      .catch(error => {
        console.error('Error saving race results:', error);
      });
    });
});
