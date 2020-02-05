async function getQuestions() {
    const response = await fetch("/getquestions");

    const yiss = await response.json();

    displayQuestions(yiss);
}

function displayQuestions(questions) {
    const body = document.querySelector("main");

    createQuestion(questions.questions[currentQuestion], body);

    //questions.questions.forEach(element => createQuestion(element, body));
}

function createQuestion(question, bodyElement) {
    const newQ = document.querySelector("#questionContainer")

    const qTitle = document.createElement("h2");
    const qTitleContent = document.createTextNode(question.text);
    qTitle.appendChild(qTitleContent);

    //const q

    if(newQ.children[0]) {
        newQ.children[0].remove();}

    newQ.appendChild(qTitle);

    bodyElement.appendChild(newQ);
}
let currentQuestion = -1;
const nextButton = document.querySelector("#next");
nextButton.addEventListener("click", event => {
    currentQuestion++;
    getQuestions();
});
const prevButton = document.querySelector("#prev");
prevButton.addEventListener("click", event => {
    currentQuestion++;
    getQuestions();
});
//getQuestions();