/**--------------------------------------------------------------------
 * 
 * Dynamic Dropdown Menu for Navigation with Custom Content on Click
 * This script handles the creation of dropdown menus for the top navigation, 
 * where each menu dynamically updates its content and provides an interactive 
 * experience for the user.
 * 
 * --------------------------------------------------------------------
 * 
 * Features:
 *      1. **Dropdown Menu Setup:**
 *         - The script adds dropdown menus that display specific content when clicked.
 *         - Each menu (for "Schedule", "Latest", and "Results") has its own specific content, 
 *           which is dynamically injected into the dropdown on each click.
 * 
 *      2. **Active State Handling:**
 *         - When a menu button is clicked, it becomes "active", and the background color of the 
 *           navigation and header changes to indicate that the dropdown is open.
 *         - If the same menu button is clicked again, it will close the dropdown and revert the background.
 * 
 *      3. **Mouse Hover Effect:**
 *         - When the user hovers over the dropdown content, the content remains visible, ensuring a smooth interaction.
 * 
 * --------------------------------------------------------------------
 * 
 * Event Handlers:
 *      - **Button Click:** Toggles the visibility of the dropdown content. 
 *        If the same button is clicked again, it will close the dropdown and reset styles.
 *      - **Mouse Enter on Dropdown:** Ensures the dropdown content stays visible when the user hovers over it.
 * 
 * --------------------------------------------------------------------
 * 
 * DOM Structure:
 *      - **Buttons for Menu Items:** There are three buttons for "Schedule", "Latest", and "Results".
 *      - **Dropdown Content:** The content inside each dropdown is dynamically injected based on which 
 *        button is clicked.
 *      - **Top Navigation and Header Styling:** The background colors of these elements change when a 
 *        dropdown is opened and revert when closed.
 * 
 * --------------------------------------------------------------------
 * 
 * Key Functions:
 *      - **setupDropdown:** This function is responsible for initializing each dropdown menu.
 *        It takes two arguments:
 *          - `btnId`: The ID of the button that triggers the dropdown.
 *          - `content`: The HTML content to be injected into the dropdown when the button is clicked.
 * 
 * --------------------------------------------------------------------
 * Created by: Krisztián Ináncsi
 * Last updated: 2025-01-21
 */
document.addEventListener('DOMContentLoaded', () => {
    const topNav = document.getElementById('top-nav');
    const header = document.querySelector('header');
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
                    <li><a href="#" id="dropdown-latest-btn">Daily News</a></li>
                    <li><a href="#" id="dropdown-tech-news-btn">Tech news</a></li>
                    <li><a href="/news/news-layout.html/news" id="more-btn">Read more</a></li>
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
