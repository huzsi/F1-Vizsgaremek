async function fetchRaceData(raceId) {
  try {
    const response = await fetch(`/api/raceResults?raceId=${raceId}`);
    const data = await response.json();

    // Populate race results table head
    const tableHead = document.getElementById("tableHead");
    tableHead.innerHTML = `
      <tr>
        <th>Driver</th>
        <th>Position</th>
        <th>Points</th>
      </tr>
    `;

    // Populate race results table body
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = data.map(result => `
      <tr>
        <td>${result.driver_name}</td>
        <td>${result.position}</td>
        <td>${result.points}</td>
      </tr>
    `).join('');

    document.getElementById("raceButtons").style.display = "none";
    document.getElementById("yearButtons").style.display = "none";
    document.getElementById("dataTable").classList.remove("hidden");

  } catch (error) {
    console.error("Hiba történt az adatok betöltésekor:", error);
  }
}