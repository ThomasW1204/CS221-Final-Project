
let isFlipped = false;

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





//gotta fetch from the JSON to display the term and def 
//how am i going to know which set the choose. maybe import the chosenSet variable from another page 



const url = `...src\client\shared\flashcardSetDummyData.js` //maybe import the data using import statement 

function fetchTerm(){



}


function fetchDef(){

}



function next() {
  const card = document.getElementById('flashcard');


  // Step 1: Animate off screen right
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

  loadNextCard(); // update card content
  
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



//have cases so the user cant keep going next or prev if they have reached the start or end of the cards
//fix the first card 



let currentCardIndex = 0;

const test = [
  { question: "testq1", answer: "testans1" },
  { question: "testq2", answer: "testans2" },
  { question: "testq3", answer: "testans3" },
];

function loadNextCard() {
  currentCardIndex = (currentCardIndex + 1) % test.length;
  const card = test[currentCardIndex]; 

  document.querySelector('#flashcardContent_question p').textContent = card.question;
  document.querySelector('#flashcardContent_ans p').textContent = card.answer;
  
}


function loadPrevCard(){
  currentCardIndex = (currentCardIndex - 1) % test.length;
  const card = test[currentCardIndex]; 


  document.querySelector('#flashcardContent_question p').textContent = card.question;
  document.querySelector('#flashcardContent_ans p').textContent = card.answer;
}



