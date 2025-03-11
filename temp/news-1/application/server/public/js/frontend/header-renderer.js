document.addEventListener('DOMContentLoaded', () => {
    const headerContainer = document.querySelector('header');

    headerContainer.innerHTML += `
        
            <div class="logo">
                <h2><a href="/news/index.html">F1 News</a></h2>
            </div>
            <nav>
                <ul>
                    <li><a href="#" id="latest-btn">Latest</a></li>
                    <li><a href="#" id="schedule-btn">Schedule</a></li>
                    <li><a href="#" id="result-btn">Results</a></li>
                    <li><a href="#standlist">Standlist</a></li>
                </ul>
            </nav>
    `;
});