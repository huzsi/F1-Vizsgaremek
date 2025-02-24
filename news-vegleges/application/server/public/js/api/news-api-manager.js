document.addEventListener('DOMContentLoaded', () => {

    const regularDailyNews = document.getElementById('regular-daily-news-container');
    const regularFeaturesNews = document.getElementById('regular-features-news-container');
    const techDailyNews = document.getElementById('tech-daily-news-container');
    const techFeaturesNews = document.getElementById('tech-features-news-container');

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
                techNewsBtn.addEventListener('click', () =>{
                    window.location.href = "/news-layout.html/tech-news"
                });
            }   
        })
        .catch(error => console.log(error));
});

document.addEventListener('DOMContentLoaded', () => {
    if(!window.location.pathname.includes('/regular-news')){
        return;
    }
    const regularNewsSection = document.getElementById('regular-news');

    fetch('/news/news')
        .then(response => response.json())
        .then(newsData => {
            newsData.forEach(article => {
                regularNewsSection.innerHTML += `
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
    if(!window.location.pathname.includes('/article')){
        return;
    }
    fetch('/news')
    .then(response => response.json())
    .then(newsData => {
            if(window.location.pathname.includes(`/${newsData.title}`)){
                const mainContent = document.getElementById('main-content');

                mainContent.innerHTML = `<h2>${newsData.title}</h2>
                                        <p>${newsData.document}</p>`
            }
        })
    .catch(error => console.log(error));

});

//Latest btn dropdown content
document.addEventListener('DOMContentLoaded', () => {
    const newsContent = document.getElementById('news-content');
    fetch('/news/news')
        .then(response => response.json())
        .then(newsData => {
            
            
            let count = 0;
            newsData.forEach(article => {
                if (count < 5) {
                    newsContent.innerHTML += `
                                                   <h5><a href="${article.url}" target="_newblank">${article.title} </a></h5>         
                                                `;
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
                techNewsBtn.addEventListener('click', () =>{
                    window.location.href = "/news-layout.html/tech-news"
                });
            }   
        })
        .catch(error => console.log(error));
});