const { GoogleSpreadsheet } = require('google-spreadsheet');
const moment = require('moment');
const { SHEET_POINT } = require('../config/config');
const creds = require('../config/pvt-bot.json');
const fs = require('fs');

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
    let totalPoint = rows.reduce((acc, cur) => {
        return acc += Number(cur?.point) || 0;
    }, 0);
    const collected = totalPoint * 8 * 60;
    const metadata = readMetadata();
    const salary = metadata?.BASE_RADIO ? metadata?.BASE_RADIO * collected : 0;
    return `point: ${totalPoint}\ncollected: ${collected}\nsalary: ${salary}`;
}

const updateMetadataPoint = async (updateData) => {
    try {
        const data = fs.readFileSync('src/db.csv', 'utf8');
        const strArr = data.split('\r\n');
        strArr.shift()
        const objectConverted = convertToJSON(strArr);
        const updateObjectConverted = convertToJSON(updateData);
        const dataWrite = {...objectConverted, ...updateObjectConverted}
        const csvString = convertToCSV(dataWrite);
        fs.writeFileSync('src/db.csv', `key,value\r\n${csvString}`);
        return `Updated data successfully!`
    } catch (err) {
        console.log(`Error writing file: ${err}`);
        return `Updated data failed!`
    }
}
const convertToJSON = (strArr) => {
    let obj = strArr.reduce((acc,cur) => {
        const [key = 'default', value = ''] = cur.split(',');
        acc[key] = value;
        return acc;
    }, {});
    return obj;
}
const convertToCSV = (object) => {
    let csvString = Object.entries(object).map(([key, value]) => {
        return `${key},${value}`;
    }).join('\r\n')
    return csvString;
}
const readMetadata = () => {
    const data = fs.readFileSync('src/db.csv', 'utf8');
    const strArr = data.split('\r\n');
    strArr.shift()
    const objectConverted = convertToJSON(strArr);
    return objectConverted;
}
module.exports = { insertPoint, calculatorPoint, updateMetadataPoint, readMetadata }