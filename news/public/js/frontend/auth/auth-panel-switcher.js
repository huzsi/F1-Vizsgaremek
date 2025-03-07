document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-section');
    const registerForm = document.getElementById('register-section')
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const headlineBtn = document.getElementById('headlineBtn');
    loginBtn.addEventListener('click', (e) =>{
        e.preventDefault();
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        registerHeadline.classList.remove('hidden');
        
        setActiveButton(loginBtn);
    });
    registerBtn.addEventListener('click', (e) =>{
        e.preventDefault();
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        registerHeadline.classList.add('hidden');
        setActiveButton(registerBtn);
    });
    headlineBtn.addEventListener('click', (e) =>{
        e.preventDefault();
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        registerHeadline.classList.add('hidden');
        setActiveButton(registerBtn);
    });
    
    function setActiveButton(activeBtn) {
        // Távolítsuk el az active osztályt minden gombnál
        [loginBtn, registerBtn].forEach((btn) => {
            btn.classList.remove('active');
        });
        // Adjuk hozzá az active osztályt a kattintott gombhoz
        activeBtn.classList.add('active');
    }
});