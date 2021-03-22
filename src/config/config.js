require("dotenv").config();

const PORT = process.env.PORT || 5000;
const TELEGRAM_ID = process.env.TELEGRAM_ID || '';
const BOT_TOKEN = process.env.BOT_TOKEN || '';
const NODE_ENV = process.env.NODE_ENV || 'development';
const HEROKU_URL = process.env.HEROKU_URL || '';
const SHEET_POINT = process.env.SHEET_POINT || '';
const AUTH_TOKEN_NGROK = process.env.AUTH_TOKEN_NGROK || '';

module.exports = {
     PORT,
     TELEGRAM_ID,
     BOT_TOKEN,
     NODE_ENV,
     HEROKU_URL,
     SHEET_POINT,
     AUTH_TOKEN_NGROK
};
