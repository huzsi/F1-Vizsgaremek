document.addEventListener('DOMContentLoaded', () => {
    
    const driverBtn = document.getElementById("driverBtn");
    const constructorBtn = document.getElementById("constructorBtn");
    const raceBtn = document.getElementById("raceBtn");
    const driverTable = document.getElementById("driverTable");
    const constructorTable = document.getElementById("constructorTable");
    const raceTable = document.getElementById("raceTable");

    driverBtn.addEventListener('click', (e) =>{
        e.preventDefault();
        driverTable.classList.remove('hidden');
        constructorTable.classList.add('hidden');
        raceTable.classList.add('hidden');
        
        setActiveButton(driverBtn);
    });
    constructorBtn.addEventListener('click', (e) =>{
        e.preventDefault();
        driverTable.classList.add('hidden');
        constructorTable.classList.remove('hidden');
        raceTable.classList.add('hidden');
        setActiveButton(constructorBtn);
    });
    raceBtn.addEventListener('click', (e) =>{

        e.preventDefault();
        driverTable.classList.add('hidden');
        constructorTable.classList.add('hidden');
        raceTable.classList.remove('hidden');

        setActiveButton(raceBtn);
    });

    function setActiveButton(activeBtn) {
        // Távolítsuk el az active osztályt minden gombnál
        [driverBtn, constructorBtn, raceBtn].forEach((btn) => {
            btn.classList.remove('active');
        });
        // Adjuk hozzá az active osztályt a kattintott gombhoz
        activeBtn.classList.add('active');
    }
});