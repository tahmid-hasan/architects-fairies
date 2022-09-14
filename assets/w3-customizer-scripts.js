document.addEventListener('DOMContentLoaded', (event) => {
  var btnList = document.querySelectorAll(".po-customizer-tabs a");
  for (i = 0; i < btnList.length; ++i) {
    btnList[i].addEventListener("click", function(e){
     	e.preventDefault();
      e.stopPropagation();
      var a = e.currentTarget;
      var href = a.getAttribute("href");
      
      var existing = document.querySelector(".existing-slider");
      var live = document.querySelector(".live-preview-tab");
      
      (document.querySelectorAll(".po-customizer-tabs a")).forEach((el) => el.classList.remove("tab-active"));
      a.classList.add("tab-active");
      
      if (href == "#tab-1") {
        live.style.display = '';
        existing.style.display = 'none';
      } else {
        live.style.display = 'none';
        existing.style.display = '';
      }

      window.dispatchEvent(new Event('resize'));
      
    });
  }
});