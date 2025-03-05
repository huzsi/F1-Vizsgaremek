/**--------------------------------------------------------------------
 * 
 * Forum API Manager Code
 * 
 * --------------------------------------------------------------------
 * 
 * This code is responsible for handling the forum-related functionalities,
 * including loading race topics, forum topics, popular topics, creating a topic,
 * displaying topic details, posting comments, and displaying those comments.
 * 
 * --------------------------------------------------------------------
 * 
 * APIs used on the site:
 *      /news/raceTopics (GET)
 *      /news/forumTopics (GET)
 *      /news/popular-topics (GET)
 *      /news/last-topicComment (GET)
 *      /news/get-profile (GET)
 *      /news/forumTopics (POST)
 *      /news/upload-comment (POST)
 *      /news/forumComments (GET)
 * 
 * --------------------------------------------------------------------
 * 
 * The FetchData function is used throughout to asynchronously fetch data 
 * from the server, ensuring that content like topics and comments are updated 
 * dynamically without reloading the page.
 * 
 * --------------------------------------------------------------------
 * 
 * The setupCreateTopic function ensures that only logged-in users can create a topic.
 * After successful topic creation, the forum is dynamically updated to reflect the changes.
 * 
 * The loadRaceTopics function loads various racing-related topics, while the loadForumTopics 
 * and loadPopularTopics functions fetch and display general forum discussions and the most popular topics, respectively.
 * 
 * The loadTopicDetails function dynamically loads the details of a single topic, including its title, content,
 * and all associated comments. Comments are fetched and displayed with the option to post a new comment.
 * 
 * --------------------------------------------------------------------
 * 
 * Upcoming Updates:
 *      - Improving user authentication for creating and commenting on topics.
 *      - Adding pagination or infinite scroll for displaying comments and forum topics.
 * 
 * --------------------------------------------------------------------
 * Created by: Krisztián Bartók
 * Last Updated: 2025-03-03
 */

document.addEventListener('DOMContentLoaded', () => {
    if (location.pathname.includes('forum-layout.html/index')) {
        loadRaceTopics();
        loadForumTopics();
        loadPopularTopics();
    }
    if (location.pathname.includes('forum-layout.html/topic')) {
        loadTopicDetails();
    }
    setupCreateTopic();
});
function fetchData(url, options = {}) {
    return fetch(url, options).then(response => response.json()).catch(console.error);
}
function loadRaceTopics() {
    fetchData('/news/raceTopics').then(topicDatas => {
        const raceSection = document.getElementById('race-section');
        let count = 0;
        topicDatas.forEach(datas => {
            if (count++ < 25) {
                const links = datas.type === 1 ? `<a href="/news/forum-layout.html/topic?id=${datas.id}">Practice</a><a href="/news/forum-layout.html/topic?id=${datas.id}">Qualify</a><a href="/news/forum-layout.html/topic?id=${datas.id}">Race</a>` : 
                              datas.type === 2 ? `<a href="/news/forum-layout.html/topic?id=${datas.id}">Sprint</a><a href="/news/forum-layout.html/topic?id=${datas.id}">Qualify</a><a href="/news/forum-layout.html/topic?id=${datas.id}">Race</a>` : '';
                const topicDiv = document.createElement('div');
                topicDiv.className = 'race-topic';
                topicDiv.innerHTML = `<div><img src="/static/img/flags/${datas.id}.svg" alt=""><h3>${datas.name}</h3>${links}</div><p>Last comment:</p>`;
                raceSection.appendChild(topicDiv);
            }
        });
    });
}
function loadForumTopics() {
    const token = localStorage.getItem('token');
    fetchData('/news/forumTopics', { headers: { 'Authorization': `Bearer ${token}` } }).then(forumData => {
        const regularSection = document.getElementById('regular-section');
        forumData.forEach(datas => {
            const topicDiv = document.createElement('div');
            topicDiv.innerHTML = `<a href="/news/forum-layout.html/topic?id=${datas.topicId}"><h2>${datas.topicTitle}</h2><p>Opened: ${datas.usernames}</p><p id="last-comment-${datas.topicId}">Last comment: Loading...</p></a>`;
            regularSection.appendChild(topicDiv);
            loadLastComment(datas.topicId);
        });
    });
}
function loadPopularTopics() {
    fetchData('/news/popular-topics').then(topicDatas => {
        const popularSection = document.getElementById('popular-section');
        topicDatas.forEach(datas => {
            const topicDiv = document.createElement('div');
            topicDiv.innerHTML = `
                <a href="/news/forum-layout.html/topic?id=${datas.topicId}">
                    <h2>${datas.topicTitle}</h2>
                    <p>Opened: ${datas.usernames}</p>
                    <p id="last-comment-${datas.topicId}">Last comment: ${datas.usernames}</p>
                </a>`;
            popularSection.appendChild(topicDiv);
        });
    }).catch(error => console.error('Error fetching popular topics:', error));
}
function loadLastComment(topicId) {
    const token = localStorage.getItem('token');
    fetchData(`/news/last-topicComment?topicId=${topicId}`, { headers: { 'Authorization': `Bearer ${token}` } }).then(lastCommentData => {
        const lastCommentElement = document.getElementById(`last-comment-${topicId}`);
        if (lastCommentData.length > 0 || Object.keys(lastCommentData).length > 0) {
            const comment = lastCommentData[0] || lastCommentData;
            const formattedDate = formatDateForMySQL(new Date(comment.date));
            lastCommentElement.innerHTML = `Last comment: ${comment.usernames} <span>${formattedDate}</span>`;
        } else {
            lastCommentElement.innerHTML = 'Last comment: None';
        }
    });
}
function setupCreateTopic() {
    const createBtn = document.getElementById('create-btn');
    if (!createBtn) return;
    createBtn.addEventListener('click', () => {
        const token = localStorage.getItem('token');
        if (!token) return alert('Please log in to create a topic.');
        fetchData('/news/get-profile', { headers: { 'Authorization': `Bearer ${token}` } }).then(profileData => {
            const mainContent = document.querySelector('main');
            mainContent.innerHTML = `<form id="create-topic-form"><div><label for="topicTitle">Topic Title:</label><input type="text" id="topicTitle" required></div><div><label for="topicContent">Topic Content:</label><textarea id="topicContent" maxlength="255" required></textarea></div><button type="submit">Submit</button></form>`;
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
function loadTopicDetails() {
    const topicId = new URLSearchParams(window.location.search).get('id');
    fetchData(`/news/forumTopics/${topicId}`).then(topicData => {
        document.querySelector('main').innerHTML = `<div class="topic-meta"><p>Opened by: ${topicData.usernames} - ${formatDateForMySQL(topicData.date)}</p></div><div class="topic-content"><h1>${topicData.topicTitle}</h1><p>${topicData.topicContent}</p><form id="comment-form" class="comment-form"><textarea id="comment-content-textarea" required placeholder="Write your comment here..."></textarea><button type="submit">Submit Comment</button></form><div id="comments-content" class="comments-content"></div></div>`;
        document.getElementById('comment-form').addEventListener('submit', (e) => submitComment(e, topicId));
        loadComments(topicId);
    });
}
function submitComment(e, topicId) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    fetchData('/news/get-profile', { headers: { 'Authorization': `Bearer ${token}` } }).then(profileData => {
        fetch('/news/upload-comment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                topicId: topicId,
                userId: profileData.id,
                commentContent: document.getElementById('comment-content-textarea').value,
                date: formatDateForMySQL(new Date())
            })
        }).then(() => loadComments(topicId)).catch(console.error);
    });
}
function loadComments(topicId) {
    fetchData(`/news/forumComments/${topicId}`).then(commentData => {
        const commentsContent = document.getElementById('comments-content');
        commentsContent.innerHTML = commentData.length ? commentData.map(data => `<div class="comment"><p>${data.commentContent}</p><p>By: ${data.usernames} <span>${formatDateForMySQL(new Date(data.date))}</span></p></div>`).join('') : '<h4>There is no comment here.</h4>';
    });
}
function formatDateForMySQL(date) {
    return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
}
