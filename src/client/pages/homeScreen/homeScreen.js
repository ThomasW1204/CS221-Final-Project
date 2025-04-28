
const starBtn = document.getElementById("starting");
const impBtn = document.getElementById("import");
const creBtn = document.getElementById("create");
const displayP = document.getElementById("displayPic");


starBtn.addEventListener("click", () => {
  window.location.href = "startingPage.html";
});

impBtn.addEventListener("click", () => {
  window.location.href = "dashboard.html";
});

creBtn.addEventListener("click", () => {
  window.location.href = "createStudySet.html";
});


starBtn.addEventListener("mouseenter", () => {
  displayP.innerHTML ="<img src=../src/client/pages/homeScreen/start.png>"
});

impBtn.addEventListener("mouseenter", () => {
  displayP.innerHTML ="";
});

creBtn.addEventListener("mouseenter", () => {
  displayP.innerHTML ="";
});