document.addEventListener('DOMContentLoaded', (event) => {
  const seasonButtons = document.getElementsByClassName("loadYearsSeason");

  Array.from(seasonButtons).forEach(button => {
    button.addEventListener("click", () => {
      document.getElementById("pilotStats").style.display = "none";
      document.getElementById("constructorStats").style.display = "none"; 
      document.getElementById("otherStats").style.display = "none";
      document.getElementById("statisticsGPT").style.display = "none";
      document.getElementById("dataTable").classList.add("hidden");
      document.getElementById("yearButtons").style.display = "flex";
      document.getElementById("raceButtons").style.display = "none";
    });
  });

  const raceButtons = document.getElementsByClassName("loadYearsRace");

  Array.from(raceButtons).forEach(button => {
    button.addEventListener("click", () => {
      document.getElementById("pilotStats").style.display = "none";
      document.getElementById("constructorStats").style.display = "none"; 
      document.getElementById("otherStats").style.display = "none";
      document.getElementById("statisticsGPT").style.display = "none";
      document.getElementById("dataTable").classList.add("hidden");
      document.getElementById("yearButtons").style.display = "flex";
      document.getElementById("raceButtons").style.display = "none";
    });
  });
});

window.onload = function() { 
  document.getElementById("yearButtons").style.display = "none";
  document.getElementById("raceButtons").style.display = "none";
};