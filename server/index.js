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
    const data = await gdrive.saveData(req.body, quiz, responses, req.get('origin'));
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

// User routes
router.get('/questionnaire/:uid', getQuiz);
router.get('/questionnaires', getAllQuizs);
router.post('/submitresponse/:uid', express.json(), submitResponse);

// Admin routes
router.get('/responses/:uid', firestore.firebaseAuth, getResponses);
router.post('/createquestionnaire', firestore.firebaseAuth, express.json(), createQuiz);
router.post('/editquestionnaire/:uid', firestore.firebaseAuth, express.json(), editQuiz);
router.get('/export/:uid', firestore.firebaseAuth, exportResponsesCSV);
router.post('/exportdrive/:uid', firestore.firebaseAuth, express.json(), exportResponsesGoogleDrive);


// router.get('/yiss/:email', yiss);


app.listen(port, () => {
  console.log(`Questionnaire Engine listening on port ${port}`);
  console.log(`Storage Mode: ${localDBMode ? 'Local SQLite' : 'Firestore'}`);
});
