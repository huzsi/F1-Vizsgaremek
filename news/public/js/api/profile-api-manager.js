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
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const profileDataContent = document.getElementById('profile-datas');

    if (!profileDataContent) {
        console.error('Hiba: Az "profile-datas" elem nem található.');
        return;
    }
    // Ellenőrizni, hogy a token nem üres-e
    if (token && token.trim() !== "") {
      

        try {
            const response = await fetch('/news/get-profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`  // Bearer token
                }
            });

            const data = await response.json();
            if (data.username && data.email) {
                const { username, email } = data;

                // Profil adatok betöltése
                profileDataContent.innerHTML = `
                        <h1>Your Profile</h1>
                        <div class="username-div">
                            <h3>Username:</h3>
                            <p>${username}</p>
                        </div>
                        <div class="email-div">
                            <h3>Email:</h3>
                            <p>${email}</p>  
                        </div>
                `; 
                // Módosítások mentése
                document.getElementById('save-username').addEventListener('click', () => updateProfile('/news/update-username', 'new-username', 'username'));
                document.getElementById('save-email').addEventListener('click', () => updateProfile('/news/update-email', 'new-email', 'email'));
                document.getElementById('save-password').addEventListener('click', () => updateProfile('/news/update-password', 'new-password', 'password'));

                // Kijelentkezés
                document.getElementById('logout').addEventListener('click', () => {
                    if(confirm("Are you sure you want to log out?")){
                        localStorage.removeItem('token') || sessionStorage.removeItem('token');
                        window.location.href = '/news/auth.html';
                    }
                });

                // Fiók törlése
                document.getElementById('delete-account').addEventListener('click', async () => {
                    // Kérjünk megerősítést a felhasználótól
                    const isConfirmed = confirm('Are you sure you want to delete your account? This action is irreversible.');
                
                    if (!isConfirmed) {
                        // Ha nem erősítette meg, kilépünk a törlés folyamatából
                        return;
                    }
                
                    try {
                        const response = await fetch('/news/delete-account', {
                            method: 'DELETE',
                            headers: { 'Authorization': `Bearer ${token}` } // Bearer típusú token
                        });
                
                        if (!response.ok) {
                            // Ha a válasz nem 200-as, akkor hibát dobunk
                            throw new Error('Failed to delete account. Please try again.');
                        } else {
                            // Ha sikerült törölni a fiókot
                            alert('Account removed successfully');
                            localStorage.removeItem('token') || sessionStorage.removeItem('token');
                            window.location.href = '/news/auth.html?form=login';
                        }
                
                        const data = await response.json();
                        console.log(data);
                        
                    } catch (error) {
                        console.error('Error deleting account:', error);
                        // Ha valami hiba történik a kérés közben
                        alert(`Error: ${error.message}`);
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
        profileDataContent.innerHTML = `<p>Nincs bejelentkezve.</p>`;
    }

    async function updateProfile(apiEndpoint, inputId, fieldName) {
        const newValue = document.getElementById(inputId).value;
        try {
            const response = await fetch(apiEndpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ [fieldName]: newValue })
            });
    
            const data = await response.json();
            console.log(data); // Ha szükséges, itt látod a válasz részleteit
    
            // Az affectedRows vagy changedRows alapján ellenőrizzük a sikerességet
            if (data.affectedRows && data.affectedRows > 0) {
                alert(`${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} updated successfully.`);
                location.reload();
            } else {
                alert(`Failed to update ${fieldName}. The value might be the same as before.`);
            }
        } catch (error) {
            console.error(`Error updating ${fieldName}:`, error);
            alert('An error occurred while updating. Please try again.');
        }
    }
    
    
    
    
});


document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const profileDataContent = document.getElementById('profile-datas');

    if (token && token.trim() !== "") {
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
                    <div>
                        <h3>Admin Panel</h3>
                        <form>
                            <p>Give Permission</p>
                            <div>
                                <h4>Choose Profile</h4>
                                <select id="profile-select"></select>
                            </div>
                            <div>
                                <h4>Permission level</h4>
                                <select id="permission-select">
                                    <option value="1">admin</option>
                                    <option value="2">Moderator</option>
                                    <option value="3">User</option>
                                </select>
                            </div>
                            <button id="submit">Submit changes</button>                    
                        </form>
                    </div>

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
                    if(user.id > 0){
                        profileSelect.innerHTML += `
                        <option value="${user.id}">${user.username}</option>
                    `;
                    }
                });

                document.getElementById('submit').addEventListener('click', async (event) => {
                    event.preventDefault();
                    const selectedProfile = document.getElementById('profile-select').value;
                    const selectedPermission = document.getElementById('permission-select').value;

                    if (confirm('Are you sure you want to update the permission of the selected profile?')) {
                        try {
                            const response = await fetch('/news/update-permission', {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`  // Bearer token
                                },
                                body: JSON.stringify({
                                    id: selectedProfile,
                                    permission: selectedPermission
                                })
                            });

                            const data = await response.json();
                            alert('Permission successfully updated');
                        } catch (error) {
                            console.error('Error updating permission:', error);
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    } else {
        console.log("Nincs bejelentkezve");
    }
});
