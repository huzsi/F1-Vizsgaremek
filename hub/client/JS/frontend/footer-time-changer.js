document.addEventListener('DOMContentLoaded', () => {
    const yearSpan = document.getElementById("yearSpan");
    
    function change(){
        const now = new Date();
        yearSpan.textContent = now.getFullYear();
    }

    change();
});