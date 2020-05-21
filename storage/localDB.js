const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const uid = require('uid');

let db;

async function init() {
  try {
    db = await open({
      filename: '/storage/database.db',
      driver: sqlite3.Database
    });
    await db.migrate({
      migrationsPath: '/storage/db_migrations'
    });
  } catch (error) {
    throw error;
  }
}

async function getAllQuizs() {
  try {
    const res = await db.all('SELECT * FROM quiz');
    const quizs = new Array;
    res.forEach(element => {
      quizs.push({
        name: element.name,
        uid: element.uid
      });
    });
    return quizs;
  } catch (error) {
    throw error;
  }
}

async function getQuiz(quizID) {
  try {
    const res = await db.all('SELECT * FROM quiz WHERE uid = ?;', quizID);
    const quiz = {
      name: res[0].name,
      options: JSON.parse(res[0].options),
      questions: JSON.parse(res[0].questions),
      saveTime: res[0].savetime
    }
    return quiz;
  } catch (error) {
    throw error;
  }
}

async function insertResponse(quizID, responseData) {
  const response = JSON.stringify(responseData.questions);
  try {
    await db.run('INSERT OR REPLACE INTO response VALUES (?, ?, ?)', [uid(20), quizID, response]);
  } catch (error) {
    throw error;
  }
}

async function insertQuiz(quizData, quizID) {
  const questions = JSON.stringify(quizData.questions);
  const options = JSON.stringify(quizData.options);
  try {
    await db.run('INSERT OR REPLACE INTO quiz VALUES (?, ?, ?, ?, ?);', 
    [quizID ? quizID : uid(20), quizData.name, options, questions, quizData.saveTime]);
  } catch (error) {
    throw error;
  }
}

async function getResponses(quizID) {
  try {
    const res = await db.all('SELECT * FROM response WHERE quiz_id = ?', quizID);
    const responses = new Array;
    res.forEach(element => {
      responses.push({
        questions: JSON.parse(element.questions)
      });
    });
    return responses;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  init,
  getQuiz,
  getAllQuizs,
  insertQuiz,
  insertResponse,
  getResponses
}