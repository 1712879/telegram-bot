const express = require("express");
const config = require("./config/config");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cron = require("node-cron");
const TelegramBot = require('node-telegram-bot-api');
const { PORT, TELEGRAM_ID, BOT_TOKEN, NODE_ENV, HEROKU_URL } = config;
const timeTables = require('./timetables.json');
const ggSheet = require('./ggSheet');
const ngrok = require('ngrok');

const app = express();
app.use(morgan(":method :url :status - :response-time ms"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) =>
{
     return res.send("Hello world!");
});

app.get('/photo/logo', async (req, res) =>
{
     return res.sendFile(`${__dirname}/public/images/botlogo.jpg`)
})

//* =============================================
//* Error handling
app.use((err, req, res, next) =>
{
     return res.status(500).json({
          status: 500,
          message: err.message,
     });
});

let bot;
(async function ()
{
     if (NODE_ENV === 'production') {
          const url = await ngrok.connect({ port: PORT });
          bot = new TelegramBot(BOT_TOKEN);
          bot.setWebHook(`${url}/bot/${BOT_TOKEN}`);
     } else {
          bot = new TelegramBot(BOT_TOKEN, { polling: true });
     }

     timeTables.forEach(time =>
     {
          cron.schedule(time.time, () =>
          {
               bot.sendMessage(TELEGRAM_ID, time.message);
          }, { timezone: 'Asia/Bangkok' });
     })
     // send message welcome
     bot.on('message', function (msg)
     {
          const chatId = msg.chat.id;
          console.log(`msg`, msg)
          bot.sendMessage(chatId, 'TP_BOT xin chào.');
     });
})();

app.post(`/bot/:token`, (req, res) =>
{
     const message = `TP_BOT xin chào..👋`;
     bot.sendMessage(TELEGRAM_ID, message, { parse_mode: 'HTML' });
     return res.sendStatus(200);
})

app.all("*", (req, res) =>
{
     return res.json({
          status: 404,
          message: `Can't find ${req.originalUrl}`,
     });
});
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));