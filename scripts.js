document.addEventListener("DOMContentLoaded", function () {
  // Load saved theme from localStorage
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
  }

  // Theme toggle button
  var themeBtn = document.getElementById("themeToggle");
  if (themeBtn) {
    updateButtonText();
    
    themeBtn.addEventListener("click", function () {
      document.body.classList.toggle("dark-theme");
      
      // Save theme preference
      if (document.body.classList.contains("dark-theme")) {
        localStorage.setItem("theme", "dark");
      } else {
        localStorage.setItem("theme", "light");
      }
      
      updateButtonText();
    });
  }
  
  function updateButtonText() {
    if (themeBtn) {
      if (document.body.classList.contains("dark-theme")) {
        themeBtn.textContent = "Light Theme";
      } else {
        themeBtn.textContent = "Dark Theme";
      }
    }
  }

  // Back to Top Button
  const backToTopBtn = document.createElement("button");
  backToTopBtn.id = "backToTop";
  backToTopBtn.innerHTML = "&#8679;";
  backToTopBtn.setAttribute("aria-label", "Back to top");
  document.body.appendChild(backToTopBtn);
  
  // Show/hide button on scroll
  window.addEventListener("scroll", function() {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  });
  
  // Scroll to top on click
  backToTopBtn.addEventListener("click", function() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  // Real-time Clock in Footer
  function updateClock() {
    const clockElement = document.getElementById("realTimeClock");
    
    if (clockElement) {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      let seconds = now.getSeconds();
      
      // AM/PM format
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      
      // Add leading zeros
      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;
      
      const timeString = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
      clockElement.textContent = timeString;
    }
  }
  
  // Update clock every second
  updateClock();
  setInterval(updateClock, 1000);

  // Services Page Sorting
  const servicesGrid = document.querySelector('.services-grid');
  const sortSelect = document.getElementById('sort');
  
  if (servicesGrid && sortSelect) {
    let serviceCards = Array.from(servicesGrid.querySelectorAll('.service-card'));
    
    // Get price from card
    function getPrice(card) {
      const priceText = card.querySelector('.price').textContent;
      const priceMatch = priceText.match(/\d+/);
      return priceMatch ? parseInt(priceMatch[0]) : 0;
    }
    
    // Get service name
    function getName(card) {
      return card.querySelector('h3').textContent.trim();
    }
    
    // Fisher-Yates shuffle algorithm
    function shuffleArray(array) {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }
    
    // Render cards to grid
    function renderCards(cards) {
      servicesGrid.innerHTML = '';
      cards.forEach(card => servicesGrid.appendChild(card));
    }
    
    // Display random order on page load
    serviceCards = shuffleArray(serviceCards);
    renderCards(serviceCards);
    
    // Sort on selection change
    sortSelect.addEventListener('change', function() {
      const sortValue = this.value;
      let sortedCards = [...serviceCards];
      
      switch(sortValue) {
        case 'low-high':
          sortedCards.sort((a, b) => getPrice(a) - getPrice(b));
          break;
          
        case 'high-low':
          sortedCards.sort((a, b) => getPrice(b) - getPrice(a));
          break;
          
        case 'a-z':
          sortedCards.sort((a, b) => getName(a).localeCompare(getName(b)));
          break;
          
        case 'z-a':
          sortedCards.sort((a, b) => getName(b).localeCompare(getName(a)));
          break;
      }
      
      renderCards(sortedCards);
      serviceCards = sortedCards;
    });
  }
});
