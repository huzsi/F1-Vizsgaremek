document.addEventListener('DOMContentLoaded', () => {
    const topNav = document.getElementById('topNav');
    const token = localStorage.getItem('token');

    if (token) {
        fetch('/check-auth', {
            headers: {
                'Authorization': token
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                topNav.innerHTML = `
                    <ul>
                        <li><a href="/" class="active">Home</a></li>
                        <li><a href="https://f1statsandnews.com/fooldal">Stats</a></li>
                        <li><a href="about.html">About</a></li>
                    </ul>
                    <ul>
                        <li><a href="profile.html">Profile</a></li>
                    </ul>
                `;
            } else {
                topNav.innerHTML = `
                    <ul>
                        <li><a href="/" class="active">Home</a></li>
                        <li><a href="https://f1statsandnews.com/fooldal">Stats</a></li>
                        <li><a href="about.html">About</a></li>
                    </ul>
                    <ul>
                        <li><a href="auth.html">Login</a></li>
                        <li><a href="auth.html">Register</a></li>
                    </ul>
                `;
            }
        })
        .catch(error => {
            console.error('Error checking auth status:', error);
            topNav.innerHTML = `
                <ul>
                    <li><a href="/" class="active">Home</a></li>
                    <li><a href="https://f1statsandnews.com/fooldal">Stats</a></li>
                    <li><a href="about.html">About</a></li>
                </ul>
                <ul>
                    <li><a href="auth.html">Login</a></li>
                    <li><a href="auth.html">Register</a></li>
                </ul>
            `;
        });
    } else {
        topNav.innerHTML = `
            <ul>
                <li><a href="/" class="active">Home</a></li>
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
