const firestore = require('./firestore');
const localDB = require('./localDB');

let dataStore;

let localDBMode;

async function init(dbMode) {
    localDBMode = dbMode;
    if(localDBMode) {
        await localDB.init();
    }
}



async function addResponse(quizID, responseData) {
    if(localDBMode) return await localDB.insertResponse(quizID, responseData);
    return await firestore.addResponse(quizID, responseData);
}
async function getResponses(quizID) {
    if(localDBMode) return await localDB.getResponses(quizID);
    return await firestore.getResponses(quizID);
}
async function createQuestionnaire(quizData) {
    if(localDBMode) return await localDB.insertQuiz(quizData);
    return await firestore.createQuestionnaire(quizData);
}
async function getQuestionnaire(uid) {
    if(localDBMode) return await localDB.getQuiz(uid);
    return await firestore.getQuestionnaire(uid);
}
async function editQuestionnaire(uid, quizData) {
    if(localDBMode) return await localDB.insertQuiz(quizData, uid);
    return await firestore.editQuestionnaire(uid, quizData);
}
async function getQuestionnaires() {
    if(localDBMode) return await localDB.getAllQuizs();
    return await firestore.getQuestionnaires();
}

module.exports = {
    init,
    addResponse,
    getResponses,
    createQuestionnaire,
    getQuestionnaire,
    editQuestionnaire,
    getQuestionnaires
}