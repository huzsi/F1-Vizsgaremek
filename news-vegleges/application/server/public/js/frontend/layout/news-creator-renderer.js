document.addEventListener("DOMContentLoaded", function () {

    if (!window.location.pathname.includes('/news-creator')) {
        return; // Ha nem a News-Creator oldal, akkor kilépünk a scriptből
    }

    // A main-container, ahová beillesztjük a contentet
    const mainContainer = document.getElementById('main-content');

    // A két section, amit be akarunk illeszteni
    const creatorSection = `
        <section class="creator-section">
            <h3>Create news</h3>
            <form action="" id="news-form">
                <div class="main-title">
                    <h3>Main title</h3>
                    <input type="text" id="main-title-input">
                </div>
                <div class="selector-container">
                    <h4>Select element</h4>
                    <select name="" id="element-select">
                        <option value="Headline1">Headline1</option>
                        <option value="Headline2">Headline2</option>
                        <option value="Headline3">Headline3</option>
                        <option value="Paragraph">Paragraph</option>
                        <option value="Image">Image</option>
                    </select>
                    <button type="button" id="add-element-btn">Add element</button>
                </div>
                <div class="editor-container" id="editor-container">
                    <h4>Edit</h4>
                </div>
                <div class="bottomButtons-container">
                    <button type="button" id="save-btn">Save</button>
                    <button type="button" id="clear-btn">Clear</button>
                    <button type="button" id="preview-btn">Full screen preview</button>
                </div>
            </form>
        </section>`;

    const previewSection = `
        <section class="preview-section">
            <h3>Preview</h3>
            <div class="preview-content" id="preview-content">
                <!--JS betölti-->
            </div>
        </section>`;

    // Ellenőrizzük, hogy a mainContainer létezik-e
    if (mainContainer) {
        // Beillesztjük a két section-t
        mainContainer.innerHTML = creatorSection + previewSection;
    } else {
        console.error('A "main-container" nem található a DOM-ban!');
    }
});