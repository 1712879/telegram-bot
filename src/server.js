const express = require("express");
const config = require("./config/config");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cron = require("node-cron");
const TelegramBot = require("node-telegram-bot-api");
const {
     PORT,
     TELEGRAM_ID,
     BOT_TOKEN,
     NODE_ENV,
     HEROKU_URL,
     AUTH_TOKEN_NGROK,
} = config;
const { timeTables, fileOptions, getNewsDaily } = require("./timetables");
const ngrok = require("ngrok");
const { TYPES } = require("./constant/constant");
const points = require("./points/points");
const fs = require("fs");

const app = express();
app.use(morgan(":method :url :status - :response-time ms"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
     return res.send("Hello world!");
});

app.get("/photo/logo", async (req, res) => {
     return res.sendFile(`${__dirname}/public/images/botlogo.jpg`);
});

//* =============================================
//* Error handling
app.use((err, req, res, next) => {
     return res.status(500).json({
          status: 500,
          message: err.message,
     });
});

let bot;
(async function () {
     if (NODE_ENV === "production") {
          bot = new TelegramBot(BOT_TOKEN);
          bot.setWebHook(`${HEROKU_URL}/bot/${BOT_TOKEN}`);
     }
     if (NODE_ENV === "ngrok") {
          const url = await ngrok.connect({ port: PORT });
          console.log(`url`, url);
          bot = new TelegramBot(BOT_TOKEN);
          bot.setWebHook(`${url}/bot/${BOT_TOKEN}`);
     } else {
          bot = new TelegramBot(BOT_TOKEN, { polling: true });
     }

     timeTables.forEach((time) => {
          cron.schedule(
               time.time,
               async () => {
                    bot.sendMessage(TELEGRAM_ID, time.message);
                    if (time?.handle) {
                         await time.handle(bot, TELEGRAM_ID);
                    }
               },
               { timezone: "Asia/Bangkok" }
          );
     });
     // send message welcome
     bot.on("message", async function (msg) {
          const chatId = msg.chat.id;
          const { text = "" } = msg;
          await handleBody(chatId, text);
     });
})();

app.post(`/bot/:token`, async (req, res) => {
     const { message } = req.body;
     console.log(`req`, req.body);
     await handleBody(message?.from?.id, message?.text);
     return res.sendStatus(200);
});

const handleBody = async (chatId, body) => {
     try {
          const [type = "", ...data] = body?.split("\n");
          let responseText = "";
          switch (type.toUpperCase()) {
               case TYPES.TASKS:
                    await points.insertPoint({
                         code: data[0],
                         task: data[1],
                         point: data[2],
                         link: data[3],
                    });
                    responseText = "thêm task thành công";
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
                    await bot.sendMessage(
                         chatId,
                         JSON.stringify(responseText, null, 2)
                    );
                    break;
               case TYPES.NEWS:
                    const streamNews = await getNewsDaily(data[0]);
                    await bot.sendPhoto(chatId, streamNews);
                    break;
               default:
                    const stream = fs.createReadStream(
                         "src/public/gif/hello.gif"
                    );
                    await bot.sendAnimation(chatId, stream, {}, fileOptions);
                    await bot.sendMessage(chatId, "tuanphan-bot xin chào!.");
                    break;
          }
     } catch (error) {
          console.log(`error`, error);
          const stream404 = fs.createReadStream("src/public/gif/404.gif");
          await bot.sendAnimation(chatId, stream404, {}, fileOptions);
     }
};

app.all("*", (req, res) => {
     return res.json({
          status: 404,
          message: `Can't find ${req.originalUrl}`,
     });
});
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
