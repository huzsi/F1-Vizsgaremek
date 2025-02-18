document.addEventListener('DOMContentLoaded', () => {
    const scheduleBtn = document.getElementById('scheduleBtn');
    const dropdownContent = document.getElementById('dropdownContent');
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

    // Funkció a top-nav osztály módosításához
    function findNavClass() {
        if (topNav.classList.contains('top-nav')) {
            topNav.classList.remove('top-nav');
            topNav.classList.add('top-nav-black');
        } else {
            topNav.classList.remove('top-nav-black');
            topNav.classList.add('top-nav');
        }
    }

    // Funkció a header osztály módosításához
    function findHeaderClass() {
        if (header.classList.contains('header-transparent')) {
            header.classList.remove('header-transparent');
            header.classList.add('header-black');
        } else {
            header.classList.remove('header-black');
            header.classList.add('header-transparent');
        }
    }
});
