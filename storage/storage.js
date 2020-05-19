const firestore = require('./firestore');
const localDB = require('./localDB');
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const dayjs = require('dayjs');

let localDBMode;

async function init(dbMode) {
    localDBMode = dbMode;
    if(localDBMode) {
        await localDB.init();
    }
}

async function getResponsesCSV(quizID) {
    try {
        const responses = await getResponses(quizID);
        const quiz = await getQuestionnaire(quizID);
        const headers = [{id: 'time', title: 'Submission Time'}];
        const records = [];
        quiz.questions.forEach(element => {
            headers.push({
                id: element.id, title: element.text
            });
        });
        const csvWriter = createCsvStringifier({
            header: headers
        });
        responses.sort((a, b) => a.time - b.time);
        for(const [i, response] of responses.entries()) {
            records.push({})
            records[i].time = new dayjs(response.time).format('DD-MM-YYYY HH:mm:ss');
            response.questions.forEach(element => {
                records[i][element.id] = element.answer;
            });
        };
        const csv = csvWriter.getHeaderString() + csvWriter.stringifyRecords(records);
        return csv;
    } catch (err) {
        throw err;
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
    getQuestionnaires,
    getResponsesCSV
}