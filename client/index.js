"use strict";

let questions;
let response = { "questions": [] };

class Question {

    constructor(question) {
        this._element = document.createElement("div");

        if(question!==null) {
            this._element.id = question.id;

            const title = document.createElement("h3");
            const titleContent = document.createTextNode(question.text);
            title.appendChild(titleContent);
            this._element.appendChild(title);

            this.createInput(question);
        }        
    }

    createInput(question) {
        let input;

        switch(question.type) {
            case "text":
                input = this.createTextInput()
                input.id = question.id;
                break;
            case "number":
                input = this.createNumberInput();
                break;
            case "single-select":
                input = this.createSingleSelectInput(question.options);
                break;
            case "multi-select":
                input = this.createMultiSelectInput(question.options);
                break;
        }
        const q = document.querySelector("#questionContainer");
        if(q.children[0]) {
            q.children[0].remove();
        }
    
        this._element.appendChild(input);
    }

    appendQuestion() {
        console.log("yeet")
        const q = document.querySelector("#questionContainer");
        q.appendChild(this._element);
    }
    createTextInput() {
        const form = document.createElement("form")
        const input = document.createElement("input");
        input.id = "response";
        form.appendChild(input);
        
        return form;
    }
    createNumberInput() {
        const form = document.createElement("form")
        const inputElement = document.createElement("input");
        inputElement.id="response";
        inputElement.setAttribute("type", "number");
    
        form.appendChild(inputElement);
        return form;
    }
    createMultiSelectInput(options) {
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
    createSingleSelectInput(options) {
        const inputElement = document.createElement("div");
        options.forEach(opt => {
            const optionContainer = document.createElement("div");
            const option = document.createElement("input");
            option.setAttribute("type", "radio");
            option.setAttribute("name", "name");
            option.setAttribute("value", opt);
            option.setAttribute("id", opt);
    
            const label = document.createElement("label");
            label.setAttribute("for", opt);
            label.textContent = opt;
            optionContainer.appendChild(option);
            optionContainer.appendChild(label);
            inputElement.appendChild(optionContainer);
        });
        return inputElement;
    }
}

async function getQuestions() {
    const response = await fetch("/getquestions");

    const data = await response.json();

    questions = data;

    const title = document.querySelector("#title");
    title.textContent=questions.name;
    body.appendChild(title);
}

function displayQuestions() {
    //const body = document.querySelector("main");

    const question = new Question(questions.questions[currentQuestion]);

    question.appendQuestion();
    

    //createQuestion(questions.questions[currentQuestion], body);
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

function editQuestionPage() {
    if(document.querySelector("#questionContainer").children[0]) {
        document.querySelector("#questionContainer").children[0].remove;
    }
}



/********************************************************************
 * ADMIN CONSOLE
 * **************************************************************** */



class EditableQuestion {

    constructor() {       

        this._question = {
            "id": "",
            "text": "",
            "type": "text"
        };
        this._element = document.createElement("div");

        this._element.classList.add("question");

        this.createTitle();

        this.createInputSelector();
    }

    createTitle() {
        const titleContainer = document.createElement("div");

        const title = document.createElement("input");
        const saveButton = document.createElement("button");
        saveButton.append("Save");
        saveButton.onclick = (evt => {
            this._question.text = saveButton.parentElement.children[0].value;

            console.log(this._question)
        
        });

        titleContainer.appendChild(title);
        titleContainer.appendChild(saveButton);

        this._element.appendChild(titleContainer);
    }

    createInputSelector() {
        const inputSelector = document.createElement("select");

        const option1 = document.createElement("option");
        option1.value="text";
        option1.append("Text Input");

        const option2 = document.createElement("option");
        option2.value="number";
        option2.append("Number Input");

        const option3 = document.createElement("option");
        option3.value="single-select";
        option3.append("Single-select Input");

        const option4 = document.createElement("option");
        option4.value="multi-select";
        option4.append("Multi-select Input");

        inputSelector.appendChild(option1);
        inputSelector.appendChild(option2);
        inputSelector.appendChild(option3);
        inputSelector.appendChild(option4);

        inputSelector.onchange = (evt => {
            this._question.type = inputSelector.value;

            console.log(this._question);
        })

        this._element.appendChild(inputSelector);
    }
}

class Questionnaire {

    constructor() {
        this.createTitle();
        const newQButton = document.createElement("button");
        newQButton.append("Add Question");
        newQButton.id="newq";
        document.querySelector("body").appendChild(newQButton);
        document.querySelector("#newq").onclick = (evt => {
            this.createNewQuestion();
        });

        this._questions = {
            "name": "",
            "questions": []
        };

        const saveButton = document.createElement("button");
        saveButton.onclick = (evt => {

            this._elements.forEach(x => {
                this._questions.questions.push(x._question);
            });
            console.log(this._questions);

            sendQuestionnaire(this._questions).then(data => {
                this._uid = data.id;
                console.log(this._uid);
            });
            
        });
        saveButton.append("Save");
        document.querySelector("body").appendChild(saveButton);

        
        this._elements = new Array;
    }

    createTitle() {
        const titleContainer = document.createElement("div");
        const title = document.createElement("input");
        const saveButton = document.createElement("button");
        saveButton.append("Save");

        saveButton.onclick = (evt => this._questions.name = title.value);

        titleContainer.appendChild(title);
        titleContainer.appendChild(saveButton);

        document.querySelector("#questionContainer").appendChild(titleContainer);
    }

    createNewQuestion() {
        const q = new EditableQuestion();
        this._elements.push(q);
        document.querySelector("#questionContainer").appendChild(q._element);
    }
}

async function sendQuestionnaire(questionnaire) {
    const response = await fetch("/createquestionnaire", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(questionnaire)
    });
    return await response.json();
}

function createQuestionnnaire() {

    const q = document.querySelector("#questionContainer");
        if(q.children[0]) {
            q.children[0].remove();
        }

    const quest = new Questionnaire();
    quest.createNewQuestion();

    
}

function createNewQuestion() {

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