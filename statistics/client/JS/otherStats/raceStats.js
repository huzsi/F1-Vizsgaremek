async function fetchRaceData(raceId) {
    try {
      const response = await fetch(`/api/raceResults?raceId=${raceId}`);
      const data = await response.json();
  
      document.getElementById("tableHead").innerHTML = `
        <tr>
          <th>Driver</th>
          <th>Constructor</th>
          <th>Position</th>
          <th>Points</th>
        </tr>
      `;
  
      document.getElementById("tableBody").innerHTML = data
        .map(
          (result) => `
          <tr>
            <td>${result.driver_name}</td>
            <td>${result.constructor_name}</td>
            <td>${result.position}</td>
            <td>${result.points}</td>
          </tr>`
        )
        .join("");
  
      document.getElementById("dataTable").classList.remove("hidden");
  
    } catch (error) {
      console.error("Hiba történt az adatok betöltésekor:", error);
    }
  }
  