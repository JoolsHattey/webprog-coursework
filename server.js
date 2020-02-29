"use strict";

const express = require('express');
const app = express();

const router = express.Router();

const port = 8080;

const path = require('path');

const firestore = require('./firestore');

app.get('/api', router);

app.use('/', express.static('client'));

app.use(express.static(path.join(__dirname, 'client')));




function submitResponse(req, res) {
    firestore.addResponse(req.params.uid, req.body);
}

function getResponses(req, res) {
    res.send(firestore.getResponses());
}

function createQuestionnaire(req, res) {
    firestore.createQuestionnaire(req.body)
        .subscribe(data => res.send(data));
}

function getQuestionnaire(req, res) {
    firestore.getQuestionnaire(req.params.uid)
        .subscribe(data => res.send(data));
}

function editQuestionnaire(req, res) {
    firestore.editQuestionnaire(req.params.uid, req.body);
}

function getQuestionnaires(req, res) {
    firestore.getQuestionnaires()
        .subscribe(data => res.send(data));
}

function authenticateUser(req, res) {
    firestore.verifyAuth(req.body.token);
}


router.post('/submitresponse/:uid', express.json(), submitResponse);
router.get('/getresponses', getResponses);
router.post('/createquestionnaire', express.json(), createQuestionnaire);
router.get('/questionnaire/:uid', getQuestionnaire);
router.get('/questionnaires', getQuestionnaires);
router.post('/editquestionnaire/:uid', express.json(), editQuestionnaire);

router.post('/authenticate', express.json(), authenticateUser);

app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, 'client/index.html'));
});

app.listen(port, () => console.log(`Questionnaire Engine listening on port ${port}`));