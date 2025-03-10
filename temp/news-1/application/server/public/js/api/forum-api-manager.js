document.addEventListener('DOMContentLoaded', () => {

    if(location.pathname.includes('/index')){
        loadTopics();
        setInterval(createSystemTopic(), 3600*1000); //Óránkénti frissítés.
    }
    else if(location.pathname.includes('/topic')){
        loadTopicDetails();
    }   
    setupCreateTopic();
     setupReportButton();
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
function loadTopicDetails() {
    const token = localStorage.getItem('token');
    const topicId = new URLSearchParams(window.location.search).get('id');

    fetch(`/news/forumTopics/${topicId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(topicDetails => {

        document.getElementById('container').innerHTML = `
            <div class="topic-meta" id="topic-meta">
                <p>Opened by: ${topicDetails.usernames} - ${formatDateForMySQL(topicDetails.date)}</p>
                <button onclick="reportTopic(${topicId})">Report</button>
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
                </div>`;

        // Itt helyezzük el az eseménykezelőt a gomb létrehozása után
       

        document.getElementById('comment-form').addEventListener('submit', (e) => submitComment(e, topicId));
        
        loadComments(topicId);

        fetchData('/news/get-profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }     
        })
        .then(profileData => {
            if (profileData.permission === 1 || topicDetails.userId === profileData.id) {
                document.getElementById('topic-meta').innerHTML += `<button onclick="deleteTopic(${topicDetails.topicId})">Delete topic</button>`;
            }
        })
        .catch(error => console.log('error fetching profile data', error));
    })
    .catch(error => console.log('error loading topic details', error));
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
                })
                .then(() => {
                    alert('Topic created successfully!');
                    window.location.href="/news/forum-layout.html/index";
                })
                .catch(console.error);
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
async function deleteTopic(topicId) {
    const confirmation = confirm("Are you sure you want to delete this topic? This action cannot be undone.");
    if (!confirmation) {
        return; // Megszakítja a folyamatot, ha a felhasználó visszavonja
    }

    try {
        const response = await fetch(`/news/forumTopics/${topicId}`, {
            method: 'DELETE'
        });
        const data = await response.json();

        if (response.ok) {
            alert('Topic successfully deleted');
            window.location.href = "/news/forum-layout.html/index"; // Áthelyezés csak siker esetén
        } else {
            alert(`Error: ${data.error || 'Failed to delete topic'}`);
        }
    } catch (error) {
        console.error('Error deleting topic:', error);
    }
}
async function setupReportButton() {
    if(!window.location.pathname.includes('index')) return;
    const response = await fetch('/news/get-profile', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (response.ok) {
        const userProfile = await response.json();
        if (userProfile.permission === 1) {
            const navUl = document.querySelector('#topic-controls ul');
            const reportLi = document.createElement('li');
            const reportLink = document.createElement('a');
            
            reportLink.href = '#';
            reportLink.id = 'load-report-btn';
            reportLink.textContent = 'Report';
            
            reportLi.appendChild(reportLink);
            navUl.appendChild(reportLi);
        }
    }

    document.getElementById('load-report-btn').addEventListener('click', () => {
        const container = document.getElementById('container');
        container.innerHTML = `
            <button id="back-btn">Back</button>
            <table id="reports-table">
                <tr>
                    <th>Topic title</th>
                    <th>Reported by</th>
                    <th>Report date</th>
                    <th>Path</th>
                </tr>
            </table>
        `;
        loadReports();
        document.getElementById('back-btn').addEventListener('click', () => {
            window.location.href = "/news/forum-layout.html/index";
        })
    });
}
function reportTopic(topicId) {
    const confirmReport = confirm('Do you really want to report this topic?');

    if (!confirmReport) {
        alert('Report canceled');
        return;
    }

    const token = localStorage.getItem('token');
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    fetch('/news/get-profile', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(profileData => {
        const userId = profileData.id;
        const reportData = { userId, topicId, date };

        fetch('/news/report-topic', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(reportData)
        })
        .then(response => response.json())
        .then(result => {
            alert('You have successfully reported the topic! We will review your report shortly.');
        })
        .catch(error => console.log('error reporting topic', error));
    })
    .catch(error => console.log('error fetching profile data', error));
}

function loadReports() {
    
    fetch('/news/loadReports', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
    .then(response => response.json())
    .then(reportData => {
        const reportsTable = document.getElementById('reports-table');
        if(!reportsTable) return;

        reportData.forEach(data => {
            reportsTable.innerHTML += `
                
                <tr>
                        <td>${data.topicTitle}</a></td>
                        <td> &#126 By: ${data.usernames} &#126 </td>
                        <td>${formatDateForMySQL(data.date)}</td>
                        <td><a href="/news/forum-layout.html/topic?id=${data.topicId}">View topic &gt; </a></td>   
                </tr>
                
            `;
        });
    })
    .catch(error => console.error('error fetching Reports'));
}
function formatDateForMySQL(date) {
    return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
}