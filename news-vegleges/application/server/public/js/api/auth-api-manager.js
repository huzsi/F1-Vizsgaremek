/**--------------------------------------------------------------------
 * 
 * Login and Registration Handling
 * This script manages the user login and registration functionalities 
 * specifically used by the auth.html page.
 * 
 * --------------------------------------------------------------------
 * 
 * APIs:
 *      - /register (POST): Handles new user registration.
 *      - /login (POST): Handles user login.
 * 
 * --------------------------------------------------------------------
 * 
 * Important Notes:
 *      - The "permission" field for /register is set in the server.js file.
 *        By default, new users are assigned a permission level of 3.
 *        The admin profile can modify permissions for other users.
 * 
 *      - Password and token encryption is handled in server.js. Ensure
 *        appropriate security measures are in place.
 * 
 * --------------------------------------------------------------------
 * 
 * To-Do List (Older Version - Needs Further Development):
 *      - Allow login with a username (currently email-based).
 *      - Implement registration acceptance fields for terms and conditions.
 *      - Add password reminder functionality.
 *      - If time permits, integrate Google account registration/login.
 * 
 * --------------------------------------------------------------------
 * Created by: Krisztián Bartók
 * Last updated: 2025-02-20
 */

document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('/news/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password }) // NINCS permission küldve!
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message); // Regisztrációs üzenet megjelenítése
    })
    .catch(error => alert('Registration failed: ' + error));
});
// Bejelentkezési űrlap kezelése
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    fetch('/news/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            // Token és felhasználó adatainak elmentése
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            localStorage.setItem('permission', data.permission);

            // Átirányítás
            window.location.href = '/news/index.html';
        } else {
            alert('Login failed: ' + data.message);
        }
    })
    .catch(error => {
        alert('Login failed: ' + error);
    });
});
