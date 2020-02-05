let questions;

async function getQuestions() {
    const response = await fetch("/getquestions");

    const yiss = await response.json();

    questions = yiss;

    const title = document.querySelector("#title");
    title.textContent=questions.name;
    body.appendChild(title);
}

function displayQuestions() {
    const body = document.querySelector("main");
    

    createQuestion(questions.questions[currentQuestion], body);
}

function createQuestion(question, bodyElement) {
    
    const q = document.querySelector("#questionContainer");
    const newQ = document.createElement("div");

    const qTitle = document.createElement("h3");
    const qTitleContent = document.createTextNode(question.text);
    qTitle.appendChild(qTitleContent);

    

    newQ.appendChild(qTitle);

    let input;

    switch(question.type) {
        case "text":
            input = createTextInput()
            break;
        case "number":
            input = createNumberInput();
            break;
        case "single-select":
            input = createSingleSelectInput(question.options);
            break;
        case "multi-select":
            input = createMultiSelectInput(question.options);
            break;
    }

    if(q.children[0]) {
        q.children[0].remove();
    }

    newQ.appendChild(input);

    q.appendChild(newQ);
}

function createTextInput() {
    return document.createElement("input");
}
function createNumberInput() {
    const inputElement = document.createElement("input");
    inputElement.setAttribute("type", "number");
    return inputElement;
}
function createMultiSelectInput(options) {
    const inputElement = document.createElement("div");
    options.forEach(opt => {
        const optionContainer = document.createElement("div");
        const option = document.createElement("input");
        option.setAttribute("type", "checkbox");
        option.setAttribute("name", "name");
        option.setAttribute("id", opt);

        const label = document.createElement("label");
        label.setAttribute("for", opt)
        label.textContent = opt
        optionContainer.appendChild(option);
        optionContainer.appendChild(label);
        inputElement.appendChild(optionContainer);
    });
    return inputElement;
}
function createSingleSelectInput(options) {
    const inputElement = document.createElement("div");
    options.forEach(opt => {
        const optionContainer = document.createElement("div");
        const option = document.createElement("input");
        option.setAttribute("type", "radio");
        option.setAttribute("name", "name");
        option.setAttribute("value", opt);
        option.setAttribute("id", opt);

        const label = document.createElement("label");
        label.setAttribute("for", opt)
        label.textContent = opt
        optionContainer.appendChild(option);
        optionContainer.appendChild(label);
        inputElement.appendChild(optionContainer);
    });
    return inputElement;
}

getQuestions();
let currentQuestion = -1;
const nextButton = document.querySelector("#next");
nextButton.addEventListener("click", event => {
    currentQuestion++;
    displayQuestions();
});
const prevButton = document.querySelector("#prev");
prevButton.addEventListener("click", event => {
    currentQuestion++;
    displayQuestions();
});
