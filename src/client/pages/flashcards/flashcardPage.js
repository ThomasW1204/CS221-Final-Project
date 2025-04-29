
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


//flips the flashcard back to the question side if it’s showing the answer then animates moves to the next flashcard.
function next() {
  const card = document.getElementById('flashcard');

  if (isFlipped) {
    // Flip back to front side first
    anime({
      targets: card,
      rotateY: '0deg',
      duration: 40,
      easing: 'easeInOutSine'
    });
    isFlipped = false;

    // Swap content after flip
    setTimeout(() => {
      document.getElementById('flashcardContent_question').style.display = 'block';
      document.getElementById('flashcardContent_ans').style.display = 'none';

      moveNextCard(); // slide after flip
    }, 40);
  } else {
    moveNextCard(); // if not flipped, slide right away
  }
}


//animates the sliding
function moveNextCard() {
  const card = document.getElementById('flashcard');

  // off screen right
  anime({
    targets: card,
    translateX: '100%',
    opacity: 0,
    duration: 800,
    easing: 'easeInOutSine'
  });

  setTimeout(() => {
    anime({
      targets: card,
      translateX: '-100%',
      duration: 0
    });

    loadNextCard(); // load next question

    anime({
      targets: card,
      translateX: '0%',
      opacity: 1,
      duration: 800,
      easing: 'easeInOutSine'
    });
  }, 800);
}

//flips the flashcard back to the question side if it’s showing the answer then animates moves to the prev flashcard.
function back() {
  const card = document.getElementById('flashcard');

  if (isFlipped) {
    // Flip back to front side first
    anime({
      targets: card,
      rotateY: '0deg',
      duration: 40,
      easing: 'easeInOutSine'
    });
    isFlipped = false;

    setTimeout(() => {
      document.getElementById('flashcardContent_question').style.display = 'block';
      document.getElementById('flashcardContent_ans').style.display = 'none';

      movePrevCard(); // now slide after flip
    }, 40);
  } else {
    movePrevCard(); // if not flipped, slide right away
  }
}


//slided the card left
function movePrevCard() {
  const card = document.getElementById('flashcard');

  // off screen left
  anime({
    targets: card,
    translateX: '-100%',
    opacity: 0,
    duration: 800,
    easing: 'easeInOutSine'
  });

  setTimeout(() => {
    anime({
      targets: card,
      translateX: '100%',
      duration: 0
    });

    loadPrevCard(); // load previous question

    anime({
      targets: card,
      translateX: '0%',
      opacity: 1,
      duration: 800,
      easing: 'easeInOutSine'
    });
  }, 800);
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

    
    let setTitle = storedData;
    
    console.log("Selected set:", setTitle); 


    //setTitle = setTitle.replace(/_/g, " ");  // Replaces all underscores with a space

 document.getElementById("setName").textContent = setTitle  //set the name on the page to the users selected set


    console.log(setTitle);
    const allSets = localStorage.getItem("allSets"); //get every set from allSets

    if (allSets) {
      console.log("All sets:", allSets);  

      const sets = JSON.parse(allSets);  
      console.log("Parsed allSets:", sets);  


      const selectedSetData = sets[setTitle];  //search all sets for the user selected set
    

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

  const selectedSet=localStorage.getItem("myData");
  if(selectedSet){

    localStorage.setItem("myData",selectedSet);

  }
  
  window.location.href="studySet.html";

});




// need it to default to the "term" side. 