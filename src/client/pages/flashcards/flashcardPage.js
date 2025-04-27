

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


let ques =[];
let answ =[];
let currentCardIndex = 0;




//async function getData() {
//  const response = await fetch("/src/client/pages/flashcards/dummy.json");
//  const data = await response.json();
//  return data;
//}


/*
document.addEventListener('DOMContentLoaded',  async () => {
  const setTitle = localStorage.getItem("selectedSet");
  
  if (setTitle) {
    console.log("Selected set:", setTitle);
    
    // Construct the file path for the JSON file based on the set title
    let dataFile = `flashcards/${setTitle}.json`; // Assume JSON files are named like "history.json"
    
    try {
      const cards = await getSelectedSetData(dataFile); // Fetch and parse the flashcard data
      displayCards(cards); // Function to display the flashcards
    } catch (error) {
      console.error("Error loading flashcards:", error);
    }
  } else {
    console.log("No set selected.");
  }
});



async function getSelectedSetData(dataFile) {
  const response = await fetch(dataFile);
  
  if (!response.ok) {
    throw new Error(`Failed to load ${dataFile}: ${response.status}`);
  }
  
  const data = await response.json();
  
  return data.cards;
}



/*
async function PData(){
  const data = await getSelectedSetData(dataFile); 
  let i = 0;
  data.forEach(item => {
    ques.push(item.question)
    answ.push(item.answer)
    console.log(ques[i])
    console.log(answ[i])
i++;
  });
}
  

PData().then(() => {
  // Now you can safely use ques and answ because PData is finished
  console.log("Now we can access the data outside the function!");
  console.log("All questions:", ques);
  console.log("All answers:", answ);


// Show first card content
document.querySelector('#flashcardContent_question p').textContent = ques[0];
document.querySelector('#flashcardContent_ans p').textContent = answ[0];
document.getElementById("flashcardNumber").textContent = "flashcard 1/" + ques.length;

// Hide answer side initially
document.getElementById('flashcardContent_question').style.display = 'block';
document.getElementById('flashcardContent_ans').style.display = 'none';

document.getElementById("flashcardNumber").textContent = "flashcard" + (currentCardIndex +1)  + "/" + ques.length


  updateArrowVisibility();
});



*/


function loadNextCard() {
  currentCardIndex = (currentCardIndex + 1) % ques.length;
  document.querySelector('#flashcardContent_question p').textContent = ques[currentCardIndex];
  document.querySelector('#flashcardContent_ans p').textContent = answ[currentCardIndex];
  
  document.getElementById("flashcardNumber").textContent = "flashcard" + (currentCardIndex + 1) + "/" + ques.length
  updateArrowVisibility();  
}


function loadPrevCard(){
  currentCardIndex = (currentCardIndex - 1 + ques.length) % ques.length;
  document.querySelector('#flashcardContent_question p').textContent = ques[currentCardIndex];
  document.querySelector('#flashcardContent_ans p').textContent = answ[currentCardIndex];

  document.getElementById("flashcardNumber").textContent = "flashcard" + (currentCardIndex +1)+ "/" + ques.length
  updateArrowVisibility();
}





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















// Fetch flashcard data from the specific file
async function getSelectedSetData(dataFile) {
  const response = await fetch(dataFile);

  if (!response.ok) {
    throw new Error(`Failed to load ${dataFile}: ${response.status}`);
  }

  const data = await response.json();
  return data.cards; // Assuming the cards are stored in 'cards' in the JSON
}

// Display flashcards
function displayCards(cards) {
  // This function should be responsible for initially displaying the cards
  cards.forEach((item, i) => {
    ques.push(item.term);  // Store the questions
    answ.push(item.definition);    // Store the answers
    console.log(ques[i]);
    console.log(answ[i]);
  });

  // Show the first card when the page loads
  loadNextCard();
}

document.addEventListener('DOMContentLoaded', async () => {
  console.log("LocalStorage:", localStorage);

  const storedData = localStorage.getItem("myData");  // Get the selected set from 'mydata'
  console.log(storedData)

  if (storedData) {
    console.log("Found storedData:", storedData);  // Log the storedData for debugging

    const parsedData = JSON.parse(storedData);
    let setTitle = parsedData.Set;  // This gives you the file name, e.g., "test 3"
    console.log("Selected set:", setTitle);


    setTitle = setTitle.replace("_", " ");  // This replaces the underscore with a space

    console.log(setTitle);
    // Retrieve 'allSets' from localStorage
    const allSets = localStorage.getItem("allSets");

    if (allSets) {
      console.log("All sets:", allSets);  // Log allSets for debugging

      const sets = JSON.parse(allSets);  // Parse 'allSets' into an object
      console.log("Parsed allSets:", sets);  // Log the parsed allSets object

      // Check if the selected set (setTitle) exists as a key in allSets
      const selectedSetData = sets[setTitle];  // Use the set title to get the corresponding data

      if (selectedSetData) {
        console.log("Selected set data:", selectedSetData);

        // Now, you can access the cards within the selected set
        displayCards(selectedSetData.cards); // Assuming each set has a 'cards' array
      } else {
        console.log(`Set '${setTitle}' not found in allSets.`);
      }
    } else {
      console.log("No sets found in localStorage.");
    }
  } else {
    console.log("No set selected.");
    // Optionally, show a message on the page indicating no set was selected
  }
});



document.getElementById("backButton").addEventListener("click",()=>{
  localStorage.setItem("myData", "")
  history.back()

});