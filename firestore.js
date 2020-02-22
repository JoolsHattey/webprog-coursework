"use strict";

const firebase = require('firebase');
const firebaseConfig = require('./firebase.json');
const firebaseapp = firebase.initializeApp(firebaseConfig);
const Observable = require('rxjs/Observable').Observable;


function addResponse(uid, response) {
    firebase.firestore().collection("questionnaires").doc(uid)
        .collection("responses").add(response);
}

async function getResponses() {
    return await firebase.firestore().collection("responses").get();
}

function createQuestionnaire(questionnaire) {
    return Observable.create(observer => {
        firebase.firestore().collection("questionnaires").add(questionnaire)
            .then(docRef => {
                observer.next({id: docRef.id});
            });
    });
}

function getQuestionnaire(uid) {
    return Observable.create(observer => {
        firebase.firestore().collection("questionnaires").doc(uid).get()
            .then(docRef => observer.next(docRef.data()));
    });
}

function editQuestionnaire(uid, questionnaire) {
    firebase.firestore().collection("questionnaires").doc(uid).update(questionnaire);
}

function getQuestionnaires() {
    return Observable.create(observer => {
        let result = new Array;
        firebase.firestore().collection("questionnaires").get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    const item = {
                        "uid": doc.id,
                        "name": doc.data().name
                    }
                    result.push(item);
                });
                observer.next(result);
            });
    });
    
}

module.exports = {
    addResponse,
    getResponses,
    createQuestionnaire,
    getQuestionnaire,
    editQuestionnaire,
    getQuestionnaires
}