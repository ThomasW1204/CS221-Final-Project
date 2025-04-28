const importCard = document.getElementById('import');
const createCard = document.getElementById('create');
const flashCard = document.getElementById('flash');
const quizEz = document.getElementById('quiz');

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