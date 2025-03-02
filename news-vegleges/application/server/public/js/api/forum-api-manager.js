/**------------------------------------
 * 
 * Fórum API manager kód
 * 
 * ------------------------------------
 * Készítette: Bartók Krisztián
 * Frissítve: 2025-03-02
 * 
 */

document.addEventListener('DOMContentLoaded', () => {
    if(!location.pathname.includes('forum-layout.html/index')){
        return;
    }
    fetch('/news/raceTopics')
        .then(response => response.json())
        .then(topicDatas => {

            const raceSection = document.getElementById('race-section');
            const regularSection = document.getElementById('regular-section');

            let count = 0;
            topicDatas.forEach(datas => {
                if(count <= 24){
                    let links = '';
                    if (datas.type === 1) {
                        links = `
                            <a href="#">Practice</a>
                            <a href="#">Qualify</a>
                            <a href="#">Race</a>
                        `;
                    } else if (datas.type === 2) {
                        links = `
                            <a href="#">Sprint</a>
                            <a href="#">Qualify</a>
                            <a href="#">Race</a>
                        `;
                    }

                    raceSection.innerHTML += `
                        <div class="race-topic">
                            <div>
                                <img src="/static/img/flags/${datas.id}.svg" alt="">
                                <h3>${datas.name}</h3>
                                ${links}
                            </div>
                            <p>Last comment:</p>
                        </div>
                    `;
                    count++;
                }
            });

        })
        .catch(error => console.log('Error fetching forum datas: ' , error));

        fetch('/news/forumTopics', {
            method: 'GET',
        })
        .then(response => response.json())
        .then(forumData => {
            const regularSection = document.getElementById('regular-section');
            forumData.forEach(datas => {
                regularSection.innerHTML += `
                    <div>
                        <a href="#">
                            <h2>${datas.topicTitle}</h2>
                            <p>Opened: ${datas.userId}</p>
                            <p>Last comment: ${datas.date}</p>
                        </a>
                    </div>
                `;
            });
        })
        .catch(error => console.log('Error fetching forum datas: ', error));
        

        /**Ez a kód frissítésre szorul! */
        const createBtn = document.getElementById('create-btn');

        createBtn.addEventListener('click', () => {
                const token = localStorage.getItem('token');

                if (!token) {
                    alert('Please log in to create a topic.');
                    return;
                }

                const mainContent = document.querySelector('main');
                mainContent.innerHTML = `
                    <form id="create-topic-form">
                        <div>
                            <label for="userId">User ID:</label>
                            <input type="text" id="userId" name="userId" required>
                        </div>
                        <div>
                            <label for="topicTitle">Topic Title:</label>
                            <input type="text" id="topicTitle" name="topicTitle" required>
                        </div>
                        <div>
                            <label for="topicContent">Topic Content:</label>
                            <textarea id="topicContent" name="topicContent" maxlength="255" required></textarea>
                        </div>
                        <div>
                            <label for="date">Date:</label>
                            <input type="date" id="date" name="date" required>
                        </div>
                        <button type="submit">Submit</button>
                    </form>
                `;

                const createTopicForm = document.getElementById('create-topic-form');
                createTopicForm.addEventListener('submit', (e) => {
                    e.preventDefault();

                    const formData = {
                        userId: document.getElementById('userId').value,
                        topicTitle: document.getElementById('topicTitle').value,
                        topicContent: document.getElementById('topicContent').value,
                        date: document.getElementById('date').value,
                    };

                    fetch('/news/forumTopics', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}` // Bearer token
                        },
                        body: JSON.stringify(formData)
                    })
                    .then(response => response.json())
                    .then(data => {
                        alert('Topic created successfully!');
                        console.log(data);
                        // Optionally reload topics or navigate to another page
                    })
                    .catch(error => console.error('Error creating topic:', error));
                });
            });
});
