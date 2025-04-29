
/**
 * This is a class of Question States, used to maintain a list of question built so the user can go back
 * and view questions after answer.
 * This class is READ ONLY, once the data is set, it cannot changed with exception of 
 * answered which is updated to true with the answer() function when answered
 * @class
 * @readonly
 * 
 * @private 
 * @property {String} question - This is either the term or the definition that the user is supposed to answer
 * @property {String[]} answerChoices - Array of Answer Choices in order of buttons
 * @property {Number} correctIndex - Index in the array of answer choices that signifies the correct answer
 * @property {Boolean} answered - Question has or has not been answered
 * 
 * @method answer: This function updates the answered button
 */
class QuestionState {
    #question
    #answerChoices
    #correctIndex
    #answered
    #clickedIndex

    constructor(question,answerChoices,correctIndex){
        this.#question = question;
        this.#answerChoices = answerChoices;
        this.#correctIndex = correctIndex;
        this.#answered = false;
    }

    answer(clicked){
        this.#answered = true;
        this.#clickedIndex = clicked;
        Object.freeze(this);
    }

    // Getters
    get question() {
        return this.#question;
    }

    get answerChoices() {
        return this.#answerChoices;
    }

    get correctIndex() {
        return this.#correctIndex;
    }

    get answered() {
        return this.#answered;
    }

    get clickedIndex() {
        return this.#clickedIndex;
    }
}


export default QuestionState;