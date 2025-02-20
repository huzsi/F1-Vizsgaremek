const urls = [
    'static/img/mcl60_wallpaper_3840x2160.jpg',
    'static/img/dark_mercw14.jpg',

    'static/img/240213_SF-Media31_0bc3335f-5c3f-461c-afff-ba3d9dad52fd.webp'
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
    setInterval(changeBackgroundImage, 60000); // 50 másodperc = 50000 ms
});
