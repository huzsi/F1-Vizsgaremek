document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const mainContent = document.getElementById('main-content');

    if (token) {
        fetch('/get-profile', {
            headers: {
                'Authorization': token
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.usernames && data.emails && data.passwords) {
                const { usernames, emails, passwords } = data;

                // Profil adatok betöltése
                mainContent.innerHTML = `
                    <section class="profile-datas-container">
                        <h1>Your Profile</h1>
                        <div class="username-div">
                            <h3>Username</h3>
                            <p>${usernames}</p>
                        </div>
                        <div class="email-div">
                            <h3>Email</h3>
                            <p>${emails}</p>  
                        </div>
                       
                    </section>
                    <section class="settings-container">
                        <h2>Settings</h2>
                        <form id="settings-form">
                            <div>
                                <p id="profile-picture">Select profile picture</p>
                                <input type="file" id="profile-picture" name="profile-picture">
                            </div>
                            <div class="username-div">
                                <h3>Change username</h3>
                                <input type="text" id="new-username" name="new-username" placeholder="New Username">
                                <button id="save-username">Save Username</button>
                            </div>
                            <div class="email-div">
                                <h3>Change email</h3>
                                <input type="email" id="new-email" name="new-email" placeholder="New Email">
                                <button id="save-email">Save Email</button>
                            </div>
                            <div class="password-div">
                                <h3>Change Password</h3>
                                <input type="password" id="new-password" name="new-password" placeholder="New Password">
                                <button id="save-password">Save Password</button>
                            </div>
                        </form>
                        <nav>
                            <ul>
                                <li id="logout">Log out</li>
                                <li id="delete-account">Delete account</li>
                            </ul>
                        </nav>
                    </section>
                `;

                // Eseménykezelők a mentés gombokhoz
                document.getElementById('save-username').addEventListener('click', () => {
                    const newUsername = document.getElementById('new-username').value;

                    fetch('/update-username', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token
                        },
                        body: JSON.stringify({ username: newUsername })
                    })
                    .then(response => response.json())
                    .then(data => {
                        alert(data.message);
                        if (data.success) {
                            location.reload();
                        }
                    })
                    .catch(error => console.error('Error updating username:', error));
                });

                document.getElementById('save-email').addEventListener('click', () => {
                    const newEmail = document.getElementById('new-email').value;

                    fetch('/update-email', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token
                        },
                        body: JSON.stringify({ email: newEmail })
                    })
                    .then(response => response.json())
                    .then(data => {
                        alert(data.message);
                        if (data.success) {
                            location.reload();
                        }
                    })
                    .catch(error => console.error('Error updating email:', error));
                });

                document.getElementById('save-password').addEventListener('click', () => {
                    const newPassword = document.getElementById('new-password').value;

                    fetch('/update-password', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token
                        },
                        body: JSON.stringify({ password: newPassword })
                    })
                    .then(response => response.json())
                    .then(data => {
                        alert(data.message);
                        if (data.success) {
                            location.reload();
                        }
                    })
                    .catch(error => console.error('Error updating password:', error));
                });

                // Log out és Delete account események kezelése
                document.getElementById('logout').addEventListener('click', () => {
                    localStorage.removeItem('token');
                    window.location.href = '/auth.html';
                });

                document.getElementById('delete-account').addEventListener('click', () => {
                    fetch('/delete-account', {
                        method: 'DELETE',
                        headers: {
                            'Authorization': token
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        alert(data.message);
                        if (data.success) {
                            localStorage.removeItem('token');
                            window.location.href = '/auth.html';
                        }
                    })
                    .catch(error => console.error('Error deleting account:', error));
                });

            } else {
                mainContent.innerHTML = `<p>Nincs bejelentkezve.</p>`;
            }
        })
        .catch(error => {
            console.error('Error fetching profile data:', error);
            mainContent.innerHTML = `<p>Hiba történt az adatok lekérésekor.</p>`;
        });
    } else {
        mainContent.innerHTML = `<p>Nincs bejelentkezve.</p>`;
    }
});
