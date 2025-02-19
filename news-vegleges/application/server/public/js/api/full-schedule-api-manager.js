document.addEventListener('DOMContentLoaded', () =>{
    if (!window.location.pathname.includes('/schedule')) {
        return; // Ha nem a profil oldal, akkor kilépünk a scriptből
    }
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    fetch('/racenames')
        .then(response => response.json())
        .then(raceData =>{
            fetch('/race-schedule')
                .then(response => response.json())
                .then(scheduleData =>{
                    const mainContent = document.getElementById("main-content");
                    mainContent.innerHTML = '<section class="schedule-container" id="schedule-container"></section>'
                   
                    scheduleData.forEach(schedule => {
                        const event1Date = new Date(schedule.event1);
                        const correspondingRace = raceData.find(race => race.id === schedule.id);
                        const day = event1Date.getDate();
                        const month = monthNames[event1Date.getMonth()];
                        
                        document.getElementById('schedule-container').innerHTML += `
                           <div>
                                <a href="/tracks.html?id=${correspondingRace.id}&trackName=${correspondingRace.trackName}&fullName=${correspondingRace.fullName}" id="${correspondingRace.id}">
                                    <img src="/static/img/flags/${correspondingRace.id}.svg" alt="${correspondingRace.name}">
                                    <h3>${correspondingRace.name}</h3>
                                    <p>
                                        <span>${day}</span><br>
                                        ${month}
                                    </p>
                                </a>
    
                           </div>
                        `;   
                    });
                })
                .catch(error => console.log(error));

        }).catch(error => console.log(error));

});