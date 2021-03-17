const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./config/pvt-bot.json');

// const doc = new GoogleSpreadsheet('1Dm6LfvBJB8Do4ss8BWo1zAwKkBHuyxEO6487yAriylE');
// doc.useServiceAccountAuth(creds);

const preInit = async () =>
{
    const doc = new GoogleSpreadsheet('1rUNf8rVTePC0YKxujd7qfYgfPEB65niuweJmYT1cMrU');
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo(); // loads sheets

}

const createNewSheet = async () =>
{
    const doc1 = new GoogleSpreadsheet();
    await doc1.useServiceAccountAuth(creds);
    await doc1.createNewSpreadsheetDocument({ title: 'This is a new doc' });
    console.log(doc1.spreadsheetId);
    const sheet1 = doc1.sheetsByIndex[0];
}

(async () =>
{
    await preInit()
    // await createNewSheet()
})()

const readSheet = async (weekDay = 'Mon') =>
{
    // console.log(creds)
}

module.exports = { readSheet }