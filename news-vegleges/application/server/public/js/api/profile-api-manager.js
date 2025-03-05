/**--------------------------------------------------------------------
 * 
 * Profile data and settings and admin panel display code.
 * Functionalities:
 *      - Permission assignment.
 *      - Profile deletion.
 * 
 * The code is used only by profile.html.
 * 
 * --------------------------------------------------------------------
 * 
 * APIs used by the code:
 *      - /news/get-profile (GET)
 *      - /news/delete-account (DELETE)
 *      - /news/update-username (PUT)
 *      - /news/update-email (PUT)
 *      - /news/update-password (PUT)
 *      - /news/get-all-profiles (GET)
 * 
 * --------------------------------------------------------------------
 * 
 * Due to permissions, the token created during login needs to be encrypted.
 * As a result, the page will not have default access to profile-related APIs.
 * The following headers need to be set during fetch requests:
 *              headers: {
 *                  'Authorization': `Bearer ${token}`  // Bearer token
 *              }
 * 
 * --------------------------------------------------------------------
 * Created by: Krisztián Bartók
 * Last updated: 2025-03-02
 */

 document.addEventListener('DOMContentLoaded', async () => {
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

        try {
            const response = await fetch('/news/get-profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`  // Bearer token
                }
            });

            const data = await response.json();
            console.log('Profile data:', data);  // Az API válasza

            if (data.usernames && data.emails) {
                const { usernames, emails } = data;

                // Profil adatok betöltése
                profileDataContent.innerHTML = `
                        <h1>Your Profile</h1>
                        <div class="username-div">
                            <h3>Username:</h3>
                            <p>${usernames}</p>
                        </div>
                        <div class="email-div">
                            <h3>Email:</h3>
                            <p>${emails}</p>  
                        </div>
                        <div>
                            <h3>Last interactions:</h3>
                            <ul>
                                <li><a href="#">Interaction1</a></li>
                                <li><a href="#">Interaction2</a></li>
                                <li><a href="#">Interaction3</a></li>
                                <li><a href="#">Interaction4</a></li>
                            </ul>
                        </div>  
                        `;

                // Módosítások mentése
                document.getElementById('save-username').addEventListener('click', () => updateProfile('/news/update-username', 'new-username', 'username'));
                document.getElementById('save-email').addEventListener('click', () => updateProfile('/news/update-email', 'new-email', 'email'));
                document.getElementById('save-password').addEventListener('click', () => updateProfile('/news/update-password', 'new-password', 'password'));

                // Kijelentkezés
                document.getElementById('logout').addEventListener('click', () => {
                    localStorage.removeItem('token');
                    window.location.href = '/news/auth.html';
                });

                // Fiók törlése
                document.getElementById('delete-account').addEventListener('click', async () => {
                    try {
                        const response = await fetch('/news/delete-account', {
                            method: 'DELETE',
                            headers: { 'Authorization': `Bearer ${token}` } // Bearer típusú token
                        });
                        const data = await response.json();
                        alert(data.message);
                        if (data.success) {
                            localStorage.removeItem('token');
                            window.location.href = '/news/auth.html';
                        }
                    } catch (error) {
                        console.error('Error deleting account:', error);
                    }
                });

            } else {
                profileDataContent.innerHTML = `<p>Nincs bejelentkezve.</p>`;
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
            profileDataContent.innerHTML = `<p>Hiba történt az adatok lekérésekor.</p>`;
        }
    } else {
        console.log('Nincs token vagy a token üres!');
        profileDataContent.innerHTML = `<p>Nincs bejelentkezve.</p>`;
    }

    async function updateProfile(apiEndpoint, inputId, fieldName) {
        const newValue = document.getElementById(inputId).value;
        try {
            const response = await fetch(apiEndpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Bearer típusú token
                },
                body: JSON.stringify({ [fieldName]: newValue })
            });

            const data = await response.json();
            alert(data.message);
            if (data.success) {
                location.reload();
            }
        } catch (error) {
            console.error(`Error updating ${fieldName}:`, error);
        }
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const profileDataContent = document.getElementById('profile-datas');

    if (token && token.trim() != "") {
        try {
            const response = await fetch('/news/get-profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`  // Bearer token
                }
            });

            const userData = await response.json();
            if (userData.permission == 1) {
                profileDataContent.innerHTML += `
                    <hr>
                    <h3>Admin Panel</h3>
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
                                        <select id="permission-select">
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
                const profileResponse = await fetch('/news/get-all-profiles', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`  // Bearer token
                    }
                });

                const datas = await profileResponse.json();
                const profileSelect = document.getElementById('profile-select');

                datas.forEach(user => {
                    profileSelect.innerHTML += `
                        <option>${user.usernames}</option>
                    `;
                });
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    } else {
        console.log("Nincs bejelentkezve");
    }
});
