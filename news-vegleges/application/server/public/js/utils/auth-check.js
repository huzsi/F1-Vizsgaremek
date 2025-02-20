document.addEventListener('DOMContentLoaded', () => {
    const topNav = document.getElementById('topNav');
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const permission = localStorage.getItem('permission');

    if (token) {
        // Token van, le kérjük a profil adatokat
        fetch('/get-profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`  // Bearer token
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.usernames && data.emails && data.permission) {
                let navLinks = `
                    <ul>
                        <li><a href="/index.html" class="active">Home</a></li>
                        <li><a href="">Stats</a></li>
                        <li><a href="/about.html">About</a></li>
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
                            <a href="#" id="profileBtn">${username}</a>
                            <ul class="Profile-dropdown-content" id="dropdownContent" style="display: none;">
                                <li><a href="/profile.html">View Profile</a></li>
                                <li><a href="#" id="logoutBtn">Logout</a></li>
                            </ul>
                        </li>
                    </ul>
                `;
                
                topNav.innerHTML = navLinks;
                const profileBtn = document.getElementById("profileBtn");
                const dropdownContent = document.getElementById("dropdownContent");
       
                const createBtn = document.getElementById('news-creator-btn');
                const resultBtn = document.getElementById('uploader-btn');
                 // About button doesn't require login
                 
                if(resultBtn){
                    resultBtn.addEventListener('click', () => {
                        window.location.href = "/script-layout.html/result-uploader";
                    });
                }
                // News-creator button requires login
                if (createBtn) {
                    createBtn.addEventListener('click', () => {
                        if (!token) {
                            alert("Please log in first.");
                            window.location.href = "/auth.html"; // Redirect to login page
                        } else {
                            window.location.href = "/script-layout.html/news-creator";
                        }
                    });
                }

                // Profile button requires login
                profileBtn.addEventListener("click", (event) => {
                    event.preventDefault();
                    if (!token) {
                        alert("Please log in first.");
                        window.location.href = "/auth.html"; // Redirect to login page
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
                    window.location.href = "/index.html"; // Újratöltés
                });
            }
        })
        .catch(error => {
            console.error('Error fetching profile:', error);
        });
    } else {
        // Ha nincs token, akkor a nem bejelentkezett menü
        topNav.innerHTML = `
            <ul>
                <li><a href="/index.html" class="active">Home</a></li>
                <li><a href="/about.html">About</a></li>
            </ul>
            <ul>
                <li><a href="/auth.html">Login</a></li>
                <li><a href="/auth.html">Register</a></li>
            </ul>
        `;
    }
});
