const autok = [
  "../img/ferrari_sf_24_2024-3840x2160.jpg",
  "../img/mercedesw15_1920-1351386.jpeg",
  "../img/redbull.jpg"
];

const randomAuto = autok[Math.floor(Math.random() * autok.length)];

document.querySelector('header').style.backgroundImage = `url(${randomAuto})`;
document.querySelector('header').style.backgroundSize = `cover`;