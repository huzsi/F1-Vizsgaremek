/**--------------------------------------------------------------------
 * 
 * Dynamic Tab Switching with Active Button and Section Visibility
 * This script manages the dynamic visibility of different sections on a page 
 * based on user interaction with navigation buttons. The content associated 
 * with each button is displayed, while other content is hidden.
 * 
 * --------------------------------------------------------------------
 * 
 * Features:
 *      1. **Dynamic Tab Navigation:**
 *         - The script provides a tabbed navigation system where buttons switch between different sections.
 *         - For each page (index.html, tracks.html, and auth.html), there are different sets of buttons 
 *           that control which content is shown and which is hidden when clicked.
 * 
 *      2. **Active Button State:**
 *         - When a user clicks a button, the button is marked as "active", and the corresponding content section is displayed.
 *         - If the same button is clicked again, it will hide the content and reset the active state.
 *         - The background color of the active button is visually indicated by adding a class for better UX.
 * 
 *      3. **Page-Specific Button Sets:**
 *         - The script tailors the button functionality for different pages (`index.html`, `tracks.html`, and `auth.html`).
 *         - Each page has its own set of buttons, and depending on the page, different sections are shown or hidden.
 * 
 * --------------------------------------------------------------------
 * 
 * Event Handlers:
 *      - **Button Click:** Toggles the visibility of the corresponding content section.
 *        If the same button is clicked again, it hides the content and resets styles.
 *      - **Active Button:** The clicked button is marked as "active", while other buttons are reset.
 * 
 * --------------------------------------------------------------------
 * 
 * DOM Structure:
 *      - **Navigation Buttons:** There are buttons for each category, such as "driver-standlist-btn" or "circuit-btn".
 *      - **Content Sections:** For each button, there are corresponding content sections, such as `driver-standlist-table` or `event-container`.
 *      - **Active Button Styling:** Active buttons have a class added to highlight them visually.
 * 
 * --------------------------------------------------------------------
 * 
 * Key Functions:
 *      - **setActiveButton:** Marks the active button and removes the active state from other buttons.
 *      - **Event Listener Setup:** Sets up event listeners for each button on the current page to toggle content visibility.
 * 
 * --------------------------------------------------------------------
 * Created by: Krisztián Ináncsi
 * Last updated: 2025-03-03
 */
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    const buttonSets = {
        'index.html': [
            { btn: 'driver-standlist-btn', show: 'driver-standlist-table', hide: ['constructor-standlist-table', 'race-result-table'] },
            { btn: 'constructor-standlist-btn', show: 'constructor-standlist-table', hide: ['driver-standlist-table', 'race-result-table'] },
            { btn: 'race-result-btn', show: 'race-result-table', hide: ['driver-standlist-table', 'constructor-standlist-table'] }
        ],
        'tracks.html': [
            { btn: 'circuit-btn', show: 'circuit-datas-content', hide: ['last-winners-content', 'event-container'] },
            { btn: 'winners-btn', show: 'last-winners-content', hide: ['circuit-datas-content', 'event-container'] },
            { btn: 'event-btn', show: 'event-container', hide: ['circuit-datas-content', 'last-winners-content'] }
        ],
        'auth.html': [
            { btn: 'login-btn', show: 'login-section', hide: ['register-section', 'register-headline'] },
            { btn: 'register-btn', show: 'register-section', hide: ['login-section', 'register-headline'] },
            { btn: 'headline-btn', show: 'register-section', hide: ['login-section', 'register-headline'] }
        ]
    };

    Object.keys(buttonSets).forEach(page => {
        if (path.endsWith(page)) {
            buttonSets[page].forEach(({ btn, show, hide }) => {
                const button = document.getElementById(btn);
                const showElement = document.getElementById(show);
                const hideElements = hide.map(id => document.getElementById(id));

                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    showElement.classList.remove('hidden');
                    hideElements.forEach(el => el.classList.add('hidden'));
                    setActiveButton(button, buttonSets[page].map(({ btn }) => document.getElementById(btn)));
                });
            });
        }
    });

    function setActiveButton(activeBtn, btnGroup) {
        btnGroup.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }
});
