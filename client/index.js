"use strict";

let screen1;

function startup() {
    screen1 = new ScreenComponent();
    document.querySelector("main").appendChild(screen1);
}

//window.onload = evt => startup();





function homeScreen() {
    if(!screen1) {
        startup();
    }
    screen1.homePage();
}

function adminScreen() {
    if(!screen1) {
        startup();
    }
    screen1.adminPage();
}

function quizScreen(uid, editMode) {
    if(!screen1) {
        startup();
    }
    screen1.quizPage(uid, editMode)
}



const router = new Router();
router.get('/home', req => {
    homeScreen();
});
router.get('/admin', req => {
    adminScreen();
});


router.get(`/quiz/:pageCalled`, req => {
    console.log("view")
    //console.log(req.id);
    quizScreen(req.param1);
});
router.get(`/quiz/:pageCalled/edit`, req => {
    //console.log(req.id);
    console.log("edit")
    console.log(req.param2)
    quizScreen(req.param1, req.param2);
});
router.init();

const firebaseConfig = {
    apiKey: "AIzaSyB0cnilljayJ3axmCdJyBvGV_nLdDQ9csI",
    authDomain: "webprog-coursework-e4b42.firebaseapp.com",
    databaseURL: "https://webprog-coursework-e4b42.firebaseio.com",
    projectId: "webprog-coursework-3f2d9",
    storageBucket: "webprog-coursework-e4b42.appspot.com",
    messagingSenderId: "669091989709",
    appId: "1:669091989709:web:ecefeb8f3d8c5ad0ca8184"
};
firebase.initializeApp(firebaseConfig);

function login() {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    firebase.auth().signInWithPopup(provider)
        .then(result => {
            const token = result.credential.accessToken;
            const user = result.user;
            sendToken();
        }).catch(error => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
}

function sendToken() {
    firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
        const authToken = { "token": idToken }
        sendAuthToken(authToken);
    }).catch(function(error) {
        // Handle error
    });
    
}

async function sendAuthToken(authToken) {
    const response = await fetch("/authenticate", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(authToken)
    });
}

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

