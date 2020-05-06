"use strict";

const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const firestore = require('./firestore');


async function submitResponse(req, res) {
    firestore.addResponse(req.params.uid, req.body);
}

async function getResponses(req, res) {
    res.send(await firestore.getResponses(req.params.uid));
}

async function createQuestionnaire(req, res) {
    res.send(await firestore.createQuestionnaire(req.body));
}

async function getQuestionnaire(req, res) {
    res.send(await firestore.getQuestionnaire(req.params.uid));
}

async function editQuestionnaire(req, res) {
    console.log(req.body)
    firestore.editQuestionnaire(req.params.uid, req.body);
}

async function getQuestionnaires(req, res) {
    res.send(await firestore.getQuestionnaires())
}

function authenticateUser(req, res) {
    firestore.verifyAuth(req.body.token);
}

function getUserRole(req, res) {
    console.log(req.body)
    firestore.getUserRole(req.body.token)
}


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

router.get('/yiss', getUserRole)







app.listen(port, () => console.log(`Questionnaire Engine listening on port ${port}`));