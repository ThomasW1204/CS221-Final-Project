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
            let temp = localStorage.getItem("tempData");
            if(temp !== null){
                const storedData = localStorage.getItem("tempData");
                const parsedData = JSON.parse(storedData);
                console.log(parsedData);
                console.log(parsedData.Set)
                let newSetWord = "";
                let list = [];
                for(let element of parsedData.Set){
                    if(element.length == 1){
                        newSetWord += element;
                    }else{
                        list.push(element);
                    }
                }
                console.log(newSetWord);
                list.unshift(newSetWord);
                for(let element of list){
                    console.log(element);
                    flashcardSets.push(element);
                }
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
            localStorage.setItem("myData", newSetName);
            const storedData = localStorage.getItem('myData');
            set[set.length - 1].innerHTML = storedData;
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
    PData(url, true); 
    const setContainer = document.getElementById("flashcardSets");

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
                const newSetName = parts2[0]; 
                PData(url, false, newSetName); 
                let temp = localStorage.getItem("tempData");
                if(temp !== null){
                    const storedData = localStorage.getItem("tempData");
                    const parsedData = JSON.parse(storedData);
                    let newSetAdded = parsedData;
                    if(newSetAdded.Set){
                        newSetAdded = {Set: [...newSetAdded.Set, parts2[0]]};
                    }
                    else{
                        newSetAdded = {Set: [...newSetAdded.Set, parts2[0]]};
                    }
                    console.log(newSetAdded);
                    localStorage.setItem("tempData", JSON.stringify(newSetAdded));
                }
                else{
                    localStorage.setItem("tempData", JSON.stringify({Set: parts2[0]}));
                }
            } catch (error) {
                console.error("Error parsing uploaded file:", error);
            }
        };
        reader.readAsText(file);
    });

    document.addEventListener("change", () => {
        let clickEvent = 0;
        set = document.getElementsByClassName("set");
        for (let element of set) {
            element.addEventListener("click", () => {
                console.log(element.innerHTML);
                let file = element.innerHTML;
              //  const data = { Set: file };
                localStorage.setItem("myData", file);
            });
        }
    });
});



function saveSetToAllSets(newSet) {
    let allSets = JSON.parse(localStorage.getItem("allSets")) || {};
    allSets[newSet.setName] = newSet; 
    localStorage.setItem("allSets", JSON.stringify(allSets));
}