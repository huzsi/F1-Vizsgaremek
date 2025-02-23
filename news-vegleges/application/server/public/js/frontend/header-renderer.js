document.addEventListener('DOMContentLoaded', () => {
    const headerContainer = document.getElementById('mainHeader');

    headerContainer.innerHTML += `
        
            <div class="logo">
                <h2><a href="/news/index.html">F1 News</a></h2>
            </div>
            <nav>
                <ul>
                    <li><a href="#" id="latest-btn">Latest</a></li>
                    <li><a href="#techNews">Tech news</a></li>
                    <li><a href="#" id="scheduleBtn">Schedule</a></li>
                    <li><a href="#standlist">Standlist</a></li>
                    
                </ul>
            </nav>
    `;
});