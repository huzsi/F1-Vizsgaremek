document.addEventListener('DOMContentLoaded', () => {
    const topNav = document.getElementById('topNav');
    const header = document.getElementById('mainHeader');
    const dropdownContent = document.getElementById('dropdown-content');
    let activeButton = null;

    function setupDropdown(btnId, content) {
        const btn = document.getElementById(btnId);

        btn.addEventListener('click', (event) => {
            event.preventDefault();
            if (activeButton === btn) {
                dropdownContent.style.display = 'none';
                topNav.style.backgroundColor = '';
                header.style.backgroundColor = '';
                btn.classList.remove('active');
                activeButton = null;
            } else {
                dropdownContent.innerHTML = content;
                dropdownContent.style.display = 'block';
                topNav.style.backgroundColor = '#15151E';
                header.style.backgroundColor = '#15151E';
                btn.classList.add('active');
                if (activeButton) {
                    activeButton.classList.remove('active');
                }
                activeButton = btn;
            }
        });

        dropdownContent.addEventListener('mouseenter', () => {
            dropdownContent.style.display = 'block';
        });

        
    }

    setupDropdown('schedule-btn', `
        <div class="full-schedule-container">
            <a href="#schedule" id="full-schedule-btn">Full schedule &gt;</a>
        </div>
        <div id="schedule-content">
            <!-- Schedule content goes here -->
        </div>
    `);

    setupDropdown('latest-btn', `
        <div class="latest-nav-div">
            <nav>
                <ul>
                    <li><a href="#" id="latest-btn">Latest</a></li>
                    <li><a href="#" id="tech-news-btn">Tech news</a></li>
                    <li><a href="#" id="more-btn">Read more</a></li>
                </ul>
            </nav>
        </div>
            <div id="news-content">
                <!-- Latest news content goes here -->
            </div>
        
    `);

    setupDropdown('result-btn', `
        <div class="result-nav-div">
            <a href="/news/raceresult.html">See more &gt;</a></li>
        </div>
        <div id="result-content">
            <h3>Race results</h3>
            <!-- Race results content goes here -->
        </div>
    `);
});
