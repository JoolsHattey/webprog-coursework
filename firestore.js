const firebase = require('firebase');
const firebaseConfig = require('./firebase.json');
const firebaseapp = firebase.initializeApp(firebaseConfig);


function addResponse(response) {
    firebase.firestore().collection("responses").add(response);
}

async function getResponses() {
    return await firebase.firestore().collection("responses").get();;
}

module.exports = {
    addResponse,
    getResponses
}