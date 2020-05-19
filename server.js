"use strict";

const express = require('express');
const compression = require('compression');
const app = express();
const port = 8080;
const path = require('path');
const { Parser } = require('json2csv');
const fs = require('fs');
const gdrive = require('./gdrive');


const storage = require('./storage/storage.js');
const localDBMode = process.env.DBMODE
storage.init(localDBMode);

const firestore = require('./storage/firestore')


async function submitResponse(req, res) {
    try {
        await storage.addResponse(req.params.uid, req.body);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(400);
    }
}

async function getQuestionnaire(req, res) {
    try {
        res.send(await storage.getQuestionnaire(req.params.uid));
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

async function createQuestionnaire(req, res) {
    try {
        res.send(await storage.createQuestionnaire(req.body));
    } catch (error) {
        res.sendStatus(400);
    }
    
}

async function editQuestionnaire(req, res) {
    console.log(req.body)
    try {
        await storage.editQuestionnaire(req.params.uid, req.body);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(400);
    }
    
}

async function getQuestionnaires(req, res) {
    try {
        res.send(await storage.getQuestionnaires())
    } catch (error) {
        res.sendStatus(400);
    }
    
}

function authenticateUser(req, res) {
    firestore.verifyAuth(req.body.token);
}

function getUserRole(req, res) {
    console.log(req.body)
    firestore.getUserRole(req.body.token)
}

async function getResponsesCSV(req, res) {
    try {
        const responses = await storage.getResponses(req.params.uid);
        const quiz = await storage.getQuestionnaire(req.params.uid);
        const fields = [];
        quiz.questions.forEach(element => {
            fields.push(element.text);
        });
        const opts = { fields };
        const parser = new Parser(opts);
        const csv = parser.parse(responses);
        console.log(csv);
        fs.writeFile('thing.csv', csv, function (err) {
            if (err) return console.log(err);
          });
      } catch (err) {
        console.error(err);
      }
}

async function yiss(req, res) {
    firestore.grantModeratorRole(req.params.email);
}

async function exportToGoogleDrive(req, res) {
    const responses = await storage.getResponses(req.params.uid);
    const quiz = await storage.getQuestionnaire(req.params.uid);
    try {
        const data = await gdrive.saveData(req.body, quiz, responses, req.get('origin'));
        console.log({fileID: data});
        res.send(data);
    } catch (error) {
        res.sendStatus(400);
    }
}

async function yeet(req, res) {
    const responses = await storage.getResponses(req.params.uid);
    const quiz = await storage.getQuestionnaire(req.params.uid);
    const data = await gdrive.createSheetLocal(quiz, responses);
    console.log(data)
}

const router = express.Router();

app.use('/api', router);

app.use(compression());

app.use(express.static(__dirname + '/client'));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/index.html'));
});

// User routes
router.get('/questionnaire/:uid', getQuestionnaire);
router.get('/questionnaires', getQuestionnaires);
router.post('/submitresponse/:uid', express.json(), submitResponse);

// Admin routes
router.get('/responses/:uid', firestore.firebaseAuth, getResponses);
router.post('/createquestionnaire', firestore.firebaseAuth, express.json(), createQuestionnaire);
router.post('/editquestionnaire/:uid', firestore.firebaseAuth, express.json(), editQuestionnaire);
router.post('/exportdrive/:uid', firestore.firebaseAuth, express.json(), exportToGoogleDrive);

router.get('/export/:uid', getResponsesCSV)
router.get('/yiss/:email', yiss)







app.listen(port, () => {
    console.log(`Questionnaire Engine listening on port ${port}`);
    console.log(`Storage Mode: ${localDBMode ? 'Local SQLite' : 'Firestore'}`);
});