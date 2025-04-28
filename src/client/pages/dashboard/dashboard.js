let index;
let url = "shared/dummy.json";

//this function just handles displaying the card on the screen
    function displaySets(flashcardSets) {
        const setContainer = document.getElementById("flashcardSets");
       setContainer.innerHTML = ""; 
    
        if (!flashcardSets || flashcardSets.length === 0) {
            document.getElementById("setP").style.display = "block"; 
            return;
        }
    
        document.getElementById("setP").style.display = "none";
    
        for (let setName of flashcardSets) {
            console.log(setName)
            const newSet = document.createElement("a");
            newSet.textContent = setName;
            newSet.classList.add("set");
            newSet.href = "studySet.html";
            setContainer.appendChild(newSet);
        }
    }
let set = document.getElementsByClassName("set");


document.addEventListener('DOMContentLoaded', async () => { //when the dom is loaded
  let flashcardSets =[];

    flashcardSets = getAllSetNames();   //get all the names in allsets
 console.log(flashcardSets)
   displaySets(flashcardSets);   //display all the set names from allsets
    
     document.addEventListener("click", (event) => {
        if (event.target.classList.contains("set")) {
            console.log(event.target.innerHTML);

            let currentSetName = event.target.innerHTML;   

            //currentSetName = currentSetName.replace(/_/g, " "); just in case
        
            localStorage.setItem("myData", currentSetName); //when user clicks a set save that set name to myData
        }
    });

    document.getElementById("fileUpload").addEventListener("change", handleFileUpload);  //when handle file upload
});



//saves the newset to allsets local storage
function saveSetToAllSets(newSet) {
    let allSets = JSON.parse(localStorage.getItem("allSets")) || {};
    allSets[newSet.setName] = newSet; 
    localStorage.setItem("allSets", JSON.stringify(allSets));
}

//get just the names from all sets
function getAllSetNames() {
    const allSets = JSON.parse(localStorage.getItem("allSets")) || {}; 
    const setNames = Object.keys(allSets); 
    console.log(setNames)
    return setNames; 
}

//handles json uploads and ensures its formatted correctly
function handleFileUpload(){
    
    const file = event.target.files[0];
    if (!file) {
        console.log("No file selected.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            const parts = file.name.split(".");
            const newSetName = parts[0];

            if (!importedData.cards || !Array.isArray(importedData.cards)) {
                console.error("Invalid data format. Missing or incorrect 'cards' array.");
                return;
            }

            // Save into allSets
            saveSetToAllSets({
                setName: newSetName,
                cards: importedData.cards 
            });

        
            const updatedSets = getAllSetNames(); //get the set names 
            displaySets(updatedSets); //display the sets
        } catch (error) {
            console.error("Error parsing uploaded file:", error);
        }
    };
    reader.readAsText(file);

}

