document.addEventListener('DOMContentLoaded', () => {
    const topNav = document.getElementById('topNav');
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const permission = localStorage.getItem('permission');
    console.log('token:', token, 'username:', username, 'permission:', permission);
 
    if (token && token.trim() !== "" ) {
        // Token van, le kérjük a profil adatokat
        fetch('/news/get-profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`  // Bearer token
            }
        })
        .then(response => {
            console.log('response status:', response.status);
            if (!response.ok) {
                throw new Error('Authorization failed');
            }
            return response.json();
        })
        .then(data => {
            console.log('profile data:', data);
            if (data.usernames && data.emails && data.permission) {
                localStorage.setItem('permission', data.permission); // permission érték beállítása

                let navLinks = `
                    <ul>
                        <li><a href="/news/index.html" class="active">Home</a></li>
                        <li><a href="">Stats</a></li>
                        <li><a href="/news/about.html">About</a></li>
                `;
                
                // Jogosultságok alapján
                if (data.permission <= 2) {
                    navLinks += `<li><a href="#" id="news-creator-btn">Create</a></li>`;
                }

                if (data.permission === 1) {
                    navLinks += `<li><a href="#" id="uploader-btn">Result</a></li>`;
                }

                navLinks += `</ul>`;

                // Profil és kijelentkezés
                navLinks += `
                    <ul class="Profile-dropdown">
                        <li>
                            <a href="#" id="profileBtn">${data.usernames}</a>
                            <ul class="Profile-dropdown-content" id="dropdownContent" style="display: none;">
                                <li><a href="/news/profile.html">View Profile</a></li>
                                <li><a href="#" id="logoutBtn">Logout</a></li>
                            </ul>
                        </li>
                    </ul>
                `;
                
                topNav.innerHTML = navLinks;
                console.log('navLinks:', navLinks);
                const profileBtn = document.getElementById("profileBtn");
                const dropdownContent = document.getElementById("dropdownContent");
                console.log('profileBtn:', profileBtn, 'dropdownContent:', dropdownContent);
       
                const createBtn = document.getElementById('news-creator-btn');
                const resultBtn = document.getElementById('uploader-btn');
                 // About button doesn't require login
                 
                if (resultBtn) {
                    resultBtn.addEventListener('click', () => {
                        window.location.href = "/news/script-layout.html/result-uploader";
                    });
                }
                // News-creator button requires login
                if (createBtn) {
                    createBtn.addEventListener('click', () => {
                        if (!token) {
                            alert("Please log in first.");
                            window.location.href = "/news/auth.html"; // Redirect to login page
                        } else {
                            window.location.href = "/news/script-layout.html/news-creator";
                        }
                    });
                }

                // Profile button requires login
                profileBtn.addEventListener("click", (event) => {
                    event.preventDefault();
                    if (!token) {
                        alert("Please log in first.");
                        window.location.href = "/news/auth.html"; // Redirect to login page
                    } else {
                        if (dropdownContent.style.display === "none" || dropdownContent.style.display === "") {
                            dropdownContent.style.display = "block";
                        } else {
                            dropdownContent.style.display = "none";
                        }
                    }
                });

                // Close the dropdown if clicked elsewhere
                document.addEventListener("click", function(event) {
                    if (!profileBtn.contains(event.target) && !dropdownContent.contains(event.target)) {
                        dropdownContent.style.display = "none";
                    }
                });
                // Kijelentkezés kezelése
                document.getElementById("logoutBtn").addEventListener("click", () => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("username");
                    localStorage.removeItem("permission");
                    window.location.href = "/news/index.html"; // Újratöltés
                });
            }
        })
        .catch(error => {
            console.error('Error fetching profile:', error);
            topNav.innerHTML = `
                <ul>
                    <li><a href="/news/index.html" class="active">Home</a></li>
                    <li><a href="#">Stats</a></li>
                    <li><a href="/news/about.html">About</a></li>
                </ul>
                <ul>
                    <li><a href="/news/auth.html">Login</a></li>
                    <li><a href="/news/auth.html">Register</a></li>
                </ul>
            `;
        });
    } else {
        // Ha nincs token, akkor a nem bejelentkezett menü
        topNav.innerHTML = `
            <ul>
                <li><a href="/news/index.html" class="active">Home</a></li>
                <li><a href="#">Stats</a></li>
                <li><a href="/news/about.html">About</a></li>
            </ul>
            <ul>
                <li><a href="/news/auth.html">Login</a></li>
                <li><a href="/news/auth.html">Register</a></li>
            </ul>
        `;
    }
});
