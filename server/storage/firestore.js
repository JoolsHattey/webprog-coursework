'use strict';

const firebase = require('firebase-admin');
const serviceAccount = require('../webprog-coursework-e4b42-firebase-adminsdk-p67gn-eff495bc54.json');
// const localDB = require('./localDB');

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://webprog-coursework-e4b42.firebaseio.com',
});

const decodeAuthToken = async (req, res, next) => {
  if (!req.headers.id_token) {
    return res.status(400).json({
      error: {
        message: 'This request requires authentication headers',
      },
    });
  }
  try {
    const userPayload = await firebase.auth().verifyIdToken(req.headers.id_token);
    req.user = userPayload;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

const isAuthenticated = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({
      error: {
        message: 'You are not authorised to perform this aciton. Please login.',
      },
    });
  }
};

const isAdmin = (req, res, next) => {
  try {
    if (req.user.admin) {
      next();
    } else {
      return res.staus(403).json({
        error: {
          message: 'You do not have access to the requested resource.',
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: {
        message: 'Error occured while getting user roles.',
      },
    });
  }
};

async function addResponse(quizID, response) {
  const docRef = await firebase.firestore().collection('questionnaires').doc(quizID)
    .collection('responses').add(response);
  return docRef.id;
}

async function getQuiz(uid) {
  const docRef = await firebase.firestore().collection('questionnaires').doc(uid).get();
  return docRef.data();
}

async function grantAdminRole(email) {
  const user = await firebase.auth().getUserByEmail(email); // 1
  if (user.customClaims && user.customClaims.admin === true) {
    return;
  } // 2
  return firebase.auth().setCustomUserClaims(user.uid, {
    admin: true,
  }); // 3
}

async function getUserRole(uid) {
  const user = await firebase.auth().getUser(uid);
  console.log(user);
}

async function getResponses(uid) {
  const result = [];
  const snapshot = await firebase.firestore().collection('questionnaires').doc(uid).collection('responses').get();
  snapshot.forEach(doc => {
    result.push(doc.data());
  });
  return result;
}

async function createQuiz(questionnaire) {
  if (!questionnaire) questionnaire = {};
  const docRef = await firebase.firestore().collection('questionnaires').add(questionnaire);
  return ({ id: docRef.id });
}

async function editQuiz(uid, questionnaire) {
  await firebase.firestore().collection('questionnaires').doc(uid).update(questionnaire);
}

async function deleteQuiz(uid) {
  await firebase.firestore().collection('questionnaires').doc(uid).delete();
}

async function getAllQuizs() {
  const result = [];
  const snapshot = await firebase.firestore().collection('questionnaires').get();
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
//   const snapshot = await firebase.firestore().collection('questionnaires').get();
//   for (const quiz of snapshot.docs) {
//     localDB.insertQuiz(quiz.data(), quiz.id);
//     const responses = await firebase.firestore().collection('questionnaires').doc(quiz.id).collection('responses').get();
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
  grantAdminRole,
  getUserRole,
  // syncLocalDB,
  decodeAuthToken,
  isAuthenticated,
  isAdmin,
};
