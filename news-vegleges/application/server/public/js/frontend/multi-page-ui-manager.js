document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    const buttonSets = {
        'index.html': [
            { btn: 'driver-standlist-btn', show: 'driver-standlist-table', hide: ['constructor-standlist-table', 'race-result-table'] },
            { btn: 'constructor-standlist-btn', show: 'constructor-standlist-table', hide: ['driver-standlist-table', 'race-result-table'] },
            { btn: 'race-result-btn', show: 'race-result-table', hide: ['driver-standlist-table', 'constructor-standlist-table'] }
        ],
        'tracks.html': [
            { btn: 'circuit-btn', show: 'circuit-datas-content', hide: ['last-winners-content', 'event-container'] },
            { btn: 'winners-btn', show: 'last-winners-content', hide: ['circuit-datas-content', 'event-container'] },
            { btn: 'event-btn', show: 'event-container', hide: ['circuit-datas-content', 'last-winners-content'] }
        ],
        'auth.html': [
            { btn: 'login-btn', show: 'login-section', hide: ['register-section', 'register-headline'] },
            { btn: 'register-btn', show: 'register-section', hide: ['login-section', 'register-headline'] },
            { btn: 'headline-btn', show: 'register-section', hide: ['login-section', 'register-headline'] }
        ]
    };

    Object.keys(buttonSets).forEach(page => {
        if (path.endsWith(page)) {
            buttonSets[page].forEach(({ btn, show, hide }) => {
                const button = document.getElementById(btn);
                const showElement = document.getElementById(show);
                const hideElements = hide.map(id => document.getElementById(id));

                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    showElement.classList.remove('hidden');
                    hideElements.forEach(el => el.classList.add('hidden'));
                    setActiveButton(button, buttonSets[page].map(({ btn }) => document.getElementById(btn)));
                });
            });
        }
    });

    function setActiveButton(activeBtn, btnGroup) {
        btnGroup.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }
});
