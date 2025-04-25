document.addEventListener("DOMContentLoaded",()=>{
    const cardsContainer = document.getElementById("cardsContainer");
    const addCardbutton = document.getElementById("addCard");
    const exportSetBtn= document.getElementById("exportSet");
    const viewFlashCardButton=document.getElementById("viewFlashcards");
    const setTitleInput= document.getElementById("setTitle");
 
    //creates card DOM element
    const createCardElement= () =>{
        const cardDiv = document.createElement("div");
        cardDiv.className = "card";

        const termInput=document.createElement("input");
        termInput.type="text";
        termInput.placeholder = "Enter term...";

        const definitionTextArea=document.createElement("textarea");
        definitionTextArea.placeholder="Enter definition.";

        //makes defintion text area dynamically increase/decrease in size so user can see everything they have typed
        definitionTextArea.addEventListener("input",()=>{
            definitionTextArea.style.height="auto";

            //sets to full height
            definitionTextArea.style.height=definitionTextArea.scrollHeight+"px";
        })

        const imageInput=document.createElement("input");
        imageInput.type="text";
        imageInput.placeholder="Enter image URL (optional)";

        cardDiv.appendChild(termInput);
        cardDiv.appendChild(definitionTextArea);
        cardDiv.appendChild(imageInput);
        
        return cardDiv;
    };

    //adds card when button is clicked
    addCardbutton.addEventListener("click", ()=>{
        const card = createCardElement();
        cardsContainer.appendChild(card);

    });

    //gathers set data from the UI
    const collectFlashcardSet=() =>{
        const setName= setTitleInput.value.trim();
        if (!setName){
            alert("Please enter a set name.");
            return null;
        }

        const cards= Array.from(cardsContainer.children).map(card =>{
            const inputs= card.querySelectorAll("input, textarea");
            return{
                term:inputs[0].value.trim(),
                definition: inputs[1].value.trim(),
                image:inputs[2].value.trim()||null
            };
        }).filter(card=> card.term && card.definition);

        return{setName,cards};
    };

    //button used to export file as JSON
    exportSetBtn.addEventListener("click",()=>{

        const flashCardSet=collectFlashcardSet();
        if(!flashCardSet) return;

        const setName=flashCardSet.setName;

        localStorage.setItem(setName,JSON.stringify(flashCardSet));

        //uses let so numbers of sets can be increased
        let allTitles=JSON.parse(localStorage.getItem("setTitles"))||[];
        if(!allTitles.includes(setName)){
            allTitles.push(setName);
            localStorage.setItem("setTitles",JSON.stringify(allTitles));
        }

        
        const flashCardSetBlob= new Blob([JSON.stringify(flashCardSet,null,2)], {type:"application/json"});
        const flashCardSetURL= URL.createObjectURL(flashCardSetBlob);
        const flashCardSetLink=document.createElement("a");
        flashCardSetLink.href=flashCardSetURL;
        flashCardSetLink.download= `${flashCardSet.setName.replace(/\s+/g,'_')}.json`;
        flashCardSetLink.click();
        URL.revokeObjectURL(flashCardSetURL);


        const titlesBlob= new Blob([JSON.stringify(allTitles,null,2)], {type:"application/json"});
        const titlesURL= URL.createObjectURL(titlesBlob);
        const titlesLink=document.createElement("a");
       
        titlesLink.href=titlesURL;
        titlesLink.download= `setTitles.json`;
        titlesLink.click();
        URL.revokeObjectURL(titlesURL);
    
    });

    //view Flashcards via flashcardPage.html
    viewFlashCardButton.addEventListener("click",()=>{


        //collects flashCards if the user made some;returns if not
        const flashCardSet=collectFlashcardSet();
        if(!flashCardSet) return;

        //saves set user just created by it's title in their locla storage
        localStorage.setItem(flashCardSet.setName,JSON.stringify(flashCardSet));

        //updates the titles list in user's local storage and if there is not a setTitles, adds set to an empty list
        const title=JSON.parse(localStorage.getItem("setTitles"))||[];
        if(!title.includes(flashCardSet.setName)){
            title.push(flashCardSet.setName);
            localStorage.setItem("setTitles",JSON.stringify(title));
        }

 
        //helps flashcardPage.html know by setName which file to let the viewer see (the one just uploaded)
        localStorage.setItem("currentSet",flashCardSet.setName);
        window.location.href ="flashcardPage.html";
    });

    //adds first card by default
    addCardbutton.click();


});