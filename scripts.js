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
// ==========================
// UserDashboard-request page
// ==========================
document.addEventListener("DOMContentLoaded", function () {
  
  const form = document.querySelector(".request-form");
  const fullName = document.getElementById("fullname");
  const date = document.getElementById("date");
  const description = document.getElementById("request-description");
  const service = document.getElementById("user-request-service");
  const worker = document.getElementById("request-worker");
  const requestList = document.getElementById("requests-list");

  
  const workersByService = {
    "Home cleaning": ["Omar", "Lina"],
    "Baby sitting": ["Sara", "Noor"],
    "Garden maintenance": ["Faisal", "Hana"],
    "Furniture moving": ["Khalid", "Rayan"],
    "Private cook": ["Youssef", "Maha"],
    "Home repair": ["Ali", "Fatimah"]
  };

  service.addEventListener("change", function () {
    worker.innerHTML = '<option value="">Choose a worker</option>'; 

    const selectedService = service.value;
    const availableWorkers = workersByService[selectedService] || [];

    availableWorkers.forEach(w => {
      const option = document.createElement("option");
      option.value = w;
      option.textContent = w;
      worker.appendChild(option);
    });
  });

  
  
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let errors = [];

    
    const nameValue = fullName.value.trim();
    const nameRegex = /^[A-Za-z ]+$/;

    if (!nameValue.includes(" "))
      errors.push("Full name must include first and last name.");

    if (!nameRegex.test(nameValue))
      errors.push("Full name must not contain numbers or symbols.");

    
    if (service.value === "")
      errors.push("Please select a service.");

    
    if (worker.value === "")
      errors.push("Please select a worker.");

   
    if (description.value.trim().length < 100)
      errors.push("Description must be at least 100 characters.");

   
    let selected = new Date(date.value);
    selected.setHours(0, 0, 0, 0);

    let today = new Date();
    today.setHours(0, 0, 0, 0);

    let tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    
    if (selected < today) {
      errors.push("You cannot select a past date.");
    }

    
    if (selected.getTime() === today.getTime()) {
      errors.push("You cannot select today as the due date.");
    }

    
    if (selected.getTime() === tomorrow.getTime()) {
      errors.push("You cannot select tomorrow as the due date.");
    }

    
    if (errors.length > 0) {
      alert("Please fix the following:\n\n" + errors.join("\n"));
      return;
    }

   
    let userChoice = confirm(
      "Request sent successfully!\n\nDo you want to stay on this page or return to the dashboard?"
    );

    if (userChoice) {
  addRequestToPage(
    fullName.value,
    date.value,
    description.value,
    service.value,
    worker.value
  );
} else {
  window.location.href = "UserDashboard.html";
}

  });

  
  function addRequestToPage(fullname, date, description, service, worker) {
    const container = document.getElementById("requests-list");

    
    const box = document.createElement("div");
    box.classList.add("added-request-box");

    
    box.style.border = "1.5px solid #2F4156";
    box.style.padding = "15px";
    box.style.marginTop = "15px";
    box.style.borderRadius = "8px";
    box.style.fontSize = "15px";
    box.style.backgroundColor = "#fff";

    box.innerHTML = `
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Full Name:</strong> ${fullname}</p>
        <p><strong>Due Date:</strong> ${date}</p>
        <p><strong>Description:</strong> ${description}</p>
        <p><strong>Worker:</strong> ${worker}</p>
    `;

    
    container.appendChild(box);

  }

});
// ==========================
// Evaluation Form 
// ==========================
document.addEventListener("DOMContentLoaded", function () {

    const form = document.querySelector(".evaluation-form");
    const service = document.getElementById("evaluation-service");
    const rating = document.getElementById("evaluation-rating");
    const feedback = document.getElementById("evaluation-feedback");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        let errors = [];

        
        if (service.value === "") {
            errors.push("Please select a service.");
            service.style.border = "";
        } 

        
        if (rating.value === "") {
            errors.push("Please select a rating.");
            rating.style.border = "";
        }

        
        if (feedback.value.trim() === "") {
            errors.push("Please enter your feedback.");
		feedback.style.border = "";}
        

        
        if (errors.length > 0) {
            alert("Please fix the following:\n\n" + errors.join("\n"));
            return;
        }

        
        let goodRatings = ["⭐⭐⭐⭐⭐", "⭐⭐⭐⭐"]; 

        if (goodRatings.includes(rating.value)) {
            alert("Thank you! \n\nWe appreciate your positive feedback!");
        } else {
            alert("We’re sorry your experience wasn’t great \n\nWe will improve next time.");
        }

        
        window.location.href = "UserDashboard.html";
    });

});
// About Us - Join Our Team Form Validation

function validateJoinForm() {
  var fullName  = document.getElementById("FullName");
  var email     = document.getElementById("email");
  var dob       = document.getElementById("dob");
  var expertise = document.getElementById("expertise");
  var skills    = document.getElementById("skills");
  var education = document.getElementById("education");
  var photo     = document.getElementById("photo");
  var message   = document.getElementById("message");


  var errors = "";

  
  if (fullName.value == "") {
    errors += "- Full Name cannot be empty.\n";
  }
  if (email.value == "") {
    errors += "- Email cannot be empty.\n";
  }
  if (dob.value == "") {
    errors += "- Date of Birth cannot be empty.\n";
  }
  if (expertise.value == "") {
    errors += "- Area of Expertise cannot be empty.\n";
  }
  if (skills.value == "") {
    errors += "- Skills cannot be empty.\n";
  }
  if (education.value == "") {
    errors += "- Education cannot be empty.\n";
  }
  if (photo.value == "") {
    errors += "- Please choose a photo.\n";
  }

 
  if (fullName.value != "" && fullName.value.search(/^[0-9]/) != -1) {
    errors += "- Name cannot start with a number.\n";
  }

  if (photo.value != "" && photo.value.search(/\.(jpg|jpeg|png|gif)$/i) == -1) {
    errors += "- Photo must be an image file (jpg, jpeg, png, gif).\n";
  }

  
  if (dob.value != "") {
    var dobDate = new Date(dob.value);
    var year    = dobDate.getFullYear();
    if (year > 2008) {
      errors += "- Date of birth must be in 2008 or earlier.\n";
    }
  }

  if (errors != "") {
    alert("Please fix the following:\n\n" + errors);
    return false;
  }

  
  alert(
    "Thank you, " + fullName.value +
    "!\nYour request to join the team has been received."
  );


  fullName.value  = "";
  email.value     = "";
  dob.value       = "";
  expertise.value = "";
  skills.value    = "";
  education.value = "";
  photo.value     = "";
  message.value   = "";

  
  return false;
}
