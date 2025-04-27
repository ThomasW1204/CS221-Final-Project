// This segment is for testing, for now I will assign the index value of the data set I'm testing 
// As a hardcoded value. Later it will pull stuff from a MongoDB. Currently, I prefer that we output these
// FlashCard sets to a file to store. Someone can create the file and then send it off to someone else
// For them to read the Flashcard set and then start studying. This is suboptimal in terms of user
// Retention or usability but its the best back up plan if I can figure out server.

// Import Flashcard set
import flashcardSets from "../../shared/flashcardSetDummyData.js";
import { switchActiveScreen } from "../../shared/display.js";
import QuestionState from "./QuestionState.js";


/*
    Quiz Flow Overview: This is how the quiz page will flow.
    This step flow was printed by copilot after I pull my own flow into it
    and it outputted as a concise step system for me to Copy
    This is how the page flows and Rules to follow:
    
    1. Preload Questions on Page Load
        - Shuffle flashcards and preload 10 questions in the background.
        - Do NOT build more unless the user starts the quiz. (This helps save unnecessary computation and memory)

    2. Start Quiz on User Interaction
        - When the quiz begins, duplicate and shuffle the flashcards.
        - Push cards in batches (e.g., 10 at a time) onto a stack for processing. (Doesn't overload memory)

    3. Build Questions Dynamically
        - Pop a card from the stack to build a new question. (Make sure to stay 5-10 question ahead of user)
        - Add it to the question queue for display.

    4. Prevent Duplicate Questions
        - Before adding a question, check if it has already been used. (Checks against array of initial terms)
        - If a duplicate is found, pop the next card without creating a question.

    5. Adaptive Loading for Fast Users
        - If the user moves quickly, ensure enough questions are preloaded. (5-10 ahead)
        - Always keep the queue ahead of the user's pace.

    6. Repeat Until Stack is Empty or User Quits
        - Continue popping and building questions until the stack runs out.
        - If the user exits early, stop loading more questions to save memory.
*/

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

// Get the set for tests
const testSet = flashcardSets[0];

// Set Title
document.title=`Quiz - ${testSet.setName}`;



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
let maxNumberOfQuestions = 10; // This is the maximum number of questions that can be generated for a generated quiz. Default is 10
// Functions

function selectQuizType() {
    const quizTypeOptions = document.getElementById("quiz-type-options");
    quizTypeOptions.classList.add('active');
    
    const startQuizButton = document.getElementById("start-quiz");
    startQuizButton.addEventListener('click', startQuiz);
}

/**
 * This Function Starts the Quiz by switching to the quiz scree, generating a question
 * and the adding eventListeners to the answer buttons to be selected
 */
function startQuiz(){
    const screenSwitchCode = switchActiveScreen('quiz-screen');
    if (screenSwitchCode) {
        console.error(`Screen Switch Failed with Code: ${screenSwitchCode}`);
        return;
    }
    generateQuestions();
    nextQuestion();
    console.log(buttonObjectArray)

    nextQuestionButton.addEventListener('click', nextQuestion);
    prevQuest.addEventListener('click', previousQuestion);
}


/**
 * This Function Generates 10 Questions
 * It first finds a random card and gets the correct answer. From there it sets the question
 * bar to have the term. The answer buttons are then replaced by random definitions. Then a random
 * button is selected as the correct answer.
 */
function generateQuestions(){
    for (let i = 0; i < 10; i++){
        questionNumber = previousQuestions.length;

        const questionIndex = Math.floor(Math.random() * testSet.cards.length);
        const question = testSet.cards[questionIndex].term;
        const answer = testSet.cards[questionIndex].definition;
        let answerChoices = () => {
            const cardDefintions = [];
            for (let i = 0; i < 4; i++){
                cardDefintions.push(testSet.cards[Math.floor(Math.random() * testSet.cards.length)].definition);
            }
            return cardDefintions;
        }
        answerChoices = answerChoices();
        const correctIndex = answerChoices.indexOf(answer) >= 0 ? answerChoices.indexOf(answer): (() => {
            const correctIndex = Math.floor(Math.random() *4)
            answerChoices[correctIndex] = answer;
            return correctIndex;
        })();
        console.log("Correct Index: " + correctIndex);

        previousQuestions.push(new QuestionState(question,answerChoices,correctIndex));
        console.log(previousQuestions[questionNumber]);
        questionNumber++;
    }

}

/**
 * Loads the next question
 */
function nextQuestion() {
    console.log("Next Question Clicked");
    console.log("Current Question: " + currentQuestion);
    console.log("Question Number Count: " + questionNumber);
    if (currentQuestion >= questionNumber) {
        loadQuestion(++currentQuestion);
        // If running low on questions, generate more
        if (currentQuestion >= questionNumber -5) {
            console.log("Generating Questions")
            generateQuestions();
        }
    }

   loadQuestion(++currentQuestion);
}

function previousQuestion() {
    if (!(currentQuestion <= 0)) 
        loadQuestion(--currentQuestion);
}

function loadQuestion(index) {
    console.log("Loading Question: " + index);
    
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
    }
}

/**
 * Action listener callback function
 * This it the listener that is added to the buttons that hold the wrong answer
 * It reveals the answers as wrong or correct and does not add a point to the correct.
 * It also removes all event listeners so the buttons cannot be clicked again
 * @param {*} event : the button that is clicked
 */
function wrongAnswer(event) {
    console.log("Wrong Answer Clicked")
    revealAnswers(event);
    event.target.classList.add('clicked');
}

/**
 * Calls revealAnswers to show the correct answer and remove event listeners from the buttons
 * Adds to the Score of correct.
 * @param {*} event : The button that was clicked
 */
function correctAnswer(event) {

    console.log("Correct Answer Clicked");
    // Call revealAnswers to show the correct answer and remove event listeners from the buttons
    revealAnswers(event);
    event.target.classList.add('clicked');
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
        if (button.element.classList.contains('clicked')) {
            clcikedIndex = index;
        }
    })
    // Reveal the next question button and add the event listener to it
    nextQuestionButton.style.display = 'block';
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

    if (currentQuestion <= 0) {
        prevQuest.style.display = 'none';
    } else {
        prevQuest.style.display = 'block';
    }

    // Clear the event listeners from the buttons and reset the class names
    buttonObjectArray.forEach((button) => {
        console.log("\n\n");
        button.element.className = DEFAULT_ANSWER_BUTTON_CLASS;
        button.element.removeEventListener('click', button.clickHandler);
        button.clickHandler = null;
    })

}



// Setup Start Listener
startButton.addEventListener("click", selectQuizType);

// Set Top Bar to be the name of the set
const topBar = document.getElementById("Top-Bar").textContent = `Quiz - ${testSet.setName}`;

