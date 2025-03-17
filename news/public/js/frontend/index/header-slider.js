const urls = [
    '/static/img/index-header/mcl60.jpg',
    '/static/img/index-header/sf25.jpg',
    '/static/img/index-header/w15.jpg',
    '/static/img/index-header/amr24.jpeg'
];

document.addEventListener('DOMContentLoaded', () => {
    const headerCont = document.getElementById('header-container');
    let currentIndex = 0;

    const changeBackgroundImage = () => {
        headerCont.style.backgroundImage = `url('${urls[currentIndex]}')`;
        currentIndex = (currentIndex + 1) % urls.length;
    };

    // Azonnali beállítás az első képhez
    changeBackgroundImage();

    // Háttérkép váltása 50 másodpercenként
    setInterval(changeBackgroundImage, 60000); // 60 másodperc = 60000 ms
});
