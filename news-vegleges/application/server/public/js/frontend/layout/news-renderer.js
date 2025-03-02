/**--------------------------
 * 
 * Minden cikket összesítő & cikket megjelenítő oldal dinamikus renderelése.
 * 
 * --------------------------
 * 
 * Ez a kód az oldal minden részét dinamikusan tölti be.
 * Jelenleg a Latest dropdown gomb alatti Read More gomb irányít át erre a weboldalra.
 * 
 * A kód még alpha verzióban van.
 * 
 * --------------------------
 * Utolsó Frissítés: 2025-03-01.
 * 
 */
document.addEventListener('DOMContentLoaded', () => {
    if(!window.location.pathname.includes('news/news-layout.html/news')){
        return;
    }

    const mainContent = document.querySelector('main');

    mainContent.innerHTML += `
        <section class="daily-news">
            <fieldset>
                <legend><h3>News</h3></legend>
                <div id="daily-news-content">
                    
                </div>
            </fieldset>
        </section>
        <section class="technical-news">
            <fieldset>
                <legend><h3>Technical</h3></legend>
                <div id="tech-news-content">
                    
                </div>
            </fieldset>
        </section>
    `;
});