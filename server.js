"use strict";

const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const { Parser } = require('json2csv');
const fs = require('fs');

const storage = require('./storage');
storage.init();

async function submitResponse(req, res) {
    storage.addResponse(req.params.uid, req.body);
}

async function getResponses(req, res) {
    res.send(await storage.getResponses(req.params.uid));
}

async function createQuestionnaire(req, res) {
    res.send(await storage.createQuestionnaire(req.body));
}

async function getQuestionnaire(req, res) {
    res.send(await storage.getQuestionnaire(req.params.uid));
}

async function editQuestionnaire(req, res) {
    console.log(req.body)
    storage.editQuestionnaire(req.params.uid, req.body);
}

async function getQuestionnaires(req, res) {
    res.send(await storage.getQuestionnaires())
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
        const fields = [];
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

// firestore.syncLocalDB();

console.log(process.env.NODE_ENV)


const router = express.Router();

app.use('/api', router);

app.use(express.static(__dirname + '/client'))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/index.html'));
});

router.post('/submitresponse/:uid', express.json(), submitResponse);
router.get('/responses/:uid', getResponses);
router.post('/createquestionnaire', express.json(), createQuestionnaire);
router.get('/questionnaire/:uid', getQuestionnaire);
router.get('/questionnaires', getQuestionnaires);
router.post('/editquestionnaire/:uid', express.json(), editQuestionnaire);

router.post('/authenticate', express.json(), getUserRole);

router.get('/yiss/:uid', getResponsesCSV)







app.listen(port, () => console.log(`Questionnaire Engine listening on port ${port}`));