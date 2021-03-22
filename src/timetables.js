const fs = require('fs')
const fileOptions = {
    contentType: 'image/gif',
  };
module.exports = {timeTables: [
    {
        "time": "0 23 * * *",
        "message": "Ngủ ngon nhé Tuấn Phan đẹp trai.",
        handle: async (bot) => {
            const stream = fs.createReadStream('src/public/gif/g9.gif');
            await bot.sendAnimation(chatId,stream,{} ,fileOptions)
        }
    },
    {
        "time": "0 8 * * MON-SAT",
        "message": "Buổi sáng tốt lành nhé.",
        handle: async (bot, chatId) => {
            const stream = fs.createReadStream('src/public/gif/morning.gif');
            await bot.sendAnimation(chatId,stream,{} ,fileOptions)
        }
    },
    {
        "time": "0 8 * * SUN",
        "message": "Hôm nay là Chủ Nhật, xõa đi Tuấn Phan :))",
        handle: async (bot, chatId) => {
            const stream = fs.createReadStream('src/public/gif/relax.gif');
            await bot.sendAnimation(chatId,stream,{} ,fileOptions)
        }
    },
    {
        "time": "0 12 * * *",
        "message": "Tuấn Phan ăn trưa ngon miệng nhé :))",
        handle: async (bot, chatId) => {
            const stream = fs.createReadStream('src/public/gif/lunch.gif');
            await bot.sendAnimation(chatId,stream,{} ,fileOptions)
        }
    }
], fileOptions}