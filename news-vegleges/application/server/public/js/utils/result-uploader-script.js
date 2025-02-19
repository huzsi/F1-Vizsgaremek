document.addEventListener('DOMContentLoaded', () =>{
  if (!window.location.pathname.includes('/result-uploader')) {
    return; // Ha nem a profil oldal, akkor kilépünk a scriptből
  }

  const mainContent = document.getElementById('main-content');

  mainContent.innerHTML = `
    <form id="raceResultsForm">
            <select id="raceName">
                <option value="">Válassz egy futamot</option>
            </select>
            <h1 id="race-Name" ></h1>
            <select name="event-type" id="regular-Event">
                <option value="">Race</option>
                <option value="">Qualify</option>
            </select>
            <div id="raceData-input-container">
                <!--Többi helyezett-->
            </div>
            <button type="submit">Eredmények Mentése</button>
       </form>
  `
});

document.addEventListener('DOMContentLoaded', function() {
    // Versenynevek lekérése
    fetch('/racenames')
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
    fetch('/driverStandlist')
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
      const raceResults = {};
      for (let i = 1; i <= 20; i++) {
        const select = document.getElementById(`driver${i}`);
        if (select && select.value) {
          const driverId = parseInt(select.value); // biztosítjuk, hogy szám legyen
          raceResults[`P${i}`] = driverId;
        }
      }

      // Adatok küldése a szerverre
      fetch('/saveRaceResults', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ raceId: raceId, results: raceResults })
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
