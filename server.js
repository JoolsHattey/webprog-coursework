const express = require('express');
const app = express();
const port = 8080;

const firestore = require('./firestore');

const data = require('./example-questionnaire.json');

app.use('/', express.static('client'));


function getQuestions(req, res) {
    res.send(data);
}

function submitResponse(req, res) {
    firestore.addResponse(req.body);
}

function getResponses(req, res) {
    res.send(firestore.getResponses());
}

function createQuestionnaire(req, res) {
    firestore.createQuestionnaire(req.body).subscribe(data => res.send(data));
}

app.get('/getquestions', getQuestions);
app.post('/submitresponse', express.json(), submitResponse);
app.get('/getresponses', getResponses);
app.post('/createquestionnaire', express.json(), createQuestionnaire);

app.listen(port, () => console.log(`Questionnaire Engine listening on port ${port}`));