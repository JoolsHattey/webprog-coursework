"use strict";

const firebase = require('firebase-admin');
const serviceAccount = require("./webprog-coursework-e4b42-firebase-adminsdk-p67gn-eff495bc54.json");

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://webprog-coursework-e4b42.firebaseio.com"
});

const Observable = require('rxjs/Observable').Observable;


/**********************
 * User
 * ****************** */

function addResponse(uid, response, authToken) {
    firebase.firestore().collection("questionnaires").doc(uid)
        .collection("responses").add(response);
}

function getQuestionnaire(uid, authToken) {
    return Observable.create(observer => {
        firebase.firestore().collection("questionnaires").doc(uid).get()
            .then(docRef => observer.next(docRef.data()));
    });
}

/**********************
 * Admin
 * ****************** */

function verifyAuth(idToken) {
    return Observable.create(observer => {
        firebase.auth().verifyIdToken(idToken)
            .then(function(decodedToken) {
                let uid = decodedToken.uid;
                observer.next({"result": uid, "auth": true});
            }).catch(function(error) {
                observer.next({"result": error, "auth": false});
            });
    })
    
}

async function getResponses(authToken) {
    return await firebase.firestore().collection("responses").get();
}

function createQuestionnaire(questionnaire, authToken) {
    return Observable.create(observer => {
        firebase.firestore().collection("questionnaires").add(questionnaire)
            .then(docRef => {
                observer.next({id: docRef.id});
            });
    });
}

function editQuestionnaire(uid, questionnaire, authToken) {
    firebase.firestore().collection("questionnaires").doc(uid).update(questionnaire);
}

function getQuestionnaires(authToken) {
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
    getQuestionnaires,
    verifyAuth
}