/**--------------------------------------------------------------------
 * 
 * Dynamically generating the navigation menu based on user authentication status.
 * The top navigation bar is populated with different links depending on whether the user is logged in or not.
 * 
 * --------------------------------------------------------------------
 * 
 * APIs used:
 *      /news/get-profile - (GET)
 * 
 * --------------------------------------------------------------------
 * 
 * Data is loaded based on the presence of a valid token in localStorage.
 * 
 * Note: The token, username, and permission values are fetched from localStorage and used to build the navigation menu.
 * If a valid token is found, a request is made to fetch the user's profile data from the server.
 * 
 * In case of successful authentication:
 *      - A dynamic navigation menu is created.
 *      - The user's profile information is displayed in the menu.
 *      - Based on the user's permission level, different options are shown (e.g., Result upload, News creation).
 * 
 * In case of failed authentication or no token:
 *      - The menu only includes general options such as Home, Stats, About, and Login/Register.
 * 
 * The profile dropdown is displayed when the user clicks on their profile name and contains additional options like "View Profile", 
 * "Create News" (for users with permission), and "Logout".
 * 
 * --------------------------------------------------------------------
 * 
 * The async function fetches the profile data from the server and dynamically updates the navigation links.
 * The logout functionality is also included, allowing the user to log out and clear the stored authentication data.
 * 
 * --------------------------------------------------------------------
 * Created by: Krisztián Bartók
 * Last updated: 2025-02-20
 */
document.addEventListener('DOMContentLoaded', () => {
    const topNav = document.getElementById('top-nav');
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const currentPath = window.location.pathname;

    const getActiveClass = (path) => currentPath.includes(path) ? 'active' : '';

    let navLinks = `
        <ul class="underline-animation">
            <li><a href="/news/index.html" class="${getActiveClass('/news/index.html')}">Home</a></li>
            <li><a href="#" class="${getActiveClass('/news/stats.html')}">Stats</a></li>
            <li><a href="/news/about.html" class="${getActiveClass('/news/about.html')}">About</a></li>
            <li><a href="/news/forum-layout.html/index" class="${getActiveClass('/news/forum-layout.html/index')}">Forum</a></li>
        </ul>`;

    if (token && token.trim() !== "") {
        fetch('/news/get-profile', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
            if (!response.ok) throw new Error('Authorization failed');
            return response.json();
        })
        .then(data => {
            if (data.username && data.permission) {
                localStorage.setItem('permission', data.permission);

                navLinks += `
                <ul class="Profile-dropdown underline-animation">
                    <li>
                        <a href="#" id="profileBtn">${data.username}</a>
                        <ul class="Profile-dropdown-content" id="dropdownContent" style="display: none;">
                            <li><a href="/news/profile.html">View Profile</a></li>
                            ${data.permission === 1 ? '<li><a href="/news/result-uploader.html" id="uploader-btn">Result</a></li>' : ''}
                            <li><a href="#" id="logoutBtn">Logout</a></li>
                        </ul>
                    </li>
                </ul>`;
                
                topNav.innerHTML = navLinks;

                document.getElementById("profileBtn").addEventListener("click", (event) => {
                    event.preventDefault();
                    const dropdownContent = document.getElementById("dropdownContent");
                    dropdownContent.style.display = dropdownContent.style.display === "none" ? "block" : "none";
                });

                document.addEventListener("click", function(event) {
                    if (!document.getElementById("profileBtn").contains(event.target) && 
                        !document.getElementById("dropdownContent").contains(event.target)) {
                        document.getElementById("dropdownContent").style.display = "none";
                    }
                });

                document.getElementById("logoutBtn").addEventListener("click", () => {
                    if (confirm("Are you sure you want to log out?")) {
                        localStorage.removeItem("token") || sessionStorage.removeItem('token');
                        localStorage.removeItem("username");
                        localStorage.removeItem("permission");
                        window.location.href = "/news/index.html";
                    }
                });
               
            }
        })
        .catch(error => {
            console.error('Error fetching profile:', error);
            topNav.innerHTML = navLinks + `
            <ul class="underline-animation">
                <li><a href="/news/auth.html?form=login" id="nav-login-btn">Login</a></li>
                <li><a href="/news/auth.html?form=register" id="nav-register-btn">Register</a></li>
            </ul>`;
        });
    } else {
        topNav.innerHTML = navLinks + `
        <ul class="underline-animation">
            <li><a href="/news/auth.html?form=login" id="nav-login-btn">Login</a></li>
            <li><a href="/news/auth.html?form=register" id="nav-register-btn">Register</a></li>
        </ul>`;
    }
});