"use strict";

let screen1;

function startup() {
    screen1 = new ScreenComponent();
    document.querySelector("body").appendChild(screen1);
}

//window.onload = evt => startup();


function clearScreen() {
    if(document.querySelector("screen-elmnt")) {
        if(document.querySelector("screen-elmnt").shadowRoot.querySelector("quiz-screen")) {
            document.querySelector("screen-elmnt").shadowRoot.querySelector("quiz-screen").remove()
        }
        if(document.querySelector("screen-elmnt").shadowRoot.querySelector("home-screen")) {
            document.querySelector("screen-elmnt").shadowRoot.querySelector("home-screen").remove()
        }
        if(document.querySelector("screen-elmnt").shadowRoot.querySelector("admin-screen")) {
            document.querySelector("screen-elmnt").shadowRoot.querySelector("admin-screen").remove()
        }
    }
}


function homeScreen(req) {
    clearScreen();
    if(!screen1) {
        startup();
    }
    screen1.homePage();
}

function adminScreen(req) {
    clearScreen();
    if(!screen1) {
        startup();
    }
    screen1.adminPage();
}

function quizScreen(req) {
    clearScreen();
    if(!screen1) {
        startup();
    }
    console.log(req)
    screen1.quizPage(req.param1, req.param2)
}

// function defaultRoute(req) {
//     router.navigate('/home');
// }



const router = new Router();
router.get('/home', homeScreen);
router.get('/admin', adminScreen, getAuthStatus);
router.get(`/quiz/:pageCalled`, quizScreen);
router.get(`/quiz/:pageCalled/edit`, quizScreen, getAuthStatus);
// router.get('/', defaultRoute);

router.init();



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

async function getQuestionnaire(uid) {
    const request = await fetch(`/questionnaire/${uid}`);

    const quesitonnaire = await(request.json());

    const q = new Questionnaire(quesitonnaire, uid);
}



/********************************************************************
 * ADMIN CONSOLE
 * **************************************************************** */


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

async function updateQuestionnaire(uid, questionnaire) {
    console.log(uid);
    const response = await fetch(`/editquestionnaire/${uid}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(questionnaire)
    });
}

function createQuestionnnaire() {

    const q = document.querySelector("#questionContainer");
        if(q.children[0]) {
            q.children[0].remove();
        }

    const quest = new EditableQuestionnaire();
    quest.createNewQuestion();

    
}

async function editQuestionnaire(uid) {

    console.log(uid);

    const request = await fetch(`/questionnaire/${uid}`);

    const quesitonnaire = await(request.json());

    console.log(quesitonnaire)

    const q = new EditableQuestionnaire(quesitonnaire, uid);
}

function createNewQuestion() {

}

async function uploadJSONQuestionnaire(event) {
    const reader = new FileReader();
    reader.onload = upload;
    reader.readAsText(event.target.files[0]);  
}

async function upload(event) {        
    const questionnaire = JSON.parse(event.target.result);

    sendQuestionnaire(questionnaire)
        .then(x => {
            editQuestionnaire(x.id);
        });
}

async function getQuestionnaires() {
    const response = await fetch("/questionnaires")

    response.json().then(item => {
        const questionnairePreview = new QuestionnairePreview(item);
    });
}

async function getEditableQuestionnaires() {
    const response = await fetch("/questionnaires")

    response.json().then(item => {
        const questionnairePreview = new EditableQuestionnairePreview(item);
    });
}

async function submitResponse(uid, response) {
    const request = await fetch(`/submitresponse/${uid}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(response)
    });
}

