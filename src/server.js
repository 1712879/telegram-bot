const express = require("express");
const config = require("./config/config");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cron = require("node-cron");
const TelegramBot = require('node-telegram-bot-api');
const { PORT, TELEGRAM_ID, BOT_TOKEN, NODE_ENV, HEROKU_URL } = config;
const timeTables = require('./timetables.json');
const ngrok = require('ngrok');
const { TYPES } = require("./constant/constant");
const points = require('./points/points');

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
     bot.on('message', async function (msg)
     {
          const chatId = msg.chat.id;
          const { text = '' } = msg;
          await handleBody(chatId, text)
          
     });
})();

app.post(`/bot/:token`, async (req, res) =>
{
     const { message = '' } = req.body;
     // const responseText = await handleBody(message?.text)
     // bot.sendMessage(TELEGRAM_ID, responseText, { parse_mode: 'HTML' });
     return res.sendStatus(200);
})

const handleBody = async (chatId, body) =>
{
     try {
          const [type = '', ...data] = body?.split('\n');
          let responseText = '';
          switch (type.toUpperCase()) {
               case TYPES.TASKS:
                    await points.insertPoint({ code: data[0], task: data[1], point: data[2], link: data[3] })
                    responseText = 'thêm task thành công';
                    await bot.sendMessage(chatId, responseText);
                    responseText = `${await points.calculatorPoint()}`;
                    await bot.sendMessage(chatId, responseText);
                    break;
               case TYPES.KPI:
                    responseText = `${await points.calculatorPoint()}`;
                    await bot.sendMessage(chatId, responseText);
                    break;
               case TYPES.SET:
                    responseText = await points.updateMetadataPoint(data);
                    await bot.sendMessage(chatId, responseText);
                    break;
               case TYPES.METADATA:
                    responseText = await points.readMetadata();
                    await bot.sendMessage(chatId, JSON.stringify(responseText, null, 2));
                    break;
               default:
                    break;
          }
          // await bot.sendMessage(chatId, responseText || 'Không hiểu yêu cầu');
     } catch (error) {
          console.log(`error`, error)
          return 'Lỗi thực hiện';
     }
}

app.all("*", (req, res) =>
{
     return res.json({
          status: 404,
          message: `Can't find ${req.originalUrl}`,
     });
});
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));