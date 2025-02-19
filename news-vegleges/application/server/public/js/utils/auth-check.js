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
                        <li><a href="#" id="about-btn">About</a></li>
                        <li><a href="#" id="news-creator-btn">Create</a></li>
                        <li><a href="#" id="uploader-btn">Result</a></li>
                    </ul>
                    <ul class="Profile-dropdown">
                        <li>
                            <a href="#" id="profileBtn">Profile</a>
                            <ul class="Profile-dropdown-content" id="dropdownContent" style="display: none;">
                                <li><a href="#" id="viewProfileBtn">Profile View</a></li>
                                <li>
                                    <p>Dark mode</p>
                                    <label class="switch">
                                        
                                        <input type="checkbox">
                                        <span class="slider"></span>
                                    </label>
                                </li>
                                <li><a href="#">Help Center</a></li>
                                <li><a href="#" id="logoutBtn">Log Out</a></li>
                                
                            </ul>
                        </li>
                    </ul>
                `;

                const profileBtn = document.getElementById("profileBtn");
                const dropdownContent = document.getElementById("dropdownContent");
                const aboutBtn = document.getElementById('about-btn');
                const createBtn = document.getElementById('news-creator-btn');
                const resultBtn = document.getElementById('uploader-btn');
                 // About button doesn't require login
                 if (aboutBtn) {
                    aboutBtn.addEventListener('click', () => {
                        window.location.href = "/layout.html/about"; // This works regardless of login status
                    });
                }
                if(resultBtn){
                    resultBtn.addEventListener('click', () => {
                        window.location.href = "/layout.html/result-uploader";
                    });
                }

                // News-creator button requires login
                if (createBtn) {
                    createBtn.addEventListener('click', () => {
                        if (!token) {
                            alert("Please log in first.");
                            window.location.href = "/auth.html"; // Redirect to login page
                        } else {
                            window.location.href = "/layout.html/news-creator";
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

                // Log out
                document.getElementById("logoutBtn").addEventListener("click", () => {
                    localStorage.removeItem("token"); // Remove token
                    window.location.href = "index.html"; // Redirect to the home page
                });

                // Profile View redirect
                document.getElementById("viewProfileBtn").addEventListener("click", () => {
                    window.location.href = "/layout.html/profile"; // Redirect to profile view
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
        const aboutBtn = document.getElementById('about-btn');
         // About button doesn't require login
         if (aboutBtn) {
            aboutBtn.addEventListener('click', () => {
                window.location.href = "/layout.html/about"; // This works regardless of login status
            });
        }

    }

    // If not logged in, show this menu
    function showLoggedOutNav() {
        topNav.innerHTML = `
            <ul>
                <li><a href="/index.html" class="active">Home</a></li>
                <li><a href="https://f1statsandnews.com/fooldal">Stats</a></li>
                <li><a href="#" id="about-btn">About</a></li>
            </ul>
            <ul>
                <li><a href="/auth.html">Login</a></li>
                <li><a href="/auth.html">Register</a></li>
            </ul>
        `;
    }
});
