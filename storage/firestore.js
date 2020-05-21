"use strict";

const firebase = require('firebase-admin');
const serviceAccount = require("../webprog-coursework-e4b42-firebase-adminsdk-p67gn-eff495bc54.json");
const localDB = require('./localDB');

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://webprog-coursework-e4b42.firebaseio.com"
});

const firebaseAuth = async (req, res, next) => {
  if(!req.headers.id_token) {
    return res.status(400).json({
      error: {
        message: 'This request requires authentication headers'
      }
    });
  }
  try {
    const userPayload = await firebase.auth().verifyIdToken(req.headers.id_token);
    req.user = userPayload;
    next();
  } catch (error) {
    return res.status(500).json({error});
  }
}

async function addResponse(quizID, response) {
  try {
    const docRef = await firebase.firestore().collection("questionnaires").doc(quizID)
      .collection("responses").add(response);
    return docRef.id;
  } catch (error) {
    throw error;
  }
}

async function getQuestionnaire(uid) {
  try {
    const docRef = await firebase.firestore().collection("questionnaires").doc(uid).get();
    return docRef.data();
  } catch (error) {
    throw error;
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
  try {
    const snapshot = await firebase.firestore().collection("questionnaires").doc(uid).collection("responses").get();
    snapshot.forEach(doc => {
      result.push(doc.data());
    });
    return result;
  } catch (error) {
    throw error;
  }
}

async function createQuestionnaire(questionnaire) {
  if(!questionnaire) questionnaire = {};
  try {
    const docRef = await firebase.firestore().collection("questionnaires").add(questionnaire);
    return ({id: docRef.id});
  } catch (error) {
    throw error;
  }
}

async function editQuestionnaire(uid, questionnaire) {
  try {
    await firebase.firestore().collection("questionnaires").doc(uid).update(questionnaire);
  } catch (error) {
    throw error;
  }
}

async function getQuestionnaires() {
  let result = new Array;
  try {
    const snapshot = await firebase.firestore().collection("questionnaires").get();
    snapshot.forEach(doc => {
      const item = {
        "uid": doc.id,
        "name": doc.data().name
      }
      result.push(item);
    });
    return result;
  } catch (error) {
    throw error;
  }
}

async function syncLocalDB() {
  await localDB.init();
  const snapshot = await firebase.firestore().collection("questionnaires").get();
  for(const quiz of snapshot.docs) {
    localDB.insertQuiz(quiz.data(), quiz.id);
    const responses = await firebase.firestore().collection("questionnaires").doc(quiz.id).collection("responses").get();
    responses.forEach(response => {
      localDB.insertResponse(response.data(), response.id, quiz.id);
    });
  }
}

module.exports = {
  addResponse,
  getResponses,
  createQuestionnaire,
  getQuestionnaire,
  editQuestionnaire,
  getQuestionnaires,
  grantModeratorRole,
  getUserRole,
  syncLocalDB,
  firebaseAuth
}