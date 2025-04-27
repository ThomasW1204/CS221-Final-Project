let flashcardSets =[];
let index;
let url = "shared/dummy.json";
function displaySets(FileOrLocal,newSetName){
    if(flashcardSets != []){
        let setP = document.getElementById("setP");
        let set = document.getElementsByClassName("set"); 
        const setContainer = document.getElementById("flashcardSets");
        setP.style.display = "none";
        let index = 0;
        if(FileOrLocal){
            if(localStorage.getItem("tempData") == null){
                localStorage.setItem("tempData", JSON.stringify(newSetName));
                const storedData = localStorage.getItem("tempData");
                const parsedData = JSON.parse(storedData);
                flashcardSets.push(parsedData.Set);
            }
            for(let element of flashcardSets){
                set[index].innerHTML = element;
                set[index].style.display = "block";
                index += 1;
                if(flashcardSets[index]){
                    let newSet = document.createElement("a");
                    newSet.textContent = 'This is a new a';
                    setContainer.appendChild(newSet);
                    newSet.classList.add("set");
                    newSet.href = "flashcardPage.html";
                    set = document.getElementsByClassName("set");
                }
            }
        } else{
            let newSet = document.createElement("a");
            newSet.textContent = 'This is a new a';
            console.log(2);
            setContainer.appendChild(newSet);
            newSet.classList.add("set");
            newSet.href = "flashcardPage.html";
            set = document.getElementsByClassName("set");
            localStorage.setItem("myData", JSON.stringify(newSetName));
            const storedData = localStorage.getItem('myData');
            const parsedData = JSON.parse(storedData);
            set[set.length - 1].innerHTML = parsedData.Set;
            set[set.length - 1].style.display = "block";
        }
        }
    }
async function getData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
    const data = await response.json();
    return data;
    } catch (error) {
        console.error(error.message);
    }
}
async function PData(url,FileOrLocal,newSetName){
    const data = await getData(url); 
    let i = 0;
    for(let element of data.setNames){
      flashcardSets.push(element);
      i++;
    }
    displaySets(FileOrLocal,newSetName);

}


let set = document.getElementsByClassName("set");

document.addEventListener('DOMContentLoaded', () => {
    PData(url, true); // load initial flashcards from your server dummy.json
    const setContainer = document.getElementById("flashcardSets");

    // (changed) listen for file upload
    document.getElementById("fileUpload").addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (!file) {
            console.log("No file selected.");
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                saveSetToAllSets(importedData);

                const parts2 = file.name.split(".");
                const parts3 = { Set: parts2[0] };
                PData(url, false, parts3);
            } catch (error) {
                console.error("Error parsing uploaded file:", error);
            }
        };
        reader.readAsText(file);
    });

    // still the same: click events for flashcard sets
    document.addEventListener("change", () => {
        let clickEvent = 0;
        set = document.getElementsByClassName("set");
        for (let element of set) {
            element.addEventListener("click", () => {
                console.log(element.innerHTML);
                let file = element.innerHTML + ".json";
                const data = { Set: file };
                localStorage.setItem("myData", JSON.stringify(data));
            });
        }
    });
});



function saveSetToAllSets(newSet) {
    let allSets = JSON.parse(localStorage.getItem("allSets")) || [];
    allSets.push(newSet); // newSet should be an object (your imported data)
    localStorage.setItem("allSets", JSON.stringify(allSets));
}




//gotta load the content of the card into the allsets after importing. 
//dashboard needs to reload sets from all sets when the user goes back