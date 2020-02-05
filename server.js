const express = require('express');
const app = express();
const port = 8080;

const data = require('./example-questionnaire.json');

app.use('/', express.static('client'));


app.get('/getquestions', (req, res) => {
    res.send(data);
});


app.listen(port, () => console.log(`Example app listening on port ${port}`));