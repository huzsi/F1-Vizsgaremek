document.addEventListener('DOMContentLoaded', () => {
    const circuitBtn = document.getElementById('circuitBtn');
    const winnersBtn = document.getElementById('winnersBtn');
    const eventBtn = document.getElementById('eventBtn');
    const datasDiv = document.getElementById('datas');
    const winnersDiv = document.getElementById('lastWinners');
    const eventDiv = document.getElementById('event-container');


    circuitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        datasDiv.classList.remove('hidden');
        winnersDiv.classList.add('hidden');
        eventDiv.classList.add('hidden');
        

        setActiveButton(circuitBtn);
    });

    winnersBtn.addEventListener('click', (e) => {
        e.preventDefault();
        datasDiv.classList.add('hidden');
        winnersDiv.classList.remove('hidden');
        eventDiv.classList.add('hidden');
      
        setActiveButton(winnersBtn);
    });

    eventBtn.addEventListener('click', (e) => {
        e.preventDefault();
        datasDiv.classList.add('hidden');
        winnersDiv.classList.add('hidden');
        eventDiv.classList.remove('hidden');
      
        setActiveButton(eventBtn);
    });

    function setActiveButton(activeBtn) {
        // Távolítsuk el az active osztályt minden gombnál
        [circuitBtn, winnersBtn, eventBtn].forEach((btn) => {
            btn.classList.remove('active');
        });
        // Adjuk hozzá az active osztályt a kattintott gombhoz
        activeBtn.classList.add('active');
    }
});
