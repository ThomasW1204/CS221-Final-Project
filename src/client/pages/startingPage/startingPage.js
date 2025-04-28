const closeButton = document.getElementById("close");
const startButton = document.getElementById("start");


closeButton.addEventListener("click",() => {
    window.location.href = "https://google.com";
});

startButton.addEventListener("click",() => {
    window.location.href = "homeScreen.html";
});