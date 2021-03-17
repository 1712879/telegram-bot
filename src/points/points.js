const { GoogleSpreadsheet } = require('google-spreadsheet');
const moment = require('moment');
const { SHEET_POINT } = require('../config/config');
const creds = require('../config/pvt-bot.json');

const insertPoint = async (data) => {
    const doc = new GoogleSpreadsheet(SHEET_POINT);
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['point'];
    await sheet.addRow({ time: moment().format('llll'), ...data });
}

const calculatorPoint = async () => {
    const doc = new GoogleSpreadsheet(SHEET_POINT);
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['point'];
    const rows = await sheet.getRows();
    let total = rows.reduce((acc, cur) => {
        return acc += Number(cur?.point) || 0;
    }, 0);
    return total;
}

module.exports = { insertPoint, calculatorPoint }