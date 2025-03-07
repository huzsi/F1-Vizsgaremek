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