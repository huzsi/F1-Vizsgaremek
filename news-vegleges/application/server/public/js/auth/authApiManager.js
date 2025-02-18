// Regisztrációs űrlap kezelése
document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message); // Ez az alert a regisztrációs üzenetet mutatja
    })
    .catch(error => alert('Registration failed: ' + error));
});

// Bejelentkezési űrlap kezelése
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token); // Token tárolása
            window.location.href = '/';
        } else {
            alert('Login failed: ' + data.message);
        }
    })
    .catch(error => {
        alert('Login failed: ' + error);
    });
});

