const express = require("express");
const config = require("./config/config");
const constant = require("./constant/constant");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cron = require("node-cron");
const request = require('request');
const TelegramBot = require('node-telegram-bot-api');
const { json } = require("body-parser");
const { PORT, TELEGRAM_ID, BOT_TOKEN, NODE_ENV, HEROKU_URL } = config;
const { G9_GIF } = constant;

const app = express();
app.use(morgan(":method :url :status - :response-time ms"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
     return res.send("Hello world!");
});

app.get('/photo/logo', async (req, res) =>{
     return res.sendFile(`${__dirname}/public/images/botlogo.jpg`)
})

app.post(`/bot${BOT_TOKEN}`, (req, res) => {
     console.log('xin nghe anh Bin :)')
     bot.sendMessage(TELEGRAM_ID, 'Dậy đi anh Bin :))');
     return res.status(200),json({});
})

//* =============================================
app.all("*", (req, res) => {
     return res.json({
          status: 404,
          message: `Can't find ${req.originalUrl}`,
     });
});
//* Error handling
app.use((err, req, res, next) => {
     return res.status(500).json({
          status: 500,
          message: err.message,
     });
});

cron.schedule('00 23 * * *', () => {
     bot.sendMessage(TELEGRAM_ID, 'Ngủ đi anh Bin đẹp trai');
}, {timezone: 'Asia/Bangkok'});

cron.schedule('0 8 * * *', () => {
     bot.sendMessage(TELEGRAM_ID, 'Dậy đi anh Bin :))');
}, {timezone: 'Asia/Bangkok'});

cron.schedule('0 8 * * SUN', () => {
     bot.sendMessage(TELEGRAM_ID, 'Hôm nay là Chủ Nhật, xõa đi anh Bin :))');
}, {timezone: 'Asia/Bangkok'});

cron.schedule('0 12 * * *', () => {
     bot.sendMessage(TELEGRAM_ID, 'Dậy đi anh Bin :))');
}, {timezone: 'Asia/Bangkok'});

let bot;
const options = {
     webHook: {
       port: PORT
     }
   };
if(NODE_ENV === 'production'){
     bot = new TelegramBot(BOT_TOKEN, options);
     bot.setWebHook(`${HEROKU_URL}/bot${BOT_TOKEN}`);
}else{
     bot = new TelegramBot(BOT_TOKEN, {polling: true});
}


// send message welcome
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'TP_BOT xin chào.');
});


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
