const { google } = require('googleapis');
const credentials = require('./credentials.json');
const dayjs = require('dayjs');

async function authorise(credentials, userAuthCode, url) {
  const { client_secret: clientSecret, client_id: clientID } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(clientID, clientSecret, url);
  try {
    const token = await oAuth2Client.getToken((userAuthCode));
    oAuth2Client.setCredentials(token.tokens);
    return oAuth2Client;
  } catch (err) {
    if (err) return console.error('Error retrieving access token', err);
  }
}

async function saveData(authToken, quizData, responseData, url) {
  const auth = await authorise(credentials, authToken, url);
  const sheets = google.sheets({ version: 'v4', auth });
  const resource = createSheet(quizData, responseData);
  const spreadsheet = await sheets.spreadsheets.create({
    resource,
    fields: 'spreadsheetUrl',
  });
  return { url: spreadsheet.data.spreadsheetUrl };
}

function createSheet(quizData, responseData) {
  responseData.sort((a, b) => {
    if (dayjs(a.time).isBefore(dayjs(b.time))) {
      return -1;
    }
    if (dayjs(a.time).isBefore(dayjs(b.time))) {
      return 1;
    }
    return 0;
  });

  const columnHeaders = { values: [] };
  columnHeaders.values.push({
    userEnteredValue: {
      stringValue: 'Date',
    },
  });
  quizData.questions.forEach(question => {
    columnHeaders.values.push({
      userEnteredValue: {
        stringValue: question.text,
      },
    });
  });

  const rows = [columnHeaders];
  responseData.forEach(response => {
    const row = { values: [] };
    row.values.push({
      userEnteredValue: {
        stringValue: dayjs(response.time).format('DD-MM-YYYY HH:mm:ss'),
      },
    });
    response.questions.forEach(question => {
      row.values.push({
        userEnteredValue: {
          stringValue: question.answer ? question.answer.toString() : null,
        },
      });
    });
    rows.push(row);
  });

  const resource = {
    properties: {
      title: `${quizData.name} - Responses`,
    },
    sheets: [
      {
        properties: {},
        data: [
          {
            startRow: 0,
            startColumn: 0,
            rowData: rows,
          },
        ],
      },
    ],
  };
  return resource;
}

module.exports = {
  saveData,
};
