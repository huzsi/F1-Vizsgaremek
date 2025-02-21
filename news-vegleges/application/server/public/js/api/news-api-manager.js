document.addEventListener('DOMContentLoaded', () => {

    const regularDailyNews = document.getElementById('regular-daily-news-container');
    const regularFeaturesNews = document.getElementById('regular-features-news-container');
    const techDailyNews = document.getElementById('tech-daily-news-container');
    const techFeaturesNews = document.getElementById('tech-features-news-container');

    fetch('/news')
        .then(response => response.json())
        .then(newsData => {
            
            if(!window.location.pathname.includes('/index.html')){
                return;
            }
            let count = 0;
            newsData.forEach(article => {
                if (count < 12) {
                    regularDailyNews.innerHTML += `<div class="newsDiv">
                        <a href="${article.url}">
                            <h4>${article.title}</h4>
                            <p>${article.description}</p>
                        </a>
                    </div>`;
                count++;
                }
            }); //foreach end

            const regularNewsBtn = document.getElementById('regular-news-btn');
            const techNewsBtn = document.getElementById('tech-news-btn');

            if(regularNewsBtn){
                regularNewsBtn.addEventListener('click', () =>{
                    window.location.href = "/news-layout.html/regular-news"
                });
            }
            if(techNewsBtn){
                techNewsBtn.addEventListener('click', () =>{
                    window.location.href = "/news-layout.html/tech-news"
                });
            }   
        })
        .catch(error => console.log(error));
})

document.addEventListener('DOMContentLoaded', () => {
    if(!window.location.pathname.includes('/regular-news')){
        return;
    }
    const regularNewsSection = document.getElementById('regular-news');

    fetch('/news')
        .then(response => response.json())
        .then(newsData => {
            newsData.forEach(article => {
                regularNewsSection.innerHTML += `<div class="newsDiv">
                                                <a href="${article.url}">
                                                    <h4>${article.title}</h4>
                                                    <p>${article.description}</p>
                                                </a>
                                            </div>`;
                });
            })
        .catch(error => console.log(error));

});