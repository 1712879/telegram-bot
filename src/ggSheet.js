const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./config/pvt-bot.json');

const doc = new GoogleSpreadsheet('13uqnLCCfutMFD7CZWRvlWueRahRKio0tQTmCEuStxlY');
doc.useServiceAccountAuth(creds);

const preInit = async () => {
    await doc.loadInfo(); 
    const sheet = doc.sheetsByTitle['timetables']
    const rows = await sheet.getRows();
    rows.forEach(row => {
        console.log(row.Mon);
    });
    
}

(async () => {
    await preInit()
})()    

const readSheet = async (weekDay = 'Mon') => {
    // console.log(creds)
}

module.exports={readSheet}