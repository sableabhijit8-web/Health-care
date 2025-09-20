document.addEventListener("DOMContentLoaded", function () {
  const toggleDarkModeBtn = document.getElementById("toggle-dark-mode");
  const themeSelector = document.getElementById("theme-selector");
  const searchButton = document.getElementById("search-btn");
  const usernameInput = document.getElementById("user-input");
  const searchHistoryEle = document.getElementById("search-history");
  const clearHistoryBtn = document.getElementById("clear-history-btn");
  const loadingSpinner = document.getElementById("loading-spinner");
  const statsCardsContainer = document.getElementById("stats-cards");
  const progressContainer = document.querySelector(".progress");

  let searchHistory = [];

  // Data for each disease, making the script more scalable
  const diseaseData = [
    { id: "easy", name: "BP patient", progressClass: "easy-progress", labelId: "easy-level", max: 800 },
    { id: "medium", name: "HOB patient", progressClass: "medium-progress", labelId: "medium-progress", max: 1200 },
    { id: "hard", name: "Sugar patient", progressClass: "hard-progress", labelId: "hard-level", max: 400 },
    { id: "asthma", name: "Asthma patient", progressClass: "asthma-progress", labelId: "asthma-level", max: 300 },
    { id: "heart", name: "Heart patient", progressClass: "heart-progress", labelId: "heart-level", max: 500 },
  ];

  // Load search history from localStorage
  const storedHistory = localStorage.getItem("searchHistory");
  if (storedHistory) {
    searchHistory = JSON.parse(storedHistory);
    updateSearchHistory();
  }

  // --- Theme Toggling Logic ---
  toggleDarkModeBtn?.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    updateThemeIcon();
  });

  themeSelector?.addEventListener("change", (e) => {
    document.body.className = ""; // Remove all theme classes
    if (e.target.value !== "default") {
      document.body.classList.add(`${e.target.value}-theme`);
    }
    updateThemeIcon();
  });

  function updateThemeIcon() {
    const isDark = document.body.classList.contains("dark-mode");
    if (toggleDarkModeBtn) {
      toggleDarkModeBtn.textContent = isDark ? "☀" : "🌙";
    }
  }

  // --- Search History Functions ---
  function updateSearchHistory() {
    if (!searchHistoryEle) return;
    searchHistoryEle.innerHTML = "";
    searchHistory.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      li.addEventListener("click", () => {
        usernameInput.value = item;
      });
      searchHistoryEle.appendChild(li);
    });
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }

  clearHistoryBtn?.addEventListener("click", () => {
    searchHistory = [];
    updateSearchHistory();
  });

  // --- Data Display Functions ---
  function createStatsCards(userData) {
    const stats = [
      { title: "Total Patients", value: userData.totalSolved, label: "Patients Solved" },
      { title: "Acceptance Rate", value: `${userData.acceptanceRate}%`, label: "Success Rate" },
      { title: "Ranking", value: userData.ranking, label: "Global Rank" },
      { title: "Reputation", value: userData.reputation, label: "Points" },
    ];

    if (!statsCardsContainer) return;
    statsCardsContainer.innerHTML = "";
    stats.forEach((stat) => {
      const card = document.createElement("div");
      card.className = "stat-card";
      card.innerHTML = `
        <h3>${stat.title}</h3>
        <div class="value">${stat.value}</div>
        <div class="label">${stat.label}</div>
      `;
      statsCardsContainer.appendChild(card);
    });
  }

  function updateProgress(progressClass, labelId, solved, total) {
    const progressEle = document.querySelector(`.${progressClass}`);
    const labelEle = document.getElementById(labelId);
    
    // Ensure the percentage doesn't exceed 100%
    const percentage = Math.min((solved / total) * 100, 100);
    const degree = `${percentage * 3.6}deg`;

    progressEle?.style.setProperty("--progress-degree", degree);
    if (labelEle) {
      labelEle.textContent = `${solved} Patients`;
    }
  }

  // --- Search Logic ---
  searchButton?.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    if (username === "") {
      // Hide elements if input is empty
      progressContainer.classList.add("hidden");
      statsCardsContainer.classList.add("hidden");
      alert("Please enter a doctor's username.");
      return;
    }

    loadingSpinner?.classList.remove("hidden");
    statsCardsContainer.innerHTML = ""; // Clear previous stats

    setTimeout(() => {
      loadingSpinner?.classList.add("hidden");

      // Show the progress circles and stats cards
      progressContainer.classList.remove("hidden");
      statsCardsContainer.classList.remove("hidden");
      

      // Simulate fetching data for the doctor
      let totalSolved = 0;
      diseaseData.forEach(disease => {
        const solvedCount = Math.floor(Math.random() * (disease.max * 0.75)) + (disease.max * 0.1);
        totalSolved += solvedCount;
        updateProgress(disease.progressClass, disease.labelId, solvedCount, disease.max);
      });

      const userData = {
        totalSolved,
        acceptanceRate: Math.floor(Math.random() * 30) + 60,
        ranking: Math.floor(Math.random() * 100000) + 1000,
        reputation: Math.floor(Math.random() * 5000) + 1000,
      };

      createStatsCards(userData);

      if (!searchHistory.includes(username)) {
        searchHistory.push(username);
        updateSearchHistory();
      }
    }, 1500);
  });

  usernameInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchButton.click();
    }
  });

  // Initial setup
  updateSearchHistory();
  updateThemeIcon(); // Set the initial icon based on theme
});