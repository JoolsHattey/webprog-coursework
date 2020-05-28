'use strict';

const firebase = require('firebase-admin');
const createError = require('http-errors');
const db = firebase.firestore();

async function addResponse(quizID, response) {
  const docRef = await db.collection('questionnaires').doc(quizID)
    .collection('responses').add(response);
  return docRef.id;
}

async function getQuiz(uid) {
  const docRef = await db.collection('questionnaires').doc(uid).get();
  const quizData = docRef.data();
  if (quizData) return quizData;
  throw createError(404, 'Quiz not found');
}

async function getResponses(uid) {
  const result = [];
  const snapshot = await db.collection('questionnaires').doc(uid).collection('responses').get();
  snapshot.forEach(doc => {
    result.push(doc.data());
  });
  return result;
}

async function createQuiz(questionnaire) {
  if (!questionnaire) questionnaire = {};
  const docRef = await db.collection('questionnaires').add(questionnaire);
  return ({ id: docRef.id });
}

async function editQuiz(uid, questionnaire) {
  await db.collection('questionnaires').doc(uid).update(questionnaire);
}

async function deleteQuiz(uid) {
  const snapshot = await db.collection('questionnaires').doc(uid).get();
  await snapshot.ref.delete();
}

async function getAllQuizs() {
  const result = [];
  const snapshot = await db.collection('questionnaires').get();
  snapshot.forEach(doc => {
    const item = {
      uid: doc.id,
      name: doc.data().name,
    };
    result.push(item);
  });
  return result;
}

// async function syncLocalDB() {
//   await localDB.init();
//   const snapshot = await db.collection('questionnaires').get();
//   for (const quiz of snapshot.docs) {
//     localDB.insertQuiz(quiz.data(), quiz.id);
//     const responses = await db.collection('questionnaires').doc(quiz.id).collection('responses').get();
//     responses.forEach(response => {
//       localDB.insertResponse(response.data(), response.id, quiz.id);
//     });
//   }
// }

module.exports = {
  addResponse,
  getResponses,
  createQuiz,
  getQuiz,
  editQuiz,
  deleteQuiz,
  getAllQuizs,
};
