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

async function addResponse(quizID, responseData) {
  try {
    if(localDBMode) return await localDB.insertResponse(quizID, responseData);
    return await firestore.addResponse(quizID, responseData);
  } catch (error) {
    throw error;
  }
}
async function getResponses(quizID) {
  try {
    if(localDBMode) return await localDB.getResponses(quizID);
    return await firestore.getResponses(quizID);
  } catch (error) {
    throw error;
  }
}
async function createQuestionnaire(quizData) {
  try {
    if(localDBMode) return await localDB.insertQuiz(quizData);
    return await firestore.createQuestionnaire(quizData);
  } catch (error) {
    throw error;
  }
}
async function getQuestionnaire(uid) {
  try {
    if(localDBMode) return await localDB.getQuiz(uid);
    return await firestore.getQuestionnaire(uid);
  } catch (error) {
    throw error;
  }
}
async function editQuestionnaire(uid, quizData) {
  try {
    if(localDBMode) return await localDB.insertQuiz(quizData, uid);
    return await firestore.editQuestionnaire(uid, quizData);
  } catch (error) {
    throw error;
  }
}
async function getQuestionnaires() {
  try {
    if(localDBMode) return await localDB.getAllQuizs();
    return await firestore.getQuestionnaires();
  } catch (error) {
    throw error;
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