document.addEventListener('DOMContentLoaded', () => {
    const scheduleBtn = document.getElementById('scheduleBtn');
    const dropdownContent = document.getElementById('scheduleDropdownContent');
    const topNav = document.getElementById('topNav'); 
    const header = document.getElementById('mainHeader');
    let isDropdownVisible = false; // Változó a dropdown láthatóságának követéséhez

    // Kattintás eseménykezelő a gombra
    scheduleBtn.addEventListener('click', (event) => {
        event.preventDefault();
        if (isDropdownVisible) {
            dropdownContent.style.display = 'none';
            topNav.style.backgroundColor = '';
            header.style.backgroundColor = '';
            scheduleBtn.classList.remove('active');
            isDropdownVisible = false;
        } else {
            dropdownContent.style.display = 'block';
            topNav.style.backgroundColor = '#15151E';
            header.style.backgroundColor = '#15151E';
            scheduleBtn.classList.add('active');
            isDropdownVisible = true;
        }
    });

    // Egér események a dropdown contenten
    dropdownContent.addEventListener('mouseenter', () => {
        dropdownContent.style.display = 'block';
    });

    dropdownContent.addEventListener('mouseleave', (event) => {
        if (!scheduleBtn.contains(event.relatedTarget) && !isDropdownVisible) {
            dropdownContent.style.display = 'none';
            topNav.style.backgroundColor = '';
            header.style.backgroundColor = '';
            scheduleBtn.classList.remove('active');
        }
    });

   
});

document.addEventListener('DOMContentLoaded', () => {
    const latestBtn = document.getElementById('latest-btn');
    const dropdownContent = document.getElementById('latestDropdownContent');
    const topNav = document.getElementById('topNav'); 
    const header = document.getElementById('mainHeader');
    let isDropdownVisible = false;

    latestBtn.addEventListener('click', (event) => {
        event.preventDefault();
        if (isDropdownVisible) {
            dropdownContent.style.display = 'none';
            topNav.style.backgroundColor = '';
            header.style.backgroundColor = '';
            latestBtn.classList.remove('active');
            isDropdownVisible = false;
        } else {
            dropdownContent.style.display = 'block';
            topNav.style.backgroundColor = '#15151E';
            header.style.backgroundColor = '#15151E';
            latestBtn.classList.add('active');
            isDropdownVisible = true;
        }
    });

    // Egér események a dropdown contenten
    dropdownContent.addEventListener('mouseenter', () => {
        dropdownContent.style.display = 'block';
    });

    dropdownContent.addEventListener('mouseleave', (event) => {
        if (!scheduleBtn.contains(event.relatedTarget) && !isDropdownVisible) {
            dropdownContent.style.display = 'none';
            topNav.style.backgroundColor = '';
            header.style.backgroundColor = '';
            scheduleBtn.classList.remove('active');
        }
    });
});