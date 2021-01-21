const express = require("express");
const config = require("./config/config");
const constant = require("./constant/constant");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cron = require("node-cron");
const TelegramBot = require('node-telegram-bot-api');
const { PORT, TELEGRAM_ID, BOT_TOKEN, NODE_ENV, HEROKU_URL } = config;
const timeTables = require('./timetables.json');
// const ggSheet = require('./ggSheet');


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

//* =============================================
//* Error handling
app.use((err, req, res, next) => {
     return res.status(500).json({
          status: 500,
          message: err.message,
     });
});

timeTables.forEach(time => {
     cron.schedule(time.time, () => {
          bot.sendMessage(TELEGRAM_ID, time.message);
     }, {timezone: 'Asia/Bangkok'});
})

let bot;
if(NODE_ENV === 'production'){
     bot = new TelegramBot(BOT_TOKEN);
     bot.setWebHook(`${HEROKU_URL}/bot/${BOT_TOKEN}`);
}else{
     bot = new TelegramBot(BOT_TOKEN, {polling: true});
}

app.post(`/bot/:token`, (req, res) => {
     const message = `TP_BOT xin chào..`
     bot.sendMessage(TELEGRAM_ID, message, { parse_mode: 'HTML'});
     return res.sendStatus(200);
})

// send message welcome
bot.on('message', function (msg) {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'TP_BOT xin chào.');
});

app.all("*", (req, res) => {
     return res.json({
          status: 404,
          message: `Can't find ${req.originalUrl}`,
     });
});
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
