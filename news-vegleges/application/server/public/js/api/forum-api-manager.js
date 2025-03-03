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
                        <a href="/news/forum-layout.html/topic?id=${datas.topicId}">
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
document.addEventListener('DOMContentLoaded', () => {
    if (!location.pathname.includes('forum-layout.html/topic')) {
        return;
    }
    const urlParams = new URLSearchParams(window.location.search);
    const topicId = urlParams.get('id');
    fetch(`/news/forumTopics/${topicId}`)
        .then(response => response.json())
        .then(topicData => {
            document.querySelector('main').innerHTML = `
                <h1>${topicData.topicTitle}</h1>
                <p>${topicData.topicContent}</p>
                <form id="comment-form">
                    <textarea id="comment-content-textarea" required placeholder="Write your comment here..."></textarea>
                    <button type="submit">Submit Comment</button>
                </form>
                <div id="comments-content"></div>
            `;
            
            // Ellenőrizzük a felhasználói bejelentkezést
            fetch('/news/get-profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    alert('Please log in to comment.');
                    throw new Error('Not logged in');
                }
            })
            .then(profileData => {
                console.log('Profile Data:', profileData);
                document.getElementById('comment-form').addEventListener('submit', (e) => {
                    e.preventDefault();
                    const commentContent = document.getElementById('comment-content-textarea').value;
                    console.log('User ID:', profileData.id);
                    fetch('/news/upload-comment', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify({
                            topicId: topicId,
                            userId: profileData.id,
                            commentContent: commentContent,
                            date: new Date().toISOString()
                        })
                    })
                    .then(response => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            throw new Error('Failed to add comment');
                        }
                    })
                    .then(data => {
                        alert('Comment added successfully!');
                        loadComments(topicId);
                    })
                    .catch(error => {
                        console.log('Error submitting comment', error);
                        alert('Failed to add comment.');
                    });
                });
            })
            .catch(error => console.log('Error fetching profile', error));
            return fetch(`/news/forumComments/${topicId}`);
        })
        .then(response => response.json())
        .then(commentData => {
            console.log('Received Comment Data:', commentData);
            const commentsContent = document.getElementById('comments-content');
            commentsContent.innerHTML = '';
            if (commentData.length === 0) {
                commentsContent.innerHTML = `<h4>There is no comment here.</h4>`;
            } else {
                commentData.forEach(data => {
                    fetch(`/news/get-profile?userId=${data.userId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                    .then(response => response.json())
                    .then(userProfile => {
                        const formattedDate = new Date(data.date).toLocaleString('en-GB', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                        }).replace(',', '');
                        const commentElement = document.createElement('div');
                        commentElement.innerHTML += `
                            <p>${data.commentContent}</p>
                            <p>By: ${userProfile.username} <span>${formattedDate}</span></p>
                        `;
                        commentsContent.appendChild(commentElement);
                    });
                });
            }
        })
        .catch(error => {
            console.log('Error fetching comments', error);
            document.getElementById('comments-content').innerHTML = `<h4>There is no comment here.</h4>`;
        });
});

function loadComments(topicId) {
    fetch(`/news/forumComments/${topicId}`)
        .then(response => response.json())
        .then(commentData => {
            console.log('Received Comment Data:', commentData);
            const commentsContent = document.getElementById('comments-content');
            commentsContent.innerHTML = '';
            if (commentData.length === 0) {
                commentsContent.innerHTML = `<h4>There is no comment here.</h4>`;
            } else {
                commentData.forEach(data => {
                    fetch(`/news/get-profile?userId=${data.userId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                    .then(response => response.json())
                    .then(userProfile => {
                        const formattedDate = new Date(data.date).toLocaleString('en-GB', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                        }).replace(',', '');
                        const commentElement = document.createElement('div');
                        commentElement.innerHTML += `
                            <p>${data.commentContent}</p>
                            <p>By: ${userProfile.username} <span>${formattedDate}</span></p>
                        `;
                        commentsContent.appendChild(commentElement);
                    });
                });
            }
        })
        .catch(error => {
            console.log('Error fetching comments', error);
            document.getElementById('comments-content').innerHTML = `<h4>There is no comment here.</h4>`;
        });
}






