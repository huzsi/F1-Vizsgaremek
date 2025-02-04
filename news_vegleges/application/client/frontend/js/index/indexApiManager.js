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
