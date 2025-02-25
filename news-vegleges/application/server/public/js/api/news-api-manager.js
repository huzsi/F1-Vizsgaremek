document.addEventListener('DOMContentLoaded', () => {

    const regularDailyNews = document.getElementById('regular-daily-news-container');
    const regularFeaturesNews = document.getElementById('regular-features-news-container');
    const techNewsContent = document.getElementById('tech-news-content');

    fetch('/news/news')
        .then(response => response.json())
        .then(newsData => {
            
            if(!window.location.pathname.includes('/index.html')){
                return;
            }
            let count = 0;
            newsData.forEach(article => {
                if (count < 12) {
                    regularDailyNews.innerHTML += `<div class="newsDiv">
                                                        <a href="${article.url}" target="_newblank">
                                                            <h4>${article.title}</h4>
                                                            <p>${article.content}</p>
                                                        </a>
                                                        <p>Author: ${article.author}</p>
                                                    </div>`;
                count++;
                }
            }); //foreach end

            const regularNewsBtn = document.getElementById('regular-news-btn');
            const techNewsBtn = document.getElementById('tech-news-btn');

            if(regularNewsBtn){
                regularNewsBtn.addEventListener('click', () =>{
                    window.location.href = "/news/news-layout.html/regular-news"
                });
            }
            if(techNewsBtn){
                techNewsBtn.addEventListener('click',()=>{
                    window.location.href = "/news/news-layout.html/tech-news"
                });
            }
        })
        .catch(error => console.log(error));

        fetch('/news/features')
    .then(response => response.json())
    .then(featuresData => {
        console.log(featuresData);  // Log the data structure

        if (!window.location.pathname.includes('/index.html')) {
            return;
        }
        const featuresNewsContent = document.getElementById('features-news-container');

        // Access the first element of the array
        const newsItem = featuresData[0];

        featuresNewsContent.innerHTML = `
            <div class="newsDiv">
                <img src=""https://www.ccn.com/wp-content/uploads/2025/02/dogecoin-price-analysis-correction.webp">
                <a href="${newsItem.url}" target="_newblank">
                    <h4>${newsItem.title}</h4>
                    <p>${newsItem.description}</p>
                </a>
                <p>Author: ${newsItem.author}</p>
            </div>
        `;
    })
    .catch(error => console.log(error));


    fetch('/news/tech-news')
        .then(response => response.json())
        .then(techNewsData => {
            if(!window.location.pathname.includes('/index.html')){
                return;
            }
            let count = 0;
            techNewsData.forEach(techArticle => {
                if (count < 12) {
                    techNewsContent.innerHTML += `<div class="newsDiv">
                                                        <a href="${techArticle.url}" target="_newblank">
                                                            <h4>${techArticle.title}</h4>
                                                            <p>${techArticle.content}</p>
                                                        </a>
                                                        <p>Author: ${techArticle.author}</p>
                                                    </div>`;
                count++;
                }
            });
        })
        .catch(error => console.log(error));
});

document.addEventListener('DOMContentLoaded', () => {
    if(!window.location.pathname.includes('/regular-news')){
        return;
    }
    const newsSection = document.getElementById('news-section');

    fetch('/news/news')
        .then(response => response.json())
        .then(newsData => {
            newsData.forEach(article => {
                newsSection.innerHTML += `
                                                <div class="newsDiv">
                                                    <a href="/news-layout.html/article/${article.article}">
                                                        <h4>${article.title}</h4>
                                                        <p>${article.description}</p>
                                                        <p>${article.author}</p>
                                                        </a>
                                                </div>`;
                });
            })
        .catch(error => console.log(error));
});
document.addEventListener('DOMContentLoaded', () => {
    if(!window.location.pathname.includes('/tech-news')){
        return;
    }
    const newsSection = document.getElementById('news-section');
    fetch('/news/tech-news')
        .then(response => response.json())
        .then(newsData => {
            newsData.forEach(article => {
                newsSection.innerHTML += `
                                                <div class="newsDiv">
                                                    <a href="/news-layout.html/article/${article.article}">
                                                        <h4>${article.title}</h4>
                                                        <p>${article.description}</p>
                                                        <p>${article.author}</p>
                                                        </a>
                                                </div>`;
                });
            })
        .catch(error => console.log(error));
});

/**
 * A server indításnál lefutó API Link lekérés annak érdekében, hogy ne lépjük túl a megengedett limitet.
 * async function fetchNews() {
    try {
        const newsResponse = await fetch('https://example.com/news/news');
        const featuresResponse = await fetch('https://example.com/news/features');
        const techNewsResponse = await fetch('https://example.com/news/tech-news');
        
        cachedNews.news = await newsResponse.json();
        cachedNews.features = await featuresResponse.json();
        cachedNews.techNews = await techNewsResponse.json();
        
        console.log('News data cached successfully');
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

// Fetch news when the server starts
fetchNews();

// Serve cached news to frontend
app.get('/cached-news', (req, res) => {
    res.json(cachedNews);
});
 */