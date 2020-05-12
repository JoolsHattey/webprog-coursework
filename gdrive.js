const {google} = require('googleapis');
const credentials = require('./credentials.json');
const dayjs = require('dayjs');

async function authorise(credentials, userAuthCode, url) {
    const {client_secret, client_id, redirect_uris} = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
    try {
        const token = await oAuth2Client.getToken((userAuthCode.authToken));
        oAuth2Client.refre
        oAuth2Client.setCredentials(token.tokens);
        return oAuth2Client;
    } catch (err) {
        if (err) return console.error('Error retrieving access token', err);
    }
}

async function saveData(authToken, quizData, responseData, url) {
    const auth = await authorise(credentials, authToken, url);
    const sheets = google.sheets({version: 'v4', auth});

    const columnHeaders = {values: []};
    quizData.questions.forEach(question => {
        console.log(question)
        columnHeaders.values.push({
            userEnteredValue: {
                stringValue: question.text
            }
        });
    });

    const rows = [columnHeaders];
    responseData.forEach(response => {
        const row = {values: []};
        row.values.push({
            userEnteredValue: {
                stringValue: new dayjs(response.time).format('DD-MM-YYYY HH:mm:ss')
            }
        });
        response.questions.forEach(question => {
            
            row.values.push({
                userEnteredValue: {
                    stringValue: question.answer ? question.answer.toString() : null
                }
            });
        });
        console.log(row.values, columnHeaders.values)
        rows.push(row);
    });

    const resource = {
        properties: {
            title: quizData.name,
        },
        sheets: [
            {
                properties: {}, 
                data: [
                    {
                        startRow: 0,
                        startColumn: 0,
                        rowData: rows
                    }
                ]
            }
        ]
    };
    try {
        const spreadsheet = await sheets.spreadsheets.create({
            resource,
            fields: 'spreadsheetId',
            fields: 'spreadsheetUrl',
        });
        return {url: spreadsheet.data.spreadsheetUrl}
    } catch (error) {
        console.log(error);
    }
    

}

module.exports = {
    saveData
}