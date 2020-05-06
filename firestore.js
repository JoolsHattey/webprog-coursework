"use strict";

const firebase = require('firebase-admin');
const serviceAccount = require("./webprog-coursework-e4b42-firebase-adminsdk-p67gn-eff495bc54.json");

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://webprog-coursework-e4b42.firebaseio.com"
});

/**********************
 * User
 * ****************** */

function addResponse(uid, response, authToken) {
    firebase.firestore().collection("questionnaires").doc(uid)
        .collection("responses").add(response);
}

async function getQuestionnaire(uid, authToken) {
    const docRef = await firebase.firestore().collection("questionnaires").doc(uid).get();
    return docRef.data();
}

/**********************
 * Admin
 * ****************** */

async function verifyAuth(idToken) {
    try {
        const decodedToken = await firebase.auth().verifyIdToken(idToken);
        let uid = decodedToken.uid;
        return ({"result": uid, "auth": true});
    } catch (error) {
        return ({"result": error, "auth": false});
    }
}

async function grantModeratorRole(email) {
    const user = await firebase.auth().getUserByEmail(email); // 1
    if (user.customClaims && user.customClaims.moderator === true) {
        return;
    } // 2
    return firebase.auth().setCustomUserClaims(user.uid, {
        moderator: true
    }); // 3
}

async function getUserRole(uid) {
    const user = await firebase.auth().getUser(uid);
    console.log(user);
}

async function getResponses(uid) {
    let result = new Array;
    const snapshot = await firebase.firestore().collection("questionnaires").doc(uid).collection("responses").get();
    snapshot.forEach(doc => {
        result.push(doc.data());
    });
    return result;
}

async function createQuestionnaire(questionnaire, authToken) {
    if(!questionnaire) questionnaire = {};
    const docRef = await firebase.firestore().collection("questionnaires").add(questionnaire);
    return ({id: docRef.id});
}

function editQuestionnaire(uid, questionnaire, authToken) {
    console.log(uid, questionnaire);
    firebase.firestore().collection("questionnaires").doc(uid).update(questionnaire);
}

async function getQuestionnaires(authToken) {
    let result = new Array;
    const snapshot = await firebase.firestore().collection("questionnaires").get();
    snapshot.forEach(doc => {
        const item = {
            "uid": doc.id,
            "name": doc.data().name
        }
        result.push(item);
    });
    return result;
}

module.exports = {
    addResponse,
    getResponses,
    createQuestionnaire,
    getQuestionnaire,
    editQuestionnaire,
    getQuestionnaires,
    verifyAuth,
    grantModeratorRole,
    getUserRole
}