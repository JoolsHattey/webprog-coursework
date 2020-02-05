//Express Server

const express = require('express');
const app = express();
const port = 8080;
app.use('/', express.static('client'));

app.get('/yeet', (req, res) => {
    console.log("whattt");
    res.send({"message":"yeetus"});
});

app.listen(port, () => console.log(`Example app listening on port ${port}`));