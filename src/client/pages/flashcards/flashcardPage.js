
let ques =[];
let answ =[];
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







//need to add an event listener for the arrows so that we can pass in quest and answer to load the card????!!!!!!!!!!
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


//ADD CATCHES FOR ERRORS 

async function getData() {
  const response = await fetch("/src/client/pages/flashcards/dummy.json");
  const data = await response.json();
  return data;
}


async function PData(){
  const data = await getData(); 
  let i = 0;
  data.forEach(item => {
    ques.push(item.question)
    answ.push(item.answer)
    console.log(ques[i])
    console.log(answ[i])
i++;
  });
}



PData()
console.log("output")



let currentCardIndex = 0;


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



