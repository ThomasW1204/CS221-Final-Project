const importCard = document.getElementById('import');
const createCard = document.getElementById('create');
const flashCard = document.getElementById('flash');
const quizEz = document.getElementById('quiz');
const homeScreen = document.getElementById('start');
const imageD = document.getElementById('displayPic');


// Event listeners for the cards to redirect to the respective pages
importCard.addEventListener("click",() => {
    window.location.href = "dashboard.html";
});

createCard.addEventListener("click",() => {
    window.location.href = "createStudySet.html";
});

flashCard.addEventListener("click",() => {
    window.location.href = "flashCardPage.html";
});

quizEz.addEventListener("click",() => {
    window.location.href = "quiz.html";
});

homeScreen.addEventListener("click",() => {
    window.location.href = "startingPage.html";
});

//HOMESCREEN
homeScreen.addEventListener("mouseenter", () => {
    imageD.innerHTML = `<img src="../src/client/pages/homeScreen/homeSc.png" alt="homeScreen">`;
});
homeScreen.addEventListener("mouseleave", () => {
    imageD.innerHTML = ``;
});
// DASHBOARD
importCard.addEventListener("mouseenter", () => {
    imageD.innerHTML = `<img src="../src/client/pages/homeScreen/dashboard.png" alt="homeScreen">`;
});
importCard.addEventListener("mouseleave", () => {
    imageD.innerHTML = ``;
});
// CREATE STUDY SET
createCard.addEventListener("mouseenter", () => {
    imageD.innerHTML = `<img src="../src/client/pages/homeScreen/createset.png" alt="homeScreen">`;
});
createCard.addEventListener("mouseleave", () => {
    imageD.innerHTML = ``;
});
//flashCardPage
flashCard.addEventListener("mouseenter", () => {
    imageD.innerHTML = `<img src="../src/client/pages/homeScreen/flashcard.png" alt="homeScreen">`;
});
flashCard.addEventListener("mouseleave", () => {
    imageD.innerHTML = ``;
});
//quizpage 
quizEz.addEventListener("mouseenter", () => {
    imageD.innerHTML = `<img src="../src/client/pages/homeScreen/quiz.png" alt="homeScreen">`;
});
quizEz.addEventListener("mouseleave", () => {
    imageD.innerHTML = ``;
});