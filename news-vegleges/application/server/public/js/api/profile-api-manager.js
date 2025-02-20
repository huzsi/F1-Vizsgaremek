document.addEventListener('DOMContentLoaded', () => {
    // Ellenőrizzük, hogy a jelenlegi URL tartalmazza-e a "/profile" részt
    if (!window.location.pathname.includes('/profile')) {
        return; // Ha nem a profil oldal, akkor kilépünk a scriptből
    }

    const token = localStorage.getItem('token');
    const profileDataContent = document.getElementById('profile-datas');

    if (!profileDataContent) {
        console.error('Hiba: Az "profile-datas" elem nem található.');
        return;
    }

    if (token) {
        fetch('/get-profile', {
            headers: {
                'Authorization': token
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.usernames && data.emails && data.passwords) {
                const { usernames, emails } = data;

                // Profil adatok betöltése
                profileDataContent.innerHTML = `
                        <h1>Your Profile</h1>
                        <div class="username-div">
                            <h3>Username</h3>
                            <p>${usernames}</p>
                        </div>
                        <div class="email-div">
                            <h3>Email</h3>
                            <p>${emails}</p>  
                        </div>
                        <div>
                            <h3>Last interactions</h3>
                            <ul>
                                <li><a href="#">Interaction1</a></li>
                                <li><a href="#">Interaction2</a></li>
                                <li><a href="#">Interaction3</a></li>
                                <li><a href="#">Interaction4</a></li>
                            </ul>
                        </div>  
                        `;

                // Módosítások mentése
                document.getElementById('save-username').addEventListener('click', () => updateProfile('/update-username', 'new-username', 'username'));
                document.getElementById('save-email').addEventListener('click', () => updateProfile('/update-email', 'new-email', 'email'));
                document.getElementById('save-password').addEventListener('click', () => updateProfile('/update-password', 'new-password', 'password'));

                // Kijelentkezés
                document.getElementById('logout').addEventListener('click', () => {
                    localStorage.removeItem('token');
                    window.location.href = '/auth.html';
                });

                // Fiók törlése
                document.getElementById('delete-account').addEventListener('click', () => {
                    fetch('/delete-account', {
                        method: 'DELETE',
                        headers: { 'Authorization': token }
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

    // Külön függvény az adatok mentéséhez
    function updateProfile(apiEndpoint, inputId, fieldName) {
        const newValue = document.getElementById(inputId).value;

        fetch(apiEndpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ [fieldName]: newValue })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.success) {
                location.reload();
            }
        })
        .catch(error => console.error(`Error updating ${fieldName}:`, error));
    }
});
