document.addEventListener("DOMContentLoaded", () =>{
    const setTitleElement=document.getElementById("setTitle");
    const cardsContainer=document.getElementById("cardsContainer");

    let currentSetName= localStorage.getItem("myData");
    let allSets=JSON.parse(localStorage.getItem("allSets")) ||{};
    //currentSetName = currentSetName.replace(/_/g, " ");  

    if(!currentSetName || !allSets[currentSetName]){
        setTitleElement.textContent= "No Set Found";
        return;
    }

    const flashCardSet=allSets[currentSetName];

    //sets the title 
    setTitleElement.textContent=flashCardSet.setName;

    //displays each card created in that set

    flashCardSet.cards.forEach(card => {

        const cardDiv=document.createElement("div");
        cardDiv.className="card";

        const termDiv= document.createElement("div");
        termDiv.className="term";
        termDiv.textContent=card.term;

        const definitionDiv= document.createElement("div");
        definitionDiv.className="definition";
        definitionDiv.textContent=card.definition;

        cardDiv.appendChild(termDiv);
        cardDiv.appendChild(definitionDiv);

        cardsContainer.appendChild(cardDiv);

    });

    document.getElementById("flashcardsButton").addEventListener("click",()=>{
        window.location.href ="flashcardPage.html";
    });

    document.getElementById("quizButton").addEventListener("click",()=>{
        window.location.href ="quiz.html";
    });

    document.getElementById("dashboardButton").addEventListener("click",()=>{
        window.location.href ="dashboard.html";

    });

    document.getElementById("createNewSetButton").addEventListener("click",()=>{
        window.location.href ="createStudySet.html";

    });
})

