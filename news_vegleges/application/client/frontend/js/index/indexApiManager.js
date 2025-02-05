document.addEventListener('DOMContentLoaded', () => {
    fetch('/racenames')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('racenames-container');
            data.forEach(race => {
                const a = document.createElement('a');
                a.href = `tracks.html?id=${race.id}&trackName=${race.trackName}&fullName=${race.fullName}`;
                a.id = race.id;

                const img = document.createElement('img');
                img.src = `/static/img/flags/${race.id}.svg`;
                img.alt = race.name;

                const br = document.createElement('br');

                const nameText = document.createTextNode(race.name);
                const hr = document.createElement('hr');

                const p = document.createElement('p');
                const span = document.createElement('span');
                span.textContent = race.raceNumber;

                const dateBr = document.createElement('br');
                const dateText = document.createTextNode('MAR');

                p.appendChild(span);
                p.appendChild(dateBr);
                p.appendChild(dateText);

                a.appendChild(img);
                a.appendChild(br);
                a.appendChild(nameText);
                a.appendChild(hr);
                a.appendChild(p);

                container.appendChild(a);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});
document.addEventListener('DOMContentLoaded', () => {
    fetch('/race-schedule')
        .then(response => response.json())
        .then(data => {
            const scheduleContent = document.getElementById('schedule-content');
            
            data.forEach(race => {
                const raceDiv = document.createElement('div');

                const raceElement = document.createElement('a');
                raceElement.href = `tracks.html?id=${race.id}&trackName=${race.trackName}&fullName=${race.fullName}`;
                
                const fieldset = document.createElement('fieldset');
                
                const legend = document.createElement('legend');
                const legendText = document.createElement('p');
                legendText.textContent = `Round ${race.raceNumber}`;
                legend.appendChild(legendText);
                
                const img = document.createElement('img');
                img.src = `static/img/flags/${race.id}.svg`;
                img.alt = race.name;
                
                const h4 = document.createElement('h4');
                h4.textContent = race.name;
                
                const p = document.createElement('p');
                const event1Date = new Date(race.event1);
                const event5Date = new Date(race.event5);
                const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
                const formattedDate = `${monthNames[event1Date.getMonth()]} ${event1Date.getDate()} - ${event5Date.getDate()}`;
                p.textContent = formattedDate;
                
                fieldset.appendChild(legend);
                fieldset.appendChild(img);
                fieldset.appendChild(h4);
                fieldset.appendChild(p);
                
                raceElement.appendChild(fieldset);
                raceDiv.appendChild(raceElement);
                scheduleContent.appendChild(raceDiv);
            });
        })
        .catch(error => console.error('Error fetching race schedule:', error));
});
