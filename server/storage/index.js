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

function getQuiz(uid) {
  if (localDBMode) return localDB.getQuiz(uid);
  return firestore.getQuiz(uid);
}

function getAllQuizs() {
  if (localDBMode) return localDB.getAllQuizs();
  return firestore.getAllQuizs();
}

function addResponse(quizID, responseData) {
  if (localDBMode) return localDB.insertResponse(quizID, responseData);
  return firestore.addResponse(quizID, responseData);
}

function getResponses(quizID) {
  if (localDBMode) return localDB.getResponses(quizID);
  return firestore.getResponses(quizID);
}

function createQuiz(quizData) {
  if (localDBMode) return localDB.insertQuiz(quizData);
  return firestore.createQuiz(quizData);
}

function editQuiz(uid, quizData) {
  if (localDBMode) return localDB.insertQuiz(quizData, uid);
  return firestore.editQuiz(uid, quizData);
}

async function getResponsesCSV(quizID) {
  const responses = await getResponses(quizID);
  const quiz = await getQuiz(quizID);
  const headers = [{ id: 'time', title: 'Date' }];
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
  createQuiz,
  getQuiz,
  editQuiz,
  getAllQuizs,
  getResponsesCSV,
};
