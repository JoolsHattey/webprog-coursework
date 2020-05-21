const firestore = require('./firestore');
const localDB = require('./localDB');
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const dayjs = require('dayjs');

let localDBMode;

async function init(dbMode) {
  localDBMode = dbMode;
  if (localDBMode) {
    try {
      await localDB.init();
    } catch (error) {
      console.log(error);
    }
  }
}

function addResponse(quizID, responseData) {
  if (localDBMode) return localDB.insertResponse(quizID, responseData);
  return firestore.addResponse(quizID, responseData);
}
function getResponses(quizID) {
  if (localDBMode) return localDB.getResponses(quizID);
  return firestore.getResponses(quizID);
}
function createQuestionnaire(quizData) {
  if (localDBMode) return localDB.insertQuiz(quizData);
  return firestore.createQuestionnaire(quizData);
}
function getQuestionnaire(uid) {
  if (localDBMode) return localDB.getQuiz(uid);
  return firestore.getQuestionnaire(uid);
}
function editQuestionnaire(uid, quizData) {
  if (localDBMode) return localDB.insertQuiz(quizData, uid);
  return firestore.editQuestionnaire(uid, quizData);
}
function getQuestionnaires() {
  if (localDBMode) return localDB.getAllQuizs();
  return firestore.getQuestionnaires();
}
async function getResponsesCSV(quizID) {
  const responses = await getResponses(quizID);
  const quiz = await getQuestionnaire(quizID);
  const headers = [{ id: 'time', title: 'Submission Time' }];
  const records = [];
  quiz.questions.forEach(element => {
    headers.push({
      id: element.id, title: element.text,
    });
  });
  const csvWriter = createCsvStringifier({
    header: headers,
  });
  responses.sort((a, b) => a.time - b.time);
  for (const [i, response] of responses.entries()) {
    records.push({});
    records[i].time = dayjs(response.time).format('DD-MM-YYYY HH:mm:ss');
    response.questions.forEach(element => {
      records[i][element.id] = element.answer;
    });
  }
  const csv = csvWriter.getHeaderString() + csvWriter.stringifyRecords(records);
  return csv;
}

module.exports = {
  init,
  addResponse,
  getResponses,
  createQuestionnaire,
  getQuestionnaire,
  editQuestionnaire,
  getQuestionnaires,
  getResponsesCSV,
};
