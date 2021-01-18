require("dotenv").config();

const PORT = process.env.PORT || 5000;
const TELEGRAM_ID = process.env.TELEGRAM_ID || '';
const BOT_TOKEN = process.env.BOT_TOKEN || '';

module.exports = {
     PORT,
     TELEGRAM_ID,
     BOT_TOKEN
};
