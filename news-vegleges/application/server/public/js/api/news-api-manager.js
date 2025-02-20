document.addEventListener('DOMContentLoaded', () => {

    const regularDailyNews = document.getElementById('regular-daily-news-container');
    const regularFeaturesNews = document.getElementById('regular-features-news-container');
    const techDailyNews = document.getElementById('tech-daily-news-container');
    const techFeaturesNews = document.getElementById('tech-features-news-container');

    for (let index = 0; index <  20; index++) {
        regularDailyNews.innerHTML += `<div class="newsDiv">
                                            <a href="/news-layout.html/news">
                                                <h4>Headline</h4>
                                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo cum quo quibusdam perspiciatis impedit. Reprehenderit voluptate maxime, ducimus animi natus fugiat dicta repellendus quia voluptatibus eligendi, veniam vel. Asperiores, odio?</p>
                                            </a>
                                        </div>`;

        techDailyNews.innerHTML += `<div class="newsDiv">
                                        <a href="/news-layout.html/news">
                                            <h4>Headline</h4>
                                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo cum quo quibusdam perspiciatis impedit. Reprehenderit voluptate maxime, ducimus animi natus fugiat dicta repellendus quia voluptatibus eligendi, veniam vel. Asperiores, odio?</p>
                                        </a>
                                    </div>`; 
    }
    for (let index = 0; index < 6; index++) {
        techFeaturesNews.innerHTML += `<div class="newsDiv">
                                            <a href="/news-layout.html/news">
                                                <h4>Headline</h4>
                                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo cum quo quibusdam perspiciatis impedit. Reprehenderit voluptate maxime, ducimus animi natus fugiat dicta repellendus quia voluptatibus eligendi, veniam vel. Asperiores, odio?</p>
                                            </a>
                                        </div>`;
        
        regularFeaturesNews.innerHTML += `<div class="newsDiv">
                                            <a href="/news-layout.html/news">
                                                <h4>Headline</h4>
                                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo cum quo quibusdam perspiciatis impedit. Reprehenderit voluptate maxime, ducimus animi natus fugiat dicta repellendus quia voluptatibus eligendi, veniam vel. Asperiores, odio?</p>
                                            </a>
                                        </div>`;
        
    }

    const regularNewsBtn = document.getElementById('regular-news-btn');
    const techNewsBtn = document.getElementById('tech-news-btn');

    if(regularNewsBtn){
        regularNewsBtn.addEventListener('click', () =>{
            window.location.href = "/news-layout.html/daily-news"
        });
    }
    if(techNewsBtn){
        techNewsBtn.addEventListener('click', () =>{
            window.location.href = "/news-layout.html/tech-news"
        });
    }
})