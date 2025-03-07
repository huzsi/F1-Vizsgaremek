// Az API hívása és az adatok megjelenítése

async function fetchDataPilotList(tableId) {
    try {
      const response = await fetch("/api/pilotList");  // API végpont módosítva
      const data = await response.json();

      const tableHead =document.getElementById("tableHead");
      tableHead.innerHTML = ""; // Korábbi adatok törlése a táblázatból
      const tableBody = document.getElementById("tableBody");
      tableBody.innerHTML = ""; // Korábbi adatok törlése a táblázatból
      const mainSection = document.getElementById("main");

      // Táblázat fejlécének létrehozása
        const headRow = document.createElement("tr");
        headRow.innerHTML = `
            <th>Code</th>
            <th>Name</th>
            <th>Date of Birth</th>
            <th>Nationality</th>
            <th>Wiki</th>
        `;
        tableHead.appendChild(headRow);
  
    // Adatok hozzáadása a táblázathoz
        let currentIndex = 0;
        const rowsPerPage = 10;

        function renderRows() {
        const endIndex = Math.min(currentIndex + rowsPerPage, data.length);
        for (let i = currentIndex; i < endIndex; i++) {
            const drivers = data[i];
            const date = new Date(drivers.DateOfBirth);
            const formattedDate = date.toISOString().split("T")[0];
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${drivers.Code}</td>
            <td>${drivers.FirstName} ${drivers.LastName}</td>
            <td>${formattedDate}</td>
            <td>${drivers.Nationality}</td>
            <td><a href="${drivers.Wiki}" target="_blank"><i class="fa-brands fa-wikipedia-w"></i></a></td>
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
    const button = document.getElementById("loadPilotList");
    button.addEventListener("click", () => {
      fetchDataPilotList("dataTable");
      document.getElementById("pilotStats").style.display = "none";
      document.getElementById("constructorStats").style.display = "none";
      document.getElementById("otherStats").style.display = "none";    });
  });
  