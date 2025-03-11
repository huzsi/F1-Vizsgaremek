window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader-frame').style.display = 'none';
        document.querySelector('.content').style.display = 'block';
    }, 500); // 5000 milliseconds = 5 seconds
});
