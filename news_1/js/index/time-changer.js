document.addEventListener('DOMContentLoaded', () =>{
    const yearSpan = document.getElementById('yearSpan');

    function yearChange(){
        const date = new Date();
        yearSpan.textContent = date.getFullYear();
    }
    yearChange();
});