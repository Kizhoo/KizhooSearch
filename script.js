const searchForm = document.getElementById("search-form");
const queryInput = document.getElementById("query");
const resultsDiv = document.getElementById("results");
const filters = document.querySelectorAll(".filter");

let currentFilter = "web";

filters.forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filters.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
  });
});

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = queryInput.value.trim();
  if (!query) return;

  resultsDiv.innerHTML = `<p>Loading ${currentFilter} results...</p>`;

  const apiUrl = `/api/search?q=${encodeURIComponent(query)}&type=${currentFilter}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      resultsDiv.innerHTML = "<p>No results found.</p>";
      return;
    }

    resultsDiv.innerHTML = "";
    data.results.forEach(item => {
      const resultItem = document.createElement("div");
      resultItem.className = "result-item";
      resultItem.innerHTML = `
        <a href="${item.url}" target="_blank"><h3>${item.title}</h3></a>
        <a href="${item.url}" target="_blank">${item.url}</a>
        <p>${item.description}</p>
      `;
      resultsDiv.appendChild(resultItem);
    });
  } catch (err) {
    console.error(err);
    resultsDiv.innerHTML = "<p>Error loading results.</p>";
  }
});
