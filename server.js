"use strict";

const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const firestore = require('./firestore');




function submitResponse(req, res) {
    console.log(req.body)
    firestore.addResponse(req.params.uid, req.body);
}

function getResponses(req, res) {
    firestore.getResponses(req.params.uid)
        .subscribe(data => {
            res.send(data);
    });
    //res.send(firestore.getResponses());
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

router.post('/authenticate', express.json(), authenticateUser);





app.listen(port, () => console.log(`Questionnaire Engine listening on port ${port}`));