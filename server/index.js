'use strict';

const express = require('express');
const compression = require('compression');
const app = express();
const port = 8080;
const path = require('path');
const gdrive = require('./gdrive');

const storage = require('./storage');
const localDBMode = process.env.DBMODE;
storage.init(localDBMode);

const firestore = require('./storage/firestore');

async function getQuiz(req, res) {
  try {
    res.send(await storage.getQuiz(req.params.uid));
  } catch (error) {
    res.sendStatus(400);
  }
}

async function getAllQuizs(req, res) {
  try {
    res.send(await storage.getAllQuizs());
  } catch (error) {
    res.sendStatus(400);
  }
}

async function submitResponse(req, res) {
  try {
    await storage.addResponse(req.params.uid, req.body);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(400);
  }
}

async function getResponses(req, res) {
  try {
    res.send(await storage.getResponses(req.params.uid));
  } catch (error) {
    res.sendStatus(400);
  }
}

async function createQuiz(req, res) {
  try {
    res.send(await storage.createQuiz(req.body));
  } catch (error) {
    res.sendStatus(400);
  }
}

async function editQuiz(req, res) {
  try {
    await storage.editQuiz(req.params.uid, req.body);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(400);
  }
}

async function deleteQuiz(req, res) {
  try {
    await storage.deleteQuiz(req.params.uid);
    res.sendStatus(200);
  } catch (error) {
    console.log(error)
    res.sendStatus(400);
  }
}

async function exportResponsesCSV(req, res) {
  try {
    res.send(await storage.getResponsesCSV(req.params.uid));
  } catch (err) {
    res.sendStatus(400);
  }
}

async function exportResponsesGoogleDrive(req, res) {
  try {
    const responses = await storage.getResponses(req.params.uid);
    const quiz = await storage.getQuiz(req.params.uid);
    const data = await gdrive.saveData(req.body.apiToken, quiz, responses, req.get('origin'));
    res.send(data);
  } catch (error) {
    res.sendStatus(400);
  }
}

// function yiss(req, res) {
//   firestore.grantModeratorRole(req.params.email);
// }

// API router
const router = express.Router();
app.use('/api', router);

// Catch all other routes and send to client
app.use(compression());
app.use(express.static(path.join(__dirname, '../client')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});


router.get('/questionnaires', getAllQuizs);
router.get('/questionnaires/:uid', getQuiz);
router.post('/questionnaires', firestore.decodeAuthToken, firestore.isAuthenticated, firestore.isAdmin, express.json(), createQuiz);
router.put('/questionnaires/:uid', firestore.decodeAuthToken, firestore.isAuthenticated, firestore.isAdmin, express.json(), editQuiz);
router.delete('/questionnaires/:uid', firestore.decodeAuthToken, firestore.isAuthenticated, firestore.isAdmin, deleteQuiz);


router.get('/questionnaires/:uid/responses', firestore.decodeAuthToken, firestore.isAuthenticated, firestore.isAdmin, getResponses);
router.post('/questionnaires/:uid/responses', express.json(), submitResponse);
router.get('/questionnaires/:uid/responses/export/csv', firestore.decodeAuthToken, firestore.isAuthenticated, firestore.isAdmin, exportResponsesCSV);
router.post('/questionnaires/:uid/responses/export/drive', firestore.decodeAuthToken, firestore.isAuthenticated, firestore.isAdmin, express.json(), exportResponsesGoogleDrive);

// router.get('/yiss/:email', yiss);


app.listen(port, () => {
  console.log(`Questionnaire Engine listening on port ${port}`);
  console.log(`Storage Mode: ${localDBMode ? 'Local SQLite' : 'Firestore'}`);
});
