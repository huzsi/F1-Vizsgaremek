console.log('JavaScript fájl betöltődött'); // Ellenőrizni, hogy betöltődik a fájl

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded esemény kiváltva'); // Ellenőrizni, hogy a DOM teljesen betöltődött

    const token = localStorage.getItem('token');
    const profileDataContent = document.getElementById('profile-datas');

    if (!profileDataContent) {
        console.error('Hiba: Az "profile-datas" elem nem található.');
        return;
    }

    // Ellenőrizzük, hogy van-e token
    console.log('Token:', token);  // Ellenőrizd a token tartalmát

    // Ellenőrizni, hogy a token nem üres-e
    if (token && token.trim() !== "") {
        console.log("Token érvényes:", token);

        fetch('/news/get-profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`  // Bearer token
            }
        })
        .then(response => {
            console.log('Response status:', response.status);  // Státusz kód
            return response.json();
        })
        .then(data => {
            console.log('Profile data:', data);  // Az API válasza

            // Itt már az új válasz formátumát kell használni
            if (data.usernames && data.emails) {
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
                    window.location.href = '/news/auth.html';
                });

                // Fiók törlése
                document.getElementById('delete-account').addEventListener('click', () => {
                    fetch('/news/delete-account', {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` } // Bearer típusú token
                    })
                    .then(response => response.json())
                    .then(data => {
                        alert(data.message);
                        if (data.success) {
                            localStorage.removeItem('token');
                            window.location.href = '/news/auth.html';
                        }
                    })
                    .catch(error => console.error('Error deleting account:', error));
                });

            } else {
                profileDataContent.innerHTML = `<p>Nincs bejelentkezve.</p>`;
            }
        })
        .catch(error => {
            console.error('Error fetching profile data:', error);
            profileDataContent.innerHTML = `<p>Hiba történt az adatok lekérésekor.</p>`;
        });
    } else {
        console.log('Nincs token vagy a token üres!');
        profileDataContent.innerHTML = `<p>Nincs bejelentkezve.</p>`;
    }

    // Külön függvény az adatok mentéséhez
    function updateProfile(apiEndpoint, inputId, fieldName) {
        const newValue = document.getElementById(inputId).value;

        fetch(apiEndpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Bearer típusú token
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
//Admin panel:
document.addEventListener('DOMContentLoaded', () => {
        const token = localStorage.getItem('token');
        const profileDataContent = document.getElementById('profile-datas');

        //Jogosultság ellenőrzése. Csak az admin profil fogja látni az oldalon
        if(token){
            fetch('/news/get-profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`  // Bearer token
                }
            })
            .then(response => {
                return response.json();
            })
            .then(userData => {
                if(userData.permission == 1){
                    profileDataContent.innerHTML +=`
                        <hr>
                        <h3>Admin Panel </h3>
                        <form>
                            <div>
                                <p>Give Permission</p>
                                <table>
                                    <tr>
                                        <th>Choose Profile</th>
                                        <th>Permission level</th>
                                    </tr>
                                    <tr>
                                        <td><select id="profile-select"></select></td>
                                        <td>
                                            <select id="permisson-select">
                                                <option>admin</option>
                                                <option>Moderator</option>
                                                <option>User</option>
                                            </select>
                                        </td>
                                    </tr>
                                </table>
                                <button id="submit">Submit changes</button>
                            </div>
                        </form>
                    `;
                    //minden profil betöltése a select menübe (Másik API végpont)
                    fetch('/news/get-profiles')
                        .then(response => response.json())
                        .then(datas => {
                            const profileSelect = document.getElementById('profile-select');

                            datas.forEach( user  => {
                                profileSelect.innerHTML += `
                                    <option>${user.usernames}</option>
                            `;
                             });
                             //submit gomb eseménykezelője

                        })
                        .catch(error => {
                            console.error('Error fetching profile data:', error);
                        });
                    }
                })
            .catch(error => {
                console.error('Error fetching profile data:', error);
            });
        }
        else{
            console.log("Nincs bejelentkezve")
        }
});