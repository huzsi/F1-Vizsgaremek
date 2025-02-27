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

            console.log('Login successful:', data); // Ellenőrzéshez

            // Átirányítás
            window.location.href = '/news/index.html';
        } else {
            alert('Login failed: ' + data.message);
            console.log('Login failed:', data); // Hibák logolása
        }
    })
    .catch(error => {
        alert('Login failed: ' + error);
        console.log('Login error:', error); // Hibák logolása
    });
});
