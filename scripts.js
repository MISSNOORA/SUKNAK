document.addEventListener("DOMContentLoaded", function () {
  // تحميل الثيم المحفوظ عند فتح أي صفحة
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
  }

  // زر تبديل الثيم
  var themeBtn = document.getElementById("themeToggle");
  if (themeBtn) {
    // تحديث نص الزر بناءً على الثيم الحالي
    updateButtonText();
    
    themeBtn.addEventListener("click", function () {
      document.body.classList.toggle("dark-theme");
      
      // حفظ الحالة في localStorage
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
});
