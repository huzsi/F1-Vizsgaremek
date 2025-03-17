document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('footer').innerHTML = `
        <div>
                <h2><a href="https://www.formula1.com/">F1 website</a></h2>
                <h3>Created by - Ináncsi Krisztián | Bartók Krisztián | Fábián Tamás</h3>
                
            </div>
            <div>
                <p>All legal rights and materials used, including images and fonts, are the property of F1.</p>
                <p>All content and articles published are copyrighted and the property of their respective authors.</p>
            </div>
            <div class="bottom-div">
                <p>&copy; <span id="yearSpan"></span></p>
                <p>Source: <a href="https://github.com/huzsi/F1-Vizsgaremek">Github</a></p>
            </div>
    `;

    const yearSpan = document.getElementById("yearSpan");
    
    function change(){
        const now = new Date();
        yearSpan.textContent = now.getFullYear();
    }

    change();
});