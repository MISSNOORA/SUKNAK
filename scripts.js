// ============================
// MOBILE SELECT MENU NAVIGATION
// ============================

document.addEventListener("DOMContentLoaded", function () {
  
  const mobileNavSelect = document.getElementById("mobileNavSelect");
  
  if (mobileNavSelect) {
    mobileNavSelect.addEventListener("change", function() {
      const selectedPage = this.value;
      
      if (selectedPage) {
        window.location.href = selectedPage;
      }
    });
  }
  
});

// ============================
// THEME + BACK TO TOP + CLOCK
// ============================

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
  
  window.addEventListener("scroll", function() {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  });
  
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
      
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      
      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;
      
      const timeString = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
      clockElement.textContent = timeString;
    }
  }
  
  updateClock();
  setInterval(updateClock, 1000);

  // Services Page Sorting
  const servicesGrid = document.querySelector('.services-grid');
  const sortSelect = document.getElementById('sort');
  
  if (servicesGrid && sortSelect) {
    let serviceCards = Array.from(servicesGrid.querySelectorAll('.service-card'));
    
    function getPrice(card) {
      const priceText = card.querySelector('.price').textContent;
      const priceMatch = priceText.match(/\d+/);
      return priceMatch ? parseInt(priceMatch[0]) : 0;
    }
    
    function getName(card) {
      return card.querySelector('h3').textContent.trim();
    }
    
    function shuffleArray(array) {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }
    
    function renderCards(cards) {
      servicesGrid.innerHTML = '';
      cards.forEach(card => servicesGrid.appendChild(card));
    }
    
    serviceCards = shuffleArray(serviceCards);
    renderCards(serviceCards);
    
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
  if (!form) return;

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
  if (!form) return;

  const service = document.getElementById("evaluation-service");
  const rating = document.getElementById("evaluation-rating");
  const feedback = document.getElementById("evaluation-feedback");

  form.addEventListener("submit", function (e) {
      e.preventDefault();
      let goodRatings = ["⭐⭐⭐⭐⭐", "⭐⭐⭐⭐"]; 

      if (goodRatings.includes(rating.value)) {
          alert("Thank you! \n\nWe appreciate your positive feedback!");
      } else {
          alert("We’re sorry your experience wasn’t great \n\nWe will improve next time.");
      }

      window.location.href = "UserDashboard.html";
  });

});

// ==========================
// About Us - Join Our Team Form Validation
// ==========================

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


function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
    });
}



// ProviderDashboard - LOADING SERVICES


document.addEventListener("DOMContentLoaded", () => {
    loadServices();
});

// Load Services
function loadServices() {
    const services = JSON.parse(localStorage.getItem("services")) || [];
    const container = document.getElementById("services-container");
    const template = document.getElementById("service-template");

    if (!container || !template) return;

    container.innerHTML = "";

    services.forEach(service => {
        const card = template.content.cloneNode(true);

        card.querySelector(".service-img").src = service.photo;
        card.querySelector(".service-title").textContent = service.name;
        card.querySelector(".service-description").textContent = service.desc;

        container.appendChild(card);
    });
}



// ProviderDashboard - ADDING SERVICES


const addServiceForm = document.getElementById("addServiceForm");

if (addServiceForm) {
    addServiceForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = document.getElementById("serviceName").value.trim();
        const price = document.getElementById("servicePrice").value.trim();
        const desc = document.getElementById("serviceDescription").value.trim();
        const photoInput = document.getElementById("servicePhoto");

        if (!name || !price || !desc || !photoInput.files.length) {
            alert("Please fill in all fields.");
            return;
        }
        if (!isNaN(name.charAt(0))) {
            alert("Service name cannot start with a number.");
            return;
        }
        if (isNaN(price) || Number(price) <= 0) {
            alert("Price must be a valid number.");
            return;
        }

        const photoBase64 = await convertToBase64(photoInput.files[0]);

        const newService = {
            name: name,
            price: price,
            desc: desc,
            photo: photoBase64
        };

        let services = JSON.parse(localStorage.getItem("services")) || [];
        services.push(newService);

        localStorage.setItem("services", JSON.stringify(services));
        alert(`Added Successfully: ${name}`);

        addServiceForm.reset();
    });
}




// ProviderDashboard - LOADING STAFF MEMBERS 


document.addEventListener("DOMContentLoaded", () => {

    if (!localStorage.getItem("staffMembers")) {
        const defaultStaff = [
            { name: "Omar", job: "Home Cleaning", photo: "images/Staff/clean1.png" },
            { name: "Sara", job: "Baby Sitting", photo: "images/Staff/Baby-1.png" },
            { name: "Lina", job: "Home Cleaning", photo: "images/Staff1/clean2.png" },
            { name: "Noor", job: "Baby Sitting", photo: "images/Staff/babysitting2.png" },
            { name: "Faisal", job: "Garden Maintenance", photo: "images/Staff/Garden-1.png" },
            { name: "Hana", job: "Garden Maintenance", photo: "images/Staff1/garden2.png" },
            { name: "Khalid", job: "Furniture Moving", photo: "images/Staff/Moving-1.png" },
            { name: "Rayan", job: "Furniture Moving", photo: "images/Staff1/moving2.png" },
            { name: "Youssef", job: "Private Chef", photo: "images/Staff/Chef-1.png" },
            { name: "Maha", job: "Private Chef", photo: "images/Staff1/chef2.png" },
            { name: "Ali", job: "Home Repair", photo: "images/Staff/Repair-1.png" },
            { name: "Fatimah", job: "Home Repair", photo: "images/Staff1/repair2.png" }
        ];

        localStorage.setItem("staffMembers", JSON.stringify(defaultStaff));
    }

    loadStaffMembers();

    const deleteBtn = document.querySelector(".delete-btn");
    if (deleteBtn) deleteBtn.addEventListener("click", deleteSelectedStaff);

    const addMemberBtn = document.getElementById("addMemberBtn");
    if (addMemberBtn) addMemberBtn.addEventListener("click", addNewMember);
});


// Load Staff Members
function loadStaffMembers() {
    const staffList = JSON.parse(localStorage.getItem("staffMembers")) || [];
    const container = document.getElementById("staff-container");
    const template = document.getElementById("staff-template");

    if (!container || !template) return;

    container.innerHTML = "";

    staffList.forEach(member => {
        const card = template.content.cloneNode(true);

        card.querySelector(".staff-photo").src = member.photo;
        card.querySelector(".staff-photo").alt = member.name;
        card.querySelector(".staff-name").textContent = member.name;
        card.querySelector(".staff-job").textContent = member.job;
        card.querySelector(".staff-checkbox").value = member.name;

        container.appendChild(card);
    });
}


// Delete Selected Staff
function deleteSelectedStaff() {
    const checkboxes = document.querySelectorAll(".staff-checkbox:checked");

    if (checkboxes.length === 0) {
        alert("Please select at least one member");
        return;
    }

    if (!confirm("Are you sure you want to delete selected member(s)?")) {
        return;
    }

    let staffList = JSON.parse(localStorage.getItem("staffMembers")) || [];
    const selectedNames = Array.from(checkboxes).map(cb => cb.value);

    staffList = staffList.filter(member => !selectedNames.includes(member.name));

    localStorage.setItem("staffMembers", JSON.stringify(staffList));
    loadStaffMembers();

    alert("Selected members deleted successfully!");
}



// Add New Staff Member


async function addNewMember() {

    const nameInput = document.getElementById("FullName");
    const emailInput = document.getElementById("email");
    const dobInput = document.getElementById("dob");
    const expertiseInput = document.getElementById("expertise");
    const skillsInput = document.getElementById("skills");
    const educationInput = document.getElementById("education");
    const photoInput = document.getElementById("photo");
    const messageInput = document.getElementById("message");

    if (
        !nameInput.value.trim() ||
        !emailInput.value.trim() ||
        !dobInput.value.trim() ||
        !expertiseInput.value.trim() ||
        !skillsInput.value.trim() ||
        !educationInput.value.trim()
    ) {
        alert("Please fill in all required fields.");
        return;
    }

    if (!isNaN(nameInput.value.trim().charAt(0))) {
        alert("Full Name cannot start with a number.");
        return;
    }

    let photoBase64 = "images/profile.jpeg";

    if (photoInput.files.length > 0) {
        photoBase64 = await convertToBase64(photoInput.files[0]);
    }

    const newMember = {
        name: nameInput.value.trim(),
        job: expertiseInput.value.trim(),
        photo: photoBase64
    };

    let staffList = JSON.parse(localStorage.getItem("staffMembers")) || [];
    staffList.push(newMember);

    localStorage.setItem("staffMembers", JSON.stringify(staffList));

    loadStaffMembers();

    alert(`${newMember.name} has been added successfully!`);

    nameInput.value = "";
    emailInput.value = "";
    dobInput.value = "";
    expertiseInput.value = "";
    skillsInput.value = "";
    educationInput.value = "";
    photoInput.value = "";
    messageInput.value = "";
}

