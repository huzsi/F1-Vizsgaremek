document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("searchInput");
    const resultsDiv = document.getElementById("results");
  
    async function askGPT(question) {
      try {
        const response = await fetch("http://localhost:3001/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question })
        });
        const data = await response.json();
        if (response.ok) {
          resultsDiv.innerHTML = `<p>${data.answer}</p>`;
        } else {
          resultsDiv.innerHTML = `<p style="color: red;">${data.error}</p>`;
        }
      } catch (error) {
        resultsDiv.innerHTML = `<p style="color: red;">Hiba történt: ${error.message}</p>`;
      }
    }
  
    searchInput.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        const question = searchInput.value;
        if (question.trim().length > 0) {
          askGPT(question);
        }
      }
    });
  });
  