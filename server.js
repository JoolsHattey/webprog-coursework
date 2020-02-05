const express = require('express');
const app = express();
const port = 3000;

const http = require('http-server');
const server = http.createServer();
const port2 = 8080;

server.listen(port2, () => console.log(`Http server listening on port ${port2}`));

app.get('/', (req, res) => {
    res.send({"message":"yeetus"});
});

app.listen(port, () => console.log(`Example app listening on port ${port}`));