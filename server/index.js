'use strict';

const express = require('express');
const compression = require('compression');
const app = express();
const port = 8080;
const path = require('path');
const gdrive = require('./gdrive');

const firebase = require('firebase-admin');
const serviceAccount = require('./webprog-coursework-e4b42-firebase-adminsdk-p67gn-eff495bc54.json');
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://webprog-coursework-e4b42.firebaseio.com',
});

const auth = require('./auth');

const storage = require('./storage');
const localDBMode = process.env.DBMODE;
storage.init(localDBMode);

async function getQuiz(req, res, next) {
  try {
    res.send(await storage.getQuiz(req.params.uid));
  } catch (error) {
    next(error);
  }
}

async function getAllQuizs(req, res, next) {
  try {
    res.send(await storage.getAllQuizs());
  } catch (error) {
    next(error);
  }
}

async function submitResponse(req, res, next) {
  try {
    await storage.addResponse(req.params.uid, req.body);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}

async function getResponses(req, res, next) {
  try {
    res.send(await storage.getResponses(req.params.uid));
  } catch (error) {
    next(error);
  }
}

async function createQuiz(req, res, next) {
  try {
    res.send(await storage.createQuiz(req.body));
  } catch (error) {
    next(error);
  }
}

async function editQuiz(req, res, next) {
  try {
    await storage.editQuiz(req.params.uid, req.body);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}

async function deleteQuiz(req, res, next) {
  try {
    await storage.deleteQuiz(req.params.uid);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}

async function exportResponsesCSV(req, res, next) {
  try {
    res.send(await storage.getResponsesCSV(req.params.uid));
  } catch (error) {
    next(error);
  }
}

async function exportResponsesGoogleDrive(req, res, next) {
  try {
    const responses = await storage.getResponses(req.params.uid);
    const quiz = await storage.getQuiz(req.params.uid);
    const data = await gdrive.saveData(req.body.apiToken, quiz, responses, req.get('origin'));
    res.send(data);
  } catch (error) {
    next(error);
  }
}

// API router
const api = express.Router();
app.use('/api', api);

// Catch all other routes and send to client
app.use(compression());
app.use(express.static(path.join(__dirname, '../client')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});


api.get('/questionnaires', auth.middleware, getAllQuizs);
api.get('/questionnaires/:uid', getQuiz);
api.post('/questionnaires', auth.middleware, express.json(), createQuiz);
api.put('/questionnaires/:uid', auth.middleware, express.json(), editQuiz);
api.delete('/questionnaires/:uid', auth.middleware, deleteQuiz);

api.get('/questionnaires/:uid/responses', auth.middleware, getResponses);
api.post('/questionnaires/:uid/responses', express.json(), submitResponse);
api.get('/questionnaires/:uid/responses/export/csv', auth.middleware, exportResponsesCSV);
api.post('/questionnaires/:uid/responses/export/drive', auth.middleware, express.json(), exportResponsesGoogleDrive);


app.listen(port, () => {
  console.log(`Questionnaire Engine listening on port ${port}`);
  console.log(`Storage Mode: ${localDBMode ? 'Local SQLite' : 'Firestore'}`);
});
