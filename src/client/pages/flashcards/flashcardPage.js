function flipCard(){
    const question = document.querySelector('#flashcardContent_question');
    const answer = document.querySelector('#flashcardContent_ans');
  
    if (question.style.display === 'none') {
      question.style.display = 'block';
      answer.style.display = 'none';
    } else {
      question.style.display = 'none';
      answer.style.display = 'block';
    }
}

function next(){
    //move to the next card in the sequence
}

function back(){
    //move to the previous card in the sequence
}

