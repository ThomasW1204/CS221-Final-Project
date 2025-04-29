// This segment is for testing, for now I will assign the index value of the data set I'm testing 
// As a hardcoded value. Later it will pull stuff from a MongoDB. Currently, I prefer that we output these
// FlashCard sets to a file to store. Someone can create the file and then send it off to someone else
// For them to read the Flashcard set and then start studying. This is suboptimal in terms of user
// Retention or usability but its the best back up plan if I can figure out server.

// Import Flashcard set
// import flashcardSets from "../../shared/flashcardSetDummyData.js";
import { activateOverlay, deactivateOverlay, switchActiveScreen } from "../../shared/display.js";
import QuestionState from "./QuestionState.js";

// Get references to the necessary elements that will be updated
// Operation Buttons: These buttons change screens or progress through the questions

const startButton =  document.getElementById("start-button");
const nextQuestionButton = document.getElementById("next-question");
const prevQuest = document.getElementById("previous-question");

//Question and Answer

// Gets the <p> element in question bar to be able to edit the question text
const question_p = document.getElementById("question").querySelector('p');

// We Will get our array of button references and then create an object
// to easily correlate the current function with its action (correct answer and wrong answer)
const answerButtons = Array.from(document.getElementsByClassName("answer")); // HTML Collection convert to Array of HTML Elements

// Now define Object Array
/**
 * @typedef ButtonObject
 * @property {String}: id of button, can be call using .find('choice')
 * @property {HTMLElement}: reference to the button in the DOM
 * @property {Function|Null}: function used as the handler for the click Event Listener
 * 
 * This creates an easy to access array of buttons that can be accessed normally by looping through
 * the array or searching for a specific button (if needed but unlikely) with .find(id);
 * @example
 * // With Find (not recommended, can get confusing. This array is mainly for looping through all buttons and
 * // assigning textContent based on question state)
 * const firstButton = buttonObjectArray.find(button => button.id==='choice1');
 * // With array index
 * const firstButton = buttonObjectArray[index]; // allows for indexing and can be used with .forEach()
 */
const buttonObjectArray = [
    {id: 'choice1',element: answerButtons[0],clickHandler:null},
    {id: 'choice2',element: answerButtons[1],clickHandler:null},
    {id: 'choice3',element: answerButtons[2],clickHandler:null},
    {id: 'choice4',element: answerButtons[3],clickHandler:null}
];

// Question Constants: these are used to define constant values involved with the answer buttons
/**
 * @example
 * // Use to redefine answerButtons class on new question
 * buttonObjectArray[0].className = DEFAULT_ANSWER_BUTTON_CLASS;
 */
const DEFAULT_ANSWER_BUTTON_CLASS = 'answer'; 

let currentSetName= localStorage.getItem("myData");
let allSets=JSON.parse(localStorage.getItem("allSets")) ||{};
//currentSetName = currentSetName.replace(/_/g, " ");  

if(!currentSetName || !allSets[currentSetName]){
    setTitleElement.textContent= "No Set Found";
}

const flashcardSet=allSets[currentSetName];

// Get the set for tests
const setKeyTitle = currentSetName; // This is the name of the set that will be used to display the title of the quiz
const setKey = flashcardSet.cards; // This is the set of cards that will be used for the quiz
const cardStack = []; // Stack for the cards to be used in the quiz

// Set Title
document.title=`Quiz - ${setKeyTitle}`;



/**  This is an array of previous questions 
*  Whenever next question is selected, it pushes the state onto the array
*  Whenever the previous question button is hit, the pointer (not an actual data type pointer)
*  It will go back and view the previous question. Hitting next question after moving back
*  will move forward by one.
* @see QuestionState
*/
const previousQuestions = [];

// Number of Questions
let questionNumber = 0;
let currentQuestion = -1;

let correctAnswerCount = 0;
let maxNumberOfQuestions = 5; // This is the maximum number of questions that can be generated for a generated quiz. Default is 10

let generateQuestion = true; // This is a flag to determine if we are generating questions or not


const scores = []; // This is the result scores that stores the previous scores of the quiz (used for comparison to user prevous scores)
const wrongQuestions = []; // This is the array of wrong questions that will be used to review the questions after the quiz is over

const images = [
    '../src/client/pages/quiz/images/preview01.png',
    '../src/client/pages/quiz/images/preview02.png',
    '../src/client/pages/quiz/images/preview03.png',
]

const imageContainer = document.getElementById('preview-image');
imageContainer.style.backgroundImage = `url(${images[0]})`;
let currentImageIndex = 0;
const imageInterval = setInterval((() => {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    imageContainer.style.backgroundImage = `url(${images[currentImageIndex]})`;
}), 3000); // Change image every 3 seconds
// Functions


/**
 * This function is called when the start button is clicked
 * Currently, it will immediately start the quiz
 * Later it will allow the user to select the quiz generation method
 * Either: randomly/on-the-fly generation, or a pre-defined set of questions
 */
function selectQuizType() {
    
    
    // Temp comment out, for now immediately start quiz
    // activateOverlay('quiz-type-options');
    
    // const startQuizButton = document.getElementById("start-quiz");
    // startQuizButton.addEventListener('click', startQuiz);

    switchActiveScreen('quiz-setup');
    document.getElementById('start-quiz').addEventListener('click', startQuiz);
}


/**
 * This function starts the quiz
 * It begins by reseting the quiz variables and switching to the quiz screen
 * @see switchActiveScreen
 * It then generates an initial set of questions and moves on to the first question
 * @see generateQuestions
 * @see nextQuestion
 * Finally, it adds the event listeners to the question navigation buttons (prev and next question)
 * called by selectQuizType
 * @see selectQuizType
 * @returns {null} :Returns nothing but will exit (return) early if the screen switch fails, logging an error message to the console.
 */
function startQuiz() {
    if (document.getElementById('generated-quiz').checked) maxNumberOfQuestions = document.getElementById('question-count').value;
    else maxNumberOfQuestions = 10; // Default to 10 questions if not selected

    // Reset Quiz Variables
    cardStack.length = 0; // Clear the card stack
    cardStack.push(...setKey); // Copy the test set to the stack for randomization
    questionNumber = 0;
    currentQuestion = -1;
    correctAnswerCount = 0;
    generateQuestion = true; // This is a flag to determine if we are generating questions or not
    previousQuestions.length = 0; // Clear the previous questions array
    wrongQuestions.length = 0; // Clear the wrong questions array

    const screenSwitchCode = switchActiveScreen('quiz-screen');
    if (screenSwitchCode) {
        console.error(`Screen Switch Failed with Code: ${screenSwitchCode}`);
        switchActiveScreen('error-screen');
        return;
    }

    generateQuestions();
    nextQuestion();

}


/**
 * This function generates up to 10 questions from the cardStack array
 * It randomly selects a card from the stack and creates a QuestionState object
 * The card is then removed from the stack and the QuestionState is pushed to the array: previousQuestions
 * @see QuestionState
 * If either the cardStack empties or the max number of questions is reached, it will stop generating questions
 * @returns {null} : Returns nothing but will exit (return)
 */
function generateQuestions(){

    // Generate up to 10 questions
    for (let i = 0; i < 10; i++){
        
        // If we are out of questions, break out of the loop
        if( questionNumber >= maxNumberOfQuestions || !cardStack[0]) {
            generateQuestion = false;
            break;
        }

        // Randomly select a card from the cardStack
        const cardIndex = Math.floor(Math.random() * cardStack.length);
        
        // Swap to top of the stack
        const temp = cardStack[0];
        cardStack[0] = cardStack[cardIndex];
        cardStack[cardIndex] = temp;

        // Grab top card information and remove it from the array
        const question = cardStack[0].term;
        const answer = cardStack[0].definition;
        cardStack.shift(); // Remove the card from the array

        /* 
            This generates 4 random answer choices from the workingSet array.
            Does not check for duplicates nor assign the correct answer to the choices (this is done later).
        */
        let answerChoices = () => {
            const cardDefintions = [];
            for (let i = 0; i < 4; i++){
                cardDefintions.push(setKey[Math.floor(Math.random() * setKey.length)].definition);
            }
            return cardDefintions;
        }
        answerChoices = answerChoices();

        // Sets the correct answer to a random index in the answerChoices array
        // If the answer is already in the array, it will set the correct index to that index
        const correctIndex = answerChoices.indexOf(answer) >= 0 ? answerChoices.indexOf(answer): (() => {
            const correctIndex = Math.floor(Math.random() *4)
            answerChoices[correctIndex] = answer;
            return correctIndex;
        })();
        //console.log("Correct Index: " + correctIndex);

        previousQuestions.push(new QuestionState(question,answerChoices,correctIndex));
        //console.log(previousQuestions[questionNumber]);
        questionNumber++;
    }

    //console.log("Question States: " + previousQuestions);
}

/**
 * This function moves on to the next question
 * It will first check if we are at the end of the quiz. If so, it will render the results screen
 * @see renderResultsScreen
 * It will then check if we are low on questions and generate more if needed
 * @see generateQuestions
 * Finally, it will load the next question and set the text of the next question button depending on if we are at the end of the quiz or not
 * @see loadQuestion
 * 
 * @returns {null} : Returns if we are at the end of the quiz and renders the results screen
 */
function nextQuestion() {
    //console.log("Next Question Clicked");
    //console.log("Current Question: " + currentQuestion);
    //console.log("Question Number Count: " + questionNumber);

    if (!generateQuestion && currentQuestion+1 >= questionNumber) {
        renderResultsScreen();
        return;
    }

    // If we are low on questions, generate more questions
    if (generateQuestions && currentQuestion +1 < questionNumber -5 ) {
        generateQuestions();
    }

    loadQuestion(++currentQuestion);
    if (currentQuestion >= questionNumber - 1) {
        nextQuestionButton.textContent = "Finish Quiz";
    } else {
        nextQuestionButton.textContent = "Next Question";
    }
}

/**
 * This function moves back to the previous question
 * If we are not at the beginning of the quiz, it will load the previous question
 * @see loadQuestion
 * loadQuestion will also verify if we are at the start of the quiz and disable the previous question button
 */
function previousQuestion() {
    if (!(currentQuestion <= 0)) 
        loadQuestion(--currentQuestion);
}

/**
 * This function loads and sets the elements of the question screen to the information of the current question
 * It will start by resetting the question screen
 * @see resetQuestionScreen
 * It will then get the current questionState object from the previousQuestions array at index
 * It will the updates the question text and answer choices to the QuestionState information
 * @see QuestionState
 * 
 * For nextQuestion call:
 *  It will set the event listeners for the buttons to be the correct or wrong answer
 * @see nextQuestion
 * For previousQuestion call:
 * @param {number} index : The index of the question to load 
 */
function loadQuestion(index) {
    //console.log("Loading Question: " + index);
    
    resetQuestionScreen();

    const currentQuestionObject = previousQuestions[index];
    console.log(currentQuestionObject);

    question_p.textContent = currentQuestionObject.question;

    

    buttonObjectArray.forEach((button, index) => {
        // Set textContent of button to be the answer choice
        button.element.textContent=currentQuestionObject.answerChoices[index];
        // set the event listener to be the correct answer or wrong answer
        if (index === currentQuestionObject.correctIndex) {
            button.clickHandler = correctAnswer;
            
        } else {
            button.clickHandler = wrongAnswer;
        }
        button.element.addEventListener('click', button.clickHandler);
    })

    if (currentQuestionObject.answered) {
        // If the question has already been answered, reveal the answers
        revealAnswers();
        buttonObjectArray[currentQuestionObject.clickedIndex].element.classList.add('clicked');
        buttonObjectArray.forEach((button) => {
            button.element.removeEventListener('click', button.clickHandler);
        })
    }

    document.getElementById("question-number").textContent = `Question ${index + 1} of ${questionNumber}`;
}

/**
 * Action listener callback function
 * This it the listener that is added to the buttons that hold the wrong answer
 * It reveals the answers as wrong or correct and does not add a point to the correct.
 * It also removes all event listeners so the buttons cannot be clicked again
 * @param {*} event : the button that is clicked
 */
function wrongAnswer(event) {
    //console.log("Wrong Answer Clicked")
    event.target.classList.add('clicked');
    revealAnswers(event);
    
    wrongQuestions.push(previousQuestions[currentQuestion]);
}

/**
 * Calls revealAnswers to show the correct answer and remove event listeners from the buttons
 * Adds to the Score of correct.
 * @param {*} event : The button that was clicked
 */
function correctAnswer(event) {

    //console.log("Correct Answer Clicked");
    // Call revealAnswers to show the correct answer and remove event listeners from the buttons
    event.target.classList.add('clicked');
    revealAnswers(event);
    

    // Add to the score of correct
    correctAnswerCount++;
}

/**
 * Reveals the correct and wrong answers to the question
 * Also removes the event listeners from the buttons so that they cannot be clicked again
 * By checking the clickHandler property of the button object, we can determine if it is correct or wrong
 * @param {*} event 
 */
function revealAnswers(event) {
    console.log("Revealing Answers");

    
    let clickedIndex = 0;
    buttonObjectArray.forEach((button, index) => {
        if (button.clickHandler === correctAnswer) {
            button.element.classList.add('correct');
        } else {
            button.element.classList.add('wrong');
        }
        button.element.removeEventListener('click', button.clickHandler);
        if (button.element.classList.contains('clicked') ) {
            clickedIndex = index;
        }
    })
    // Reveal the next question button and add the event listener to it
    nextQuestionButton.style.display = 'block';
    if (previousQuestions[currentQuestion].answered) return;
    previousQuestions[currentQuestion].answer(clickedIndex);
    
}

/**
 * This resets the question screen whenever you go to the next question
 * It resets styling and eventListeners.
 * The best way to remove anonymous functions (which is required to our eventListeners)
 * Is to duplicate or cloneNode. This copies the element and its children nodes but not any event listeners
 * After that we replace the original with the new duplicate so that 
 */
function resetQuestionScreen(){
    console.log("Resetting Question Screen")
    nextQuestionButton.style.display = 'none';

    nextQuestionButton.textContent = "Next Question";

    if (currentQuestion <= 0) {
        prevQuest.style.display = 'none';
    } else {
        prevQuest.style.display = 'block';
    }

    // Clear the event listeners from the buttons and reset the class names
    buttonObjectArray.forEach((button) => {
        //console.log("\n\n");
        button.element.className = DEFAULT_ANSWER_BUTTON_CLASS;
        button.element.removeEventListener('click', button.clickHandler);
        button.clickHandler = null;
    })

}

/**
 * This function render the results screen, switching to the results screen and adding event listeners to its buttons
 * It starts by switching to the results screen
 * @see switchActiveScreen 
 * 
 * It then sets the score as format "You got X out of Y questions correct!"
 * It then adds event listeners to the buttons on the results screen
 * 
 * Event Listeners:
 * - Restart Quiz: Calls selectQuizType to restart the quiz
 * - Exit Quiz: Switches to the start screen
 * - Review Questions: Switches to the !quiz! screen to review the questions
 *          *NOTE* this is not its own screen, it makes use of the quiz screen with and extra button to return to results screen
 */
function renderResultsScreen() {
    // This function will render the results screen with the score and other information
    //console.log("Rendering Results Screen");
    // Switch to results screen
    try {
        switchActiveScreen('results');
    } catch (error) {
        if (error instanceof ScreenError) {
            console.error(`Screen Switch Failed with Code: ${error.code}`);
            switchActiveScreen('error-screen');
        } else {
            console.error(`Unexpected Error: ${error.message}`);
            switchActiveScreen('error-screen');
        }
        return;
    }
    // Set the score and other information on the results screen
    const scoreElement = document.getElementById("score");
    scoreElement.textContent = `You got ${correctAnswerCount} out of ${questionNumber} questions correct!`;

    const  wrongQuestionList = document.getElementById("wrong-questions-list");
    wrongQuestionList.innerHTML = ""; // Clear the list before adding new items
    wrongQuestions.forEach((question) => {
        const listItem = document.createElement("li");
        
        const wrongQuestionCard = document.createElement("div");
        wrongQuestionCard.className = "wrong-question-card";
        wrongQuestionCard.innerHTML = `<p class="question-wrong">${question.question}</p><p class="selected-answer">Your Answer: ${question.answerChoices[question.clickedIndex]}</p><p class="correct-answer">Correct Answer: ${question.answerChoices[question.correctIndex]}</p>`;
        listItem.appendChild(wrongQuestionCard);
        wrongQuestionList.appendChild(listItem);
    });
}

/**
 * This function adds event listeners to all buttons in the DOM that are not removed or replaced
 * It will add event listeners to the buttons on the results screen and then the question navigation buttons
 */
function addGlobalEventListeners() {
    // Add Event Listeners to the buttons on the results screen
    const restartButton = document.getElementById("retry-quiz");
    const exitButton = document.getElementById("finish-quiz");
    const reviewButton = document.getElementById("review-questions");

    restartButton.addEventListener('click', selectQuizType);
    exitButton.addEventListener('click', () => {
        switchActiveScreen('start-screen');
    });
    reviewButton.addEventListener('click', () => {
        switchActiveScreen('quiz-screen');
    });

    nextQuestionButton.addEventListener('click', nextQuestion);
    prevQuest.addEventListener('click', previousQuestion);

}
// Setup Start Listener
startButton.addEventListener("click", selectQuizType);

// Set Top Bar to be the name of the set
Array.from(document.getElementsByClassName("title")).forEach((title) => {
    title.textContent = `Quiz - ${setKeyTitle}`;
  });
addGlobalEventListeners();
