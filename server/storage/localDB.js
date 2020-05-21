const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const uid = require('uid');

let db;

async function init() {
  db = await open({
    filename: '/storage/database.db',
    driver: sqlite3.Database,
  });
  await db.migrate({
    migrationsPath: '/storage/db_migrations',
  });
}

async function getAllQuizs() {
  const res = await db.all('SELECT * FROM quiz');
  const quizs = [];
  res.forEach(element => {
    quizs.push({
      name: element.name,
      uid: element.uid,
    });
  });
  return quizs;
}

async function getQuiz(quizID) {
  const res = await db.all('SELECT * FROM quiz WHERE uid = ?;', quizID);
  const quiz = {
    name: res[0].name,
    options: JSON.parse(res[0].options),
    questions: JSON.parse(res[0].questions),
    saveTime: res[0].savetime,
  };
  return quiz;
}

async function insertResponse(quizID, responseData) {
  const response = JSON.stringify(responseData.questions);
  await db.run('INSERT OR REPLACE INTO response VALUES (?, ?, ?)', [uid(20), quizID, response]);
}

async function insertQuiz(quizData, quizID) {
  const questions = JSON.stringify(quizData.questions);
  const options = JSON.stringify(quizData.options);
  await db.run('INSERT OR REPLACE INTO quiz VALUES (?, ?, ?, ?, ?);',
    [quizID || uid(20), quizData.name, options, questions, quizData.saveTime]);
}

async function getResponses(quizID) {
  const res = await db.all('SELECT * FROM response WHERE quiz_id = ?', quizID);
  const responses = [];
  res.forEach(element => {
    responses.push({
      questions: JSON.parse(element.questions),
    });
  });
  return responses;
}

module.exports = {
  init,
  getQuiz,
  getAllQuizs,
  insertQuiz,
  insertResponse,
  getResponses,
};
