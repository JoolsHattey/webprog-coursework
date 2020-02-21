const firebase = require('firebase');
const firebaseConfig = require('./firebase.json');
const firebaseapp = firebase.initializeApp(firebaseConfig);
const Observable = require('rxjs/Observable').Observable;


function addResponse(response) {
    firebase.firestore().collection("responses").add(response);
}

async function getResponses() {
    return await firebase.firestore().collection("responses").get();;
}

function createQuestionnaire(questionnaire) {
    return Observable.create(observer => {
        firebase.firestore().collection("questionnaires").add(questionnaire)
            .then(docRef => {
                observer.next({id: docRef.id});
            });
    });
}

module.exports = {
    addResponse,
    getResponses,
    createQuestionnaire
}