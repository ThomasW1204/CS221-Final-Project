document.addEventListener('DOMContentLoaded', () => {
    if(flashcardSets){
        let setP = document.getElementById("setP"); 
        setP.style.display = "none";
    }
    document.addEventListener("input", () =>{
        let set = document.getElementsByClassName("set");
        const setContainer = document.getElementById("flashcardSets");
        let index = 0;
        const flashcardSets = [
            
        ];    
        for(let element of flashcardSets){
            set[index].innerHTML = element.setName;
            set[index].style.display = "block";
            console.log(set[index]);
            index += 1;
            console.log(element.setName);
            if(flashcardSets[index]){
                let newSet = document.createElement("a");
                newSet.textContent = 'This is a new a';
                setContainer.appendChild(newSet);
                newSet.classList.add("set");
                newSet.href = "flashcardPage.html";
                set = document.getElementsByClassName("set");
            }
        }
    });
});
