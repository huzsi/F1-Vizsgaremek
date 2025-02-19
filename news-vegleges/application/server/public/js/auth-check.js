document.addEventListener('DOMContentLoaded', () => {
    const topNav = document.getElementById('topNav');
    const token = localStorage.getItem('token');

    if (token) {
        fetch('/get-profile', {
            headers: {
                'Authorization': token
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.usernames && data.emails && data.passwords) {
                topNav.innerHTML = `
                    <ul>
                        <li><a href="/index.html" class="active">Home</a></li>
                        <li><a href="https://f1statsandnews.com/fooldal">Stats</a></li>
                        <li><a href="about.html">About</a></li>
                    </ul>
                    <ul class="Profile-dropdown">
                        <li>
                            <a href="#" id="profileBtn">Profile</a>
                            <ul class="Profile-dropdown-content" id="dropdownContent" style="display: none;">
                                <li><a href="#" id="viewProfileBtn">Profile View</a></li>
                                <li><a href="#">Profile Settings</a></li>
                                <li><a href="#">Help Center</a></li>
                                <li><a href="#" id="logoutBtn">Log Out</a></li>
                            </ul>
                        </li>
                    </ul>
                `;

                const profileBtn = document.getElementById("profileBtn");
                const dropdownContent = document.getElementById("dropdownContent");

                profileBtn.addEventListener("click", (event) => {
                    event.preventDefault();
                    if (dropdownContent.style.display === "none" || dropdownContent.style.display === "") {
                        dropdownContent.style.display = "block";
                    } else {
                        dropdownContent.style.display = "none";
                    }
                });

                // Bezárás, ha máshová kattintunk
                document.addEventListener("click", function(event) {
                    if (!profileBtn.contains(event.target) && !dropdownContent.contains(event.target)) {
                        dropdownContent.style.display = "none";
                    }
                });

                // Log out működés
                document.getElementById("logoutBtn").addEventListener("click", () => {
                    localStorage.removeItem("token"); // Token törlése
                    window.location.href = "index.html"; // Átirányítás a bejelentkezési oldalra
                });

                // Profile View átirányítás
                document.getElementById("viewProfileBtn").addEventListener("click", () => {
                    window.location.href = "default.html"; // Átirányítás a profil oldalra
                });

            } else {
                showLoggedOutNav();
            }
        })
        .catch(error => {
            console.error('Error checking auth status:', error);
            showLoggedOutNav();
        });
    } else {
        showLoggedOutNav();
    }

    // Ha nincs bejelentkezve, ezt a menüt jeleníti meg
    function showLoggedOutNav() {
        topNav.innerHTML = `
            <ul>
                <li><a href="/index.html" class="active">Home</a></li>
                <li><a href="https://f1statsandnews.com/fooldal">Stats</a></li>
                <li><a href="about.html">About</a></li>
            </ul>
            <ul>
                <li><a href="auth.html">Login</a></li>
                <li><a href="auth.html">Register</a></li>
            </ul>
        `;
    }
});
