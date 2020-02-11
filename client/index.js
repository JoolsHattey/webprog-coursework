"use strict";

let questions;
let response = { "questions": [] };

async function getQuestions() {
    const response = await fetch("/getquestions");

    const data = await response.json();

    questions = data;

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
    newQ.id = question.id;

    const qTitle = document.createElement("h3");
    const qTitleContent = document.createTextNode(question.text);
    qTitle.appendChild(qTitleContent);

    

    newQ.appendChild(qTitle);

    let input;

    switch(question.type) {
        case "text":
            input = createTextInput()
            input.id = question.id;
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
    const form = document.createElement("form")
    const input = document.createElement("input");
    input.id = "response";
    form.appendChild(input);
    
    return form;
}
function createNumberInput() {
    const form = document.createElement("form")
    const inputElement = document.createElement("input");
    inputElement.id="response";
    inputElement.setAttribute("type", "number");

    form.appendChild(inputElement);
    return form;
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

function submitQuestion() {
    const questionInput = document.querySelector("#questionContainer").children[0].children[1];

    response.questions[currentQuestion] = {
        "id": "",
        "answer": questionInput.elements[0].value
    }
}

function sendResponse() {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/submitresponse", true);

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(JSON.stringify(response));
}

getQuestions();
let currentQuestion = -1;
const nextButton = document.querySelector("#next");
nextButton.addEventListener("click", event => {
    if(currentQuestion>=0) {
        submitQuestion();
    }
    if(currentQuestion>=3) {
        sendResponse();
    } else {
        currentQuestion++;
        displayQuestions();
    }
    
});
const prevButton = document.querySelector("#prev");
prevButton.addEventListener("click", event => {
    currentQuestion++;
    displayQuestions();
});