"use strict";

import { Router } from './router.js';
import { RouterOutlet } from './components/screen/index.js';
import { getAuthStatus } from './auth.js';

// let screen1;
// screen1 = new ScreenComponent();
// console.log(screen1)

// function startup() {
//     document.querySelector("body").appendChild(screen1);
// }

// window.onload = evt => startup();

const screen1 = document.querySelector('screen-elmnt');




/********************************************
 * Client Routes
 * **************************************** */

export const routerInstance = new Router();

function homeScreen(req) {
    screen1.homePage();
}

function adminScreen(req) {
    screen1.adminPage();
}

function quizScreen(req) {
    screen1.quizPage(req.param1, req.param2);
}

routerInstance.get('/home', homeScreen);
routerInstance.get('/admin', adminScreen, getAuthStatus);
routerInstance.get(`/quiz/:pageCalled`, quizScreen);
routerInstance.get(`/quiz/:pageCalled/edit`, quizScreen, getAuthStatus);

routerInstance.init();



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

async function submitResponse(uid, response) {
    const request = await fetch(`/submitresponse/${uid}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(response)
    });
}

