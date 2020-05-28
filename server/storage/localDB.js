const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const uid = require('uid');
const createError = require('http-errors');

let db;

async function init() {
  db = await open({
    filename: './server/storage/database.db',
    driver: sqlite3.Database,
  });
  await db.migrate({
    migrationsPath: './server/storage/db_migrations',
  });
}

async function getAllQuizs() {
  const res = await db.all('SELECT * FROM quiz');
  const quizs = [];
  res.forEach(element => {
    quizs.push({
      uid: element.uid,
      name: element.name,
    });
  });
  return quizs;
}

async function getQuiz(quizID) {
  const res = await db.all('SELECT * FROM quiz WHERE uid = ?;', quizID);
  if (res.length === 0) throw createError(404, 'Quiz not found');
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
  await db.run('INSERT INTO response VALUES (?, ?, ?)', [uid(20), quizID, response]);
}

async function insertQuiz(quizData, quizID) {
  if (!quizData) quizData = {};
  if (!quizID) quizID = uid(20);
  const questions = JSON.stringify(quizData.questions);
  const options = JSON.stringify(quizData.options);
  await db.run('INSERT OR REPLACE INTO quiz VALUES (?, ?, ?, ?, ?);',
    [quizID, quizData.name, options, questions, quizData.saveTime]);
  return ({ id: quizID });
}

async function deleteQuiz(quizID) {
  const res = await db.run('DELETE FROM quiz WHERE uid = ?', quizID);
  if (res.changes === 0) throw createError(404, 'Quiz not found');
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
  deleteQuiz,
  getResponses,
};
