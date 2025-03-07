document.addEventListener('DOMContentLoaded', () => {
    const fetchConstructors = async () => {
        try {
            const response = await fetch('/constructors');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching constructors:', error);
        }
    };

    const createPilotElement = (constructor, pilotName, id) => {
        return `
            <a href="" target="_blank">
                <div class="text-container" id="${id}">
                    <span>${pilotName}</span>
                    <p>${constructor.constructorName}</p>
                </div>
            </a>
        `;
    };

    fetchConstructors().then(constructors => {
        const pilotsDiv = document.getElementById('pilots');

        constructors.forEach(constructor => {
            let id;
            switch (constructor.constructorName) {
                case 'Ferrari':
                    id = 'ferrari';
                    break;
                case 'McLaren':
                    id = 'mclaren';
                    break;
                case 'Mercedes':
                    id = 'mercedes';
                    break;
                case 'Red Bull Racing':
                    id = 'redbull';
                    break;
                case 'Alpine':
                    id = 'alpine';
                    break;
                case 'Williams':
                    id = 'williams';
                    break;
                case 'Aston Martin':
                    id = 'astonmartin';
                    break;
                case 'Racing Bulls':
                    id = 'racingbulls';
                    break;
                case 'Haas':
                    id = 'haas';
                    break;
                case 'Kick Sauber':
                    id = 'sauber';
                    break;
                default:
                    id = '';
            }

            const pilot1Element = createPilotElement(constructor, constructor.pilot1Name, id);
            pilotsDiv.innerHTML += pilot1Element;

            const pilot2Element = createPilotElement(constructor, constructor.pilot2Name, id);
            pilotsDiv.innerHTML += pilot2Element;
        });
    });
});
