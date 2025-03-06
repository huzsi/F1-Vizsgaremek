document.addEventListener('DOMContentLoaded', () => {

    if(location.pathname.includes('/index')){
        loadTopics();
        setInterval(createSystemTopic(), 3600*1000); //Óránkénti frissítés.
    }
    else if(location.pathname.includes('/topic')){
        loadTopicDetails();
    }   
    setupCreateTopic();
})
function fetchData(url, options = {}) {
    return fetch(url, options).then(response => response.json()).catch(console.error);
}
function loadTopics() {
    const token = localStorage.getItem('token');
    fetch('/news/forumTopics', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(topicData => {
        const raceSection = document.getElementById('race-section');
        const userSection = document.getElementById('user-section');

        // Ensure topicData is an array
        if (!Array.isArray(topicData)) {
            topicData = [topicData];
        }

        topicData.forEach(data => {
           
            if (data.userId === 0) {
                const topicDiv = document.createElement('div');
                topicDiv.className = 'topic';
                topicDiv.innerHTML = `<a href="/news/forum-layout.html/topic?id=${data.topicId}">
                                        <h2>${data.topicTitle}</h2>
                                        <p>Opened: ${data.usernames}</p>
                                        <p id="last-comment-${data.id}">Last comment:<span></span></p>
                                      </a>`;
                raceSection.appendChild(topicDiv);
            } else {
                const topicDiv = document.createElement('div');
                topicDiv.className = 'topic';
                topicDiv.innerHTML = `<a href="/news/forum-layout.html/topic?id=${data.topicId}">
                                        <h2>${data.topicTitle}</h2>
                                        <p>Opened: ${data.usernames}</p>
                                        <p id="last-comment-${data.id}">Last comment:<span></span></p>
                                      </a>`;
                userSection.appendChild(topicDiv);
            }
        });
    })
    .catch(console.error);
}

function loadTopicDetails(){
    const topicId = new URLSearchParams(window.location.search).get('id');
    fetch(`/news/forumTopics/${topicId}`)
        .then(response => response.json())
        .then(topicDetails => {
            document.getElementById('container').innerHTML = `
                                                            <div class="topic-meta">
                                                                <p>Opened by: ${topicDetails.usernames} - ${formatDateForMySQL(topicDetails.date)}</p>
                                                            </div>
                                                            <div class="topic-content">
                                                                <h1>${topicDetails.topicTitle}</h1>
                                                                <p>${topicDetails.topicContent}</p>
                                                                <form id="comment-form" class="comment-form">
                                                                    <textarea id="comment-content-textarea" required placeholder="Write your comment here..."></textarea>
                                                                    <div>
                                                                        <button type="submit">Submit Comment</button>
                                                                    </div>
                                                                </form>
                                                                <div id="comments-content" class="comments-content">
                                                                </div>
                                                            </div>`;
            document.getElementById('comment-form').addEventListener('submit', (e) => submitComment(e, topicId));
            loadComments(topicId);
        });
}
async function createSystemTopic() {
    const token = localStorage.getItem('token');

    try {
        const topicResponse = await fetch('/news/forumTopics', { 
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const topicData = await topicResponse.json();
        
        const raceScheduleResponse = await fetch('/news/race-schedule');
        const raceScheduleData = await raceScheduleResponse.json();
        
        // Ensure topicData is an array
        const existingTitles = Array.isArray(topicData) ? topicData.map(topic => topic.topicTitle) : [];
        const currentDate = new Date();

        for (let datas of raceScheduleData) {
            const eventDate = new Date(datas.event1);
            if (eventDate <= currentDate) {
                const title = datas.name;
                if (!existingTitles.includes(title)) {
                    await fetch('/news/forumTopics', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            userId: 0, // System ID
                            topicTitle: title,
                            topicContent: `Welcome to the official discussion topic for race! Share your thoughts, opinions, and experiences about the race events.`,
                            date: formatDateForMySQL(new Date())
                        })
                    })
                    .then(() => console.log('Topic created successfully!'))
                    .catch(console.error);

                    // Stop after creating one topic
                    break;
                }
            }
        }
    } catch (error) {
        console.error('Error creating topic:', error);
    }
}
function loadComments(topicId) {
    fetchData(`/news/forumComments/${topicId}`).then(commentData => {
        const commentsContent = document.getElementById('comments-content');
        commentsContent.innerHTML = commentData.length ? commentData.map(data => `<div class="comment"><p>${data.commentContent}</p><p>By: ${data.usernames} <span>${formatDateForMySQL(new Date(data.date))}</span></p></div>`).join('') : '<h4>There is no comment here.</h4>';
    });
}
/**Feltöltések */
function setupCreateTopic() {
    const createBtn = document.getElementById('create-btn');
    if (!createBtn) return;
    createBtn.addEventListener('click', () => {
        const token = localStorage.getItem('token');
        if (!token) return alert('Please log in to create a topic.');
        fetchData('/news/get-profile', { headers: { 'Authorization': `Bearer ${token}` } }).then(profileData => {
            const container = document.getElementById('container');
            container.innerHTML = `
                                    <form id="create-topic-form">
                                        
                                            <label for="topicTitle">Topic Title:</label>
                                            <input type="text" id="topicTitle" required>
                                        
                                        
                                            <label for="topicContent">Topic Content:</label>
                                            <textarea id="topicContent" required></textarea>
                                        
                                        <div>
                                            <button type="submit">Submit</button>
                                        </div>
                                    </form>`;

            document.getElementById('create-topic-form').addEventListener('submit', (e) => {
                e.preventDefault();
                fetch('/news/forumTopics', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({
                        userId: profileData.id,
                        topicTitle: document.getElementById('topicTitle').value,
                        topicContent: document.getElementById('topicContent').value,
                        date: formatDateForMySQL(new Date())
                    })
                }).then(() => alert('Topic created successfully!')).catch(console.error);
            });
        });
    });
}
function submitComment(e, topicId) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    fetch('/news/get-profile', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(profileData => {
        fetch('/news/upload-comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    topicId: topicId,
                    userId: profileData.id,
                    commentContent: document.getElementById('comment-content-textarea').value,
                    date: formatDateForMySQL(new Date())
                })
            })
            .then(() => loadComments(topicId))
        .catch(console.error);
    });

}
function formatDateForMySQL(date) {
    return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
}