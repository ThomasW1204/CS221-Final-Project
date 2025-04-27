//figure out where the buttons are going to link to.

//style everything better

//maybe fix the fact that when you flip the card and go to the next card it shows answer. (always default to term) 

//for the dashboard page, all data needs to be reread when the page loads again or something like that.

let isFlipped = false;


//animate the flipping 
function flipCard(){
isFlipped = !isFlipped;
// Flip the card
anime({
  targets: '#flashcard',
  rotateY: isFlipped ? '180deg' : '0deg', // Flip card
  duration: 800,
  easing: 'easeInOutSine'
});

setTimeout(() => {

if (isFlipped) {
  // After the flip, show the answer and hide the question
  document.getElementById('flashcardContent_question').style.display = 'none';
  document.getElementById('flashcardContent_ans').style.display = 'block';
} else {
  // On reverse flip, show the question and hide the answer
  document.getElementById('flashcardContent_question').style.display = 'block';
  document.getElementById('flashcardContent_ans').style.display = 'none';
}
}, 400);
}


//animate the next card and calls on loadnextCard
function next() {
  const card = document.getElementById('flashcard');

  //off screen right
  anime({
    targets: card,
    translateX: '100%',
    duration: 800,
    easing: 'easeInOutSine'
  });

  // jump to off-screen left and update content
  setTimeout(() => {
    anime({
      targets: '#flashcard',
      translateX: '-100%',
      duration: 0 
    });

    loadNextCard()

  }, 500);

  // Animate to center
  setTimeout(() => {
    anime({
      targets: card,
      translateX: '0%',
      duration: 800,
      easing: 'easeInOutSine',
    
    });
  }, 500); 
}


//animate previous card and calls loadprevCard 
function back() {
  const card = document.getElementById('flashcard');

  //Animate off screen right
  anime({
    targets: card,
    translateX: '-100%',
    duration: 800,
    easing: 'easeInOutSine'
  });

  //jump to off-screen left and update content
  setTimeout(() => {
    anime({
      targets: '#flashcard',
      translateX: '100%',
      duration: 0 
    });

  loadPrevCard(); // update card content
  
  }, 500);

  //Animate to center
  setTimeout(() => {
    anime({
      targets: card,
      translateX: '0%',
      duration: 800,
      easing: 'easeInOutSine',
    
    });
  }, 500);
}


let ques =[];
let answ =[];
let currentCardIndex = 0;


function loadNextCard() {
  currentCardIndex = (currentCardIndex + 1) % ques.length;
  document.querySelector('#flashcardContent_question p').textContent = ques[currentCardIndex];
  document.querySelector('#flashcardContent_ans p').textContent = answ[currentCardIndex];
  
  
  document.getElementById("flashcardNumber").textContent = "Flashcard " + (currentCardIndex + 1) + "/" + ques.length //change number 
  
  updateArrowVisibility();  //see if the arrow needs to be hidden
}


function loadPrevCard(){
  currentCardIndex = (currentCardIndex - 1 + ques.length) % ques.length;
  document.querySelector('#flashcardContent_question p').textContent = ques[currentCardIndex];
  document.querySelector('#flashcardContent_ans p').textContent = answ[currentCardIndex];
   
  document.getElementById("flashcardNumber").textContent = "Flashcard " + (currentCardIndex +1)+ "/" + ques.length //change number
  
  
  
  updateArrowVisibility(); //see if arrow needs to be hidden
}


//this function sees if the user reaches the beginning or end of the set
// and hides the arrow so they can't keep going if there are no cards left.
function updateArrowVisibility() {
  const leftArrow = document.getElementById("leftArrow");
  const rightArrow = document.getElementById("rightArrow");

  if (currentCardIndex === 0) {
    leftArrow.style.display = "none";
  } else {
    leftArrow.style.display = "block";
  }

  if (currentCardIndex === ques.length - 1) {
    rightArrow.style.display = "none";
  } else {
    rightArrow.style.display = "block";
  }
}


/*might delete this temp comment out just incase

async function getSelectedSetData(dataFile) {
  const response = await fetch(dataFile);

  if (!response.ok) {
    throw new Error(`Failed to load ${dataFile}: ${response.status}`);
  }

  const data = await response.json();
  return data.cards; 
}
  */



//loads the quest and answ arrays to read from and loads the first card
function displayCards(cards) {
  cards.forEach((item, i) => {
    ques.push(item.term);  
    answ.push(item.definition);  
    console.log(ques[i]);
    console.log(answ[i]);
  });


  document.querySelector('#flashcardContent_question p').textContent = ques[currentCardIndex];
  document.querySelector('#flashcardContent_ans p').textContent = answ[currentCardIndex];

  document.getElementById("flashcardNumber").textContent = "Flashcard " + (currentCardIndex +1)+ "/" + ques.length
  updateArrowVisibility();


}



document.addEventListener('DOMContentLoaded', async () => {
  console.log("LocalStorage:", localStorage);

  const storedData = localStorage.getItem("myData");  //get the user selected set from myData
  console.log(storedData)

  if (storedData) {
    console.log("Found storedData:", storedData);  

    const parsedData = JSON.parse(storedData);
    let setTitle = parsedData.Set;  
    console.log("Selected set:", setTitle); 


    setTitle = setTitle.replace("_", " ");  // This replaces underscore with a space

 document.getElementById("setName").textContent = setTitle  //set the name on the page to the users selected set


    console.log(setTitle);
    const allSets = localStorage.getItem("allSets"); //get every set from allSets

    if (allSets) {
      console.log("All sets:", allSets);  

      const sets = JSON.parse(allSets);  
      console.log("Parsed allSets:", sets);  

      
      const selectedSetData = sets.find(set => set.setName === setTitle); //search allSets for the user selected set 

      if (selectedSetData) {
        console.log("Selected set data:", selectedSetData);

        displayCards(selectedSetData.cards);  //load the quest and answ arrays 
      } else {
        console.log(`Set '${setTitle}' not found in allSets.`);
      }
    } else {
      console.log("No sets found in localStorage.");
    }
  } else {
    console.log("No set selected.");
    
  }
});


//this is for the back button. when the user presses it, it goes back to the previous page the user was on
// it also deselects the user selected set by clearing myData because they are not on that set anymore.
document.getElementById("backButton").addEventListener("click",()=>{
  localStorage.setItem("myData", "")
  history.back()

});


