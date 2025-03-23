// Az API hívása és az adatok megjelenítése
async function fetchDataConstructorChampionship(tableId) {
    try {
      const response = await fetch("/api/constructorChampionship"); // Az API végpont
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
            <th>Championship Standings</th>
        `;
        tableHead.appendChild(headRow);
  
    // Adatok hozzáadása a táblázathoz
        let currentIndex = 0;
        const rowsPerPage = 10;

        function renderRows() {
        const endIndex = Math.min(currentIndex + rowsPerPage, data.length);
        for (let i = currentIndex; i < endIndex; i++) {
            const constructors = data[i];
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${constructors.constructorName}</td>
            <td>${constructors.championshipTitles}</td>
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
    const button = document.getElementById("loadConstructorChampionship");
    button.addEventListener("click", () => {
        fetchDataConstructorChampionship("dataTable");
        document.getElementById("pilotStats").style.display = "none";
        document.getElementById("constructorStats").style.display = "none";
        document.getElementById("otherStats").style.display = "none";   
        document.getElementById("statisticsGPT").style.display = "none"; });
  });
  