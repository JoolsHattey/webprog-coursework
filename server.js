const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = 8080;

const firestore = require('./firestore')

const data = require('./example-questionnaire.json');

app.use('/', express.static('client'));


app.get('/getquestions', (req, res) => {
    res.send(data);
});

app.post('/submitresponse', (req, res) => {
    console.log(req.body);
    firestore.addResponse(req.body);
});

app.get('/getresponses', (req, res) => {
    res.send(firestore.getResponses());
})


app.listen(port, () => console.log(`Questionnaire Engine listening on port ${port}`));