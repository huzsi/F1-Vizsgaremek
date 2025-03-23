// Az API hívása és az adatok megjelenítése
async function fetchDataPodiums(tableId) {
    try {
      const response = await fetch("/api/podiums"); // Az API végpont
      const data = await response.json();

      const tableHead =document.getElementById("tableHead");
      tableHead.innerHTML = ""; // Korábbi adatok törlése a táblázatból
      const tableBody = document.getElementById("tableBody");
      tableBody.innerHTML = ""; // Korábbi adatok törlése a táblázatból
      const mainSection = document.getElementById("main");

      // Táblázat fejlécének létrehozása
        const headRow = document.createElement("tr");
        headRow.innerHTML = `
            <th>Name</th>
            <th>First Place</th>
            <th>Second Place</th>
            <th>Third Place</th>
            <th>Total Podiums</th>
        `;
        tableHead.appendChild(headRow);
  
    // Adatok hozzáadása a táblázathoz
        let currentIndex = 0;
        const rowsPerPage = 10;

        function renderRows() {
        const endIndex = Math.min(currentIndex + rowsPerPage, data.length);
        for (let i = currentIndex; i < endIndex; i++) {
            const drivers = data[i];
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${drivers.FirstName} ${drivers.LastName}</td>
            <td>${drivers.FirstPlaceCount}</td>
            <td>${drivers.SecondPlaceCount}</td>
            <td>${drivers.ThirdPlaceCount}</td>
            <td>${drivers.TotalPodiums}</td>
            `;
            tableBody.appendChild(row);
        }
        currentIndex = endIndex;
        if (currentIndex >= data.length) {
            loadMoreButton.style.display = "none";
        }
        }

        // Ellenőrizzük, hogy létezik-e már a gomb, és eltávolítjuk, ha igen
        let loadMoreButton = document.getElementById("loadMoreButton");
        if (loadMoreButton) {
          loadMoreButton.remove();
        }

        // Új "loadMoreButton" létrehozása
        loadMoreButton = document.createElement("button");
        loadMoreButton.textContent = "Show 10 more";
        loadMoreButton.classList.add("tableButton");
        loadMoreButton.id = "loadMoreButton"; // Egyedi azonosító a gombhoz
        loadMoreButton.addEventListener("click", renderRows);
        mainSection.appendChild(loadMoreButton);

        renderRows();
  
      // Összes rejtett táblázat elrejtése
      document.querySelectorAll("div.hidden").forEach((table) => {
        table.style.display = "none";
      });
  
      // Kijelölt táblázat megjelenítése
      document.getElementById(tableId).style.display = "block";

    } catch (error) {
      console.error("Hiba történt az adatok betöltésekor:", error);
    }
  }
  
  // Adatok betöltése gombnyomásra
  document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("loadPodiums");
    button.addEventListener("click", () => {
      fetchDataPodiums("dataTable");
      document.getElementById("pilotStats").style.display = "none";
      document.getElementById("constructorStats").style.display = "none";
      document.getElementById("otherStats").style.display = "none";    
      document.getElementById("statisticsGPT").style.display = "none";
    });
  });
  