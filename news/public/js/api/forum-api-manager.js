/**--------------------------------------------------------------------
 * 
 * Forum Topic Management: forum-layout.html
 * API data is fetched during server.js startup
 * Subsequently, new requests are made every hour to keep the forum up-to-date.
 * 
 * --------------------------------------------------------------------
 * 
 * APIs used on the site:
 *      /news/forum-topics (GET - loaded from Cache)
 *      /news/forum-comments (GET - loaded from Cache)
 *      /news/upload-comment (POST - upload comment)
 *      /news/report-topic (POST - report topic)
 *      /news/get-profile (GET - fetch user profile)
 *      /news/load-reports (GET - load reported topics)
 * 
 * --------------------------------------------------------------------
 *  
 * The `fetchData` async function ensures that data is loaded efficiently from Cache.
 * This prevents unnecessary API requests every time a user visits the page.
 * 
 * --------------------------------------------------------------------
 * 
 * Data is sourced from the backend API hosted on our platform. All data is property of the website.
 * Users are redirected to the original topic for further interaction or reporting purposes.
 * 
 * --------------------------------------------------------------------
 * Created by: Krisztián Bartók & Krisztián Ináncsi
 * Last Updated: 2025-03-11
 */
document.addEventListener('DOMContentLoaded', async () => {

    if (location.pathname.includes('/index')) {
        await loadTopics();
        setInterval(async () => await createSystemTopic(), 1800);
    } else if (location.pathname.includes('/topic')) {
        await loadTopicDetails();
    }
    await setupCreateTopic();
    await setupReportButton();
});
async function fetchData(url, options = {}) {
    try {
        const response = await fetch(url, options);
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}
//
async function loadTopics() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const topicData = await fetchData('/news/forum-topics', {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    const raceSection = document.getElementById('race-section');
    const userSection = document.getElementById('user-section');

    const topics = Array.isArray(topicData) ? topicData : [topicData];

    topics.forEach(data => {
        const section = data.userId === 0 ? raceSection : userSection;
        const topicDiv = document.createElement('div');
        topicDiv.className = 'topic';
        topicDiv.innerHTML = `<a href="/news/forum-layout.html/topic?id=${data.topicId}">
                                <h2>${data.topicTitle}</h2>
                                <p>Opened: ${data.username}</p>
                              </a>`;
        section.appendChild(topicDiv);
    });
}
//
async function loadTopicDetails() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const topicId = new URLSearchParams(window.location.search).get('id');

    const topicDetails = await fetchData(`/news/forum-topics/${topicId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    // Convert UTC to local time
    const topicDate = new Date(topicDetails.date);
    const formattedDate = topicDate.toLocaleString(); // Localized date format

    const isLoggedIn = !!token; // Check if the user is logged in

    document.getElementById('container').innerHTML = `
        <div class="topic-meta" id="topic-meta">
            <p>Opened by: ${topicDetails.username} - ${formattedDate}</p>
            ${isLoggedIn ? `<button onclick="reportTopic(${topicId})">Report</button>` : ''}
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
            <hr>
            <div id="comments-content" class="comments-content"></div>
    `;

    document.getElementById('comment-form').addEventListener('submit', (e) => submitComment(e, topicId));

    await loadComments(topicId);

    const profileData = await fetchData('/news/get-profile', {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (profileData.permission === 1 || topicDetails.userId === profileData.id) {
        document.getElementById('topic-meta').innerHTML += `<button onclick="deleteTopic(${topicDetails.topicId})">Delete topic</button>`;
    }
}


async function createSystemTopic() {
    

    try {
        const topicResponse = await fetch('/news/forum-topics');
        const topicData = await topicResponse.json();

        const raceScheduleResponse = await fetch('/news/race-schedule');
        const raceScheduleData = await raceScheduleResponse.json();

        if (!Array.isArray(topicData) || !Array.isArray(raceScheduleData)) {
            console.error('Invalid data format.');
            return;
        }

        const existingTitles = topicData.map(topic => topic.topicTitle);
        const currentDate = new Date().setHours(0, 0, 0, 0);

        // Keresd meg azt az eseményt, amelynek az event1 dátumát elértük legközelebb
        const closestEvent = raceScheduleData.reduce((closest, race) => {
            const eventDate = new Date(race.event1).setHours(0, 0, 0, 0);
            return (eventDate <= currentDate && (!closest || eventDate > closest.date))
                ? { ...race, date: eventDate }
                : closest;
        }, null);


        if (!closestEvent) {
            console.log('No eligible race found.');
            return;
        }

        const title = closestEvent.name;
        if (!existingTitles.includes(title)) {
            await fetch('/news/forum-topics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: 0,
                    topicTitle: title,
                    topicContent: `Welcome to the official discussion topic for race! Share your thoughts, opinions, and experiences about the race events.`,
                    date: formatDateForMySQL(new Date())
                })
            });

            console.log('Topic created successfully!');
        } else {
            console.log('Topic already exists for this race.');
        }
    } catch (error) {
        console.error('Error creating topic:', error);
    }
}
async function loadComments(topicId) {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    // Fetch the user's profile
    const profileResponse = await fetch('/news/get-profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    const profile = await profileResponse.json();

    // Fetch the comments data
    let commentData = await fetchData(`/news/forum-comments/${topicId}`);
    if (!Array.isArray(commentData)) {
        commentData = [commentData];
    }

    const commentsContent = document.getElementById('comments-content');
    commentsContent.innerHTML = commentData.length
        ? commentData.map(data => {
            let deleteButton = '';
            if (profile.id === data.userId || profile.permission === 1) {
                deleteButton = `<button onclick="deleteComment(${data.commentId})">Delete Comment</button>`;
            }

            // Convert UTC to local time
            const commentDate = new Date(data.date);
            const formattedDate = commentDate.toLocaleString();  // Localized date format
           
            return `<div class="comment">
                        <p>${data.commentContent}</p>
                        <p>By: ${data.username} <span>${formattedDate}</span></p>
                        ${deleteButton}
                    </div>`;
        }).join('') 
        : '<h4>There is no comment here.</h4>';
}
async function deleteComment(commentId, topicId) {
        const response = await fetch(`/news/forum-comments/${commentId}`, { method: 'DELETE' });
        // Ha a válasz 204 (No Content), akkor nem próbáljuk meg JSON-t értelmezni
        const result = response.status !== 204 ? await response.json() : { success: true };
        if (response.ok) {
            alert('Comment deleted successfully');
            location.reload();
        }  
}
/**Feltöltések */
async function setupCreateTopic() {
    const createBtn = document.getElementById('create-btn');
    if (!createBtn) return;

    createBtn.addEventListener('click', async () => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
            alert('Please log in to create a topic.');
            return;
        }

        try {
            const profileResponse = await fetch('/news/get-profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Ellenőrizzük, hogy a profil válasz sikeres-e
            if (!profileResponse.ok) {
                window.location.href = '/news/auth.html';
                return;
            }

            const profileData = await profileResponse.json();
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

            document.getElementById('create-topic-form').addEventListener('submit', async (e) => {
                e.preventDefault();

                try {
                    await fetch('/news/forum-topics', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({
                            userId: profileData.id,
                            topicTitle: document.getElementById('topicTitle').value,
                            topicContent: document.getElementById('topicContent').value,
                            date: formatDateForMySQL(new Date())
                        })
                    });

                    alert('Topic created successfully!');
                    window.location.href = "/news/forum-layout.html/index";
                } catch (error) {
                    console.error('Error creating topic:', error);
                }
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    });
}

async function submitComment(e, topicId) {
    e.preventDefault();
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    // Ellenőrizzük, hogy van-e token
    if (!token) {
        confirm("Please login first!")
        window.location.href = '/news/auth.html';
        return;
    }

    // Lekérjük a profil adatokat
    const profileResponse = await fetch('/news/get-profile', {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    // Ellenőrizzük, hogy a profil válasz sikeres-e
    if (!profileResponse.ok) {
        window.location.href = '/news/auth.html';
        return;
    }

    const profileData = await profileResponse.json();

    // Komment feltöltése
    await fetch('/news/upload-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
            topicId: topicId,
            userId: profileData.id,
            commentContent: document.getElementById('comment-content-textarea').value,
            date: formatDateForMySQL(new Date())
        })
    });

    // Hozzászólások újratöltése
    await loadComments(topicId);
}

async function deleteTopic(topicId) {
    const confirmation = confirm("Are you sure you want to delete this topic? This action cannot be undone.");
    if (!confirmation) return;

    try {
        const commentsResponse = await fetch(`/news/forum-comments/${topicId}`);
        let commentsData = await commentsResponse.json();

        commentsData = Array.isArray(commentsData) ? commentsData : [commentsData];

        if (commentsData.length > 0) {
            for (const comment of commentsData) {
                await fetch(`/news/forum-comments/${comment.commentId}`, { method: 'DELETE' });
            }
        }

        const reportsResponse = await fetch(`/news/load-reports`);
        let reportsData = await reportsResponse.json();

        reportsData = Array.isArray(reportsData) ? reportsData : [reportsData];

        const topicReports = reportsData.filter(report => report.topicId === topicId);

        console.log(topicReports);

        if (topicReports.length > 0) {
            for (const report of topicReports) {
                const deleteResponse = await fetch(`/news/delete-reports/${topicId}`, { method: 'DELETE' });
                if (!deleteResponse.ok) {
                    console.error(`Failed to delete report for topicId ${topicId}:`, deleteResponse.statusText);
                }
            }
        }

        const response = await fetch(`/news/forum-topics/${topicId}`, { method: 'DELETE' });
        const data = await response.json();

        if (response.ok) {
            alert('Topic successfully deleted');
            window.location.href = "/news/forum-layout.html/index";
        } else {
            alert(`Error: ${data.error || 'Failed to delete topic'}`);
        }
    } catch (error) {
        console.error('Error deleting topic:', error);
    }
}

async function setupReportButton() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if(!window.location.pathname.includes('index')) return;
    const response = await fetch('/news/get-profile', {
        headers: {
            'Authorization': `Bearer ${token}`
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

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
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
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    fetch('/news/load-reports', {
        headers: {
            'Authorization': `Bearer ${token}`
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
                        <td> &#126 By: ${data.username} &#126 </td>
                        <td>${formatDateForMySQL(data.date)}</td>
                        <td><a href="/news/forum-layout.html/topic?id=${data.topicId}">View topic &gt; </a></td>   
                </tr>
                
            `;
        });
    })
    .catch(error => console.error('error fetching Reports'));
}
function formatDateForMySQL(date) {
    // Ha az időpontot lokálisan szeretnénk formázni, ezt itt is hozzáadhatjuk,
    // de most csak biztosítjuk, hogy UTC-t használjunk
    return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
}