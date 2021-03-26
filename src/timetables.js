const fs = require("fs");
const fileOptions = {
     contentType: "image/gif",
};

const puppeteer = require("puppeteer");
const getNewsDaily = async (url) => {
     if (!url) return;
     const stream = fs.createReadStream("src/public/gif/404.gif");
     return stream;

     try {
          const newUrl = url.includes("http") ? url : `https://${url}`;
          const browser = await puppeteer.launch({
               args: [
                    "--incognito",
                    "--no-sandbox",
                    "--single-process",
                    "--no-zygote",
               ],
          });
          const page = await browser.newPage();
          await page.setViewport({ width: 1280, height: 1024 });
          await page.goto(newUrl);
          await page.waitFor(500);
          const data = await page.screenshot({ width: 1280, height: 3500 });
          await browser.close();
          return data;
     } catch (error) {
          console.log(`error`, error);
          const stream = fs.createReadStream("src/public/gif/404.gif");
          return stream;
     }
};
module.exports = {
     timeTables: [
          {
               time: "0 23 * * *",
               message: "Ngủ ngon nhé Tuấn Phan đẹp trai.",
               handle: async (bot) => {
                    const stream = fs.createReadStream("src/public/gif/g9.gif");
                    await bot.sendAnimation(chatId, stream, {}, fileOptions);
               },
          },
          {
               time: "0 8 * * MON-SAT",
               message: "Buổi sáng tốt lành nhé.",
               handle: async (bot, chatId) => {
                    const stream = fs.createReadStream(
                         "src/public/gif/morning.gif"
                    );
                    await bot.sendAnimation(chatId, stream, {}, fileOptions);
               },
          },
          {
               time: "0 8 * * SUN",
               message: "Hôm nay là Chủ Nhật, xõa đi Tuấn Phan :))",
               handle: async (bot, chatId) => {
                    const stream = fs.createReadStream(
                         "src/public/gif/relax.gif"
                    );
                    await bot.sendAnimation(chatId, stream, {}, fileOptions);
               },
          },
          {
               time: "0 12 * * *",
               message: "Tuấn Phan ăn trưa ngon miệng nhé :))",
               handle: async (bot, chatId) => {
                    const stream = fs.createReadStream(
                         "src/public/gif/lunch.gif"
                    );
                    await bot.sendAnimation(chatId, stream, {}, fileOptions);
               },
          },
          {
               time: "15 8 * * *",
               message: "Daily News",
               handle: async (bot, chatId) => {
                    const stream = await getNewsDaily("https://zingnews.vn/");
                    await bot.sendPhoto(chatId, stream);
               },
          },
          {
               time: "16 8 * * *",
               message: "Daily News",
               handle: async (bot, chatId) => {
                    const stream = await getNewsDaily("https://genk.vn/");
                    await bot.sendPhoto(chatId, stream);
               },
          },
          {
               time: "0 21 * * *",
               message: "Daily News",
               handle: async (bot, chatId) => {
                    const stream = await getNewsDaily("https://dev.to/");
                    await bot.sendPhoto(chatId, stream);
               },
          },
     ],
     fileOptions,
     getNewsDaily,
};
