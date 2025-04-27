document.addEventListener("DOMContentLoaded",()=>{
    const cardsContainer = document.getElementById("cardsContainer");
    const addCardbutton = document.getElementById("addCard");
    const exportSetBtn= document.getElementById("exportSet");
    const createStudySet=document.getElementById("createStudySet");
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

       // const imageInput=document.createElement("input");
        //imageInput.type="text";
        //imageInput.placeholder="Enter image URL (optional)";

        cardDiv.appendChild(termInput);
        cardDiv.appendChild(definitionTextArea);
       // cardDiv.appendChild(imageInput);
        
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


        //loops throught flashcard created in the set
        const cards= Array.from(cardsContainer.children).map(card =>{
            const inputs= card.querySelectorAll("input, textarea");
            return{
                term:inputs[0].value.trim(),
                definition: inputs[1].value.trim(),
               // image:inputs[2].value.trim()||null
            };
        }).filter(card=> card.term && card.definition); //filter keeps the cards that have at least a term and definition

        return{setName,cards};
    };

    //created a method to save/update setToLocalStorge so that other pages can pull from user's localStorage

    const saveSetToLocalStorage =(flashCardSet)=>{

        const allSets =JSON.parse(localStorage.getItem("allSets"))||{};
        allSets[flashCardSet.setName]=flashCardSet;
        localStorage.setItem("allSets",JSON.stringify(allSets));
        
    };

    //button used to export file as JSON
    exportSetBtn.addEventListener("click",()=>{

        const flashCardSet=collectFlashcardSet();
        if(!flashCardSet) return;

        saveSetToLocalStorage(flashCardSet);


        //exports files of set just created
        const flashCardSetBlob= new Blob([JSON.stringify(flashCardSet,null,2)], {type:"application/json"});
        const flashCardSetURL= URL.createObjectURL(flashCardSetBlob);
        const flashCardSetLink=document.createElement("a");
        flashCardSetLink.href=flashCardSetURL;
        flashCardSetLink.download= `${flashCardSet.setName.replace(/\s+/g,'_')}.json`;
        flashCardSetLink.click();
        URL.revokeObjectURL(flashCardSetURL);
    
    });

    //view Flashcards via flashcardPage.html
    createStudySet.addEventListener("click",()=>{


        //collects flashCards if the user made some;returns if not
        const flashCardSet=collectFlashcardSet();
        if(!flashCardSet) return;

        //saves set user just created by it's title in their localstorage
        saveSetToLocalStorage(flashCardSet);

        //helps flashcardPage.html know by setName which file to let the viewer see (the one just uploaded)
        localStorage.setItem("currentSet",flashCardSet.setName);
        window.location.href ="studySet.html";
    });

    //adds first card by default
    addCardbutton.click();


});