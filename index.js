const TelegramBot = require('node-telegram-bot-api');

const mysql = require('mysql');

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "maboybot",
    password: "root"
});
conn.connect(err => {
    if (err) {
        console.log(err);
        return err;
    } else {
        console.log('Ok');
    }
});

let query = "SELECT * FROM users";

const TOKEN = '1646449557:AAHKH_AwQbV5VhoBvj60XhJaey-okBo3YE0';

console.log('bot work')

const bot = new TelegramBot(TOKEN, {
    polling: true,
})

bot.onText(/\/start/, (msg) => {
    const id = msg.chat.id;
    console.log(msg)
    if (msg.chat.id === msg.from.id) {
        bot.sendMessage(id, `@${msg.from.username}, здоров єбать. Готовий розпочати? Тоді не їблуй і перекидай мене в групу!`, {
            reply_to_message_id: msg.message_id,
        });
    } else {
        bot.sendMessage(id, `@${msg.from.username}, шо це за хуйня. Я такої дири ще не бачив! Короче похуй. Вибирай команду і поїбашили!`, {
            reply_to_message_id: msg.message_id,
        });
    }
})

bot.onText(/\/login/, (msg) => {
    let userID = msg.from.id;
    let groupID = msg.chat.id;
    let userNick = msg.from.username;
    let firstName = msg.from.first_name;
    conn.query(query, (err, result, msg) => {
        console.log(err);
        for (let i = 0; i < result.length; i++) {
            let counter = i + 1;
            if (result[i]['id_player'] == userID && result[i]['group_id'] == groupID) {
                bot.sendMessage(groupID, `@${userNick}, ти уже в ігрі. Не вийобуйся!`, {
                    reply_to_message_id: msg.message_id,
                });
            } else {
                if (counter == result.length) {
                    conn.query(`INSERT INTO users (id, id_player, name_player, username, play_date, length, group_id)
                                VALUES ( ${counter}, ${userID}, "${firstName}", "${userNick}", "0", 0, ${groupID})`, (err, result) => {
                        console.log(err);
                        console.log(result);
                    });
                    bot.sendMessage(groupID, `@${userNick}, ти зареєструвався! Настав час дізнатись, чи є в тебе пісюн. Скористайся командую /dick`, {
                        reply_to_message_id: msg.message_id,
                    });
                }
            }
        }
    });
});

bot.onText(/\/stop/, (msg) => {
    const id = msg.chat.id;
    bot.sendMessage(id, `@${msg.from.username}, пока єбать. Нахуй ти мене викликав? Тобі пезда! Уйобуй поки можеш!`, {
        reply_to_message_id: msg.message_id,
    });
});

bot.onText(/\/dick/, (msg) => {
    let userID = msg.from.id;
    let groupID = msg.chat.id;
    let playedTime = msg.date;
    conn.query(query, (err, result) => {
        console.log(err);
        for (let i = 0; i < result.length; i++) {
            let counter = i + 1;
            if (result[i]['id_player'] == userID && result[i]['group_id'] == groupID && playedTime - result[i]['play_date'] >= '86400') {
                let startLength = result[i]['length'];
                let endLength;
                let plus = Math.floor(Math.random() * (17 - 1 + 1)) + 1;
                if (plus <= 7) {
                    endLength = startLength - plus;
                    if (endLength < 0 && startLength < 0) {
                        bot.sendMessage(groupID, `@${msg.from.username}, твоя піхва розширилась на ${plus} см. Тепер її глибина ${endLength} см. `, {
                            reply_to_message_id: msg.message_id,
                        });
                    } else if (endLength <= 0 && startLength > 0) {
                        bot.sendMessage(groupID, `@${msg.from.username}, твоя песюн скоротився на ${plus} см. Тепер у тебе піхва! ЇЇ глибина ${endLength} см. `, {
                            reply_to_message_id: msg.message_id,
                        });
                    } else if (endLength < 0 && startLength < endLength) {
                        bot.sendMessage(groupID, `@${msg.from.username}, твоя піхва зменшилась на ${plus} см. Тепер її глибина ${endLength} см. `, {
                            reply_to_message_id: msg.message_id,
                        });
                    } else {
                        bot.sendMessage(groupID, `@${msg.from.username}, твій песюн скоротився на ${plus} см. Тепер його довжина ${endLength} см. `, {
                            reply_to_message_id: msg.message_id,
                        });
                    }
                } else {
                    plus -= 10;
                    endLength = startLength + plus;
                    if (endLength > 0 && startLength < 0) {
                        bot.sendMessage(groupID, `@${msg.from.username}, твоя піхва зменшилась на ${plus} см. Тепер у тебе пісюн. Його довжина ${endLength} см. `, {
                            reply_to_message_id: msg.message_id,
                        });
                    }
                    else if ( endLength < 0 && startLength < 0 ){
                        bot.sendMessage(groupID, `@${msg.from.username}, твоя піхва зменшилась на ${plus} см. Тепер її глибина ${endLength} см. `, {
                            reply_to_message_id: msg.message_id,
                        });
                    }
                    else {
                        bot.sendMessage(groupID, `@${msg.from.username}, твій песюн виріс на ${plus} см. Тепер його довжина ${endLength} см. `, {
                            reply_to_message_id: msg.message_id,
                        });
                    }
                }
                conn.query(`UPDATE users SET length = ${endLength}, play_date = ${playedTime} WHERE id_player = ${userID} AND group_id = ${groupID}`, (err, result) => {
                    console.log(err);
                    console.log(result);
                })
            }
            else if (result[i]['id_player'] == userID && result[i]['group_id'] == groupID && playedTime - result[i]['play_date'] < '86400') {
                bot.sendMessage(groupID, `Чоловіче, не рви кіньми. Ще не прийшов час!`, {
                    reply_to_message_id: msg.message_id,
                });
            }
            else {
                if (counter == result.length) {
                    bot.sendMessage(groupID, `@${msg.from.username}, зареєструйся, бегом!!!`, {
                        reply_to_message_id: msg.message_id,
                    });
                }
            }
        }
    });
});
bot.onText(/\/ranking/, (msg) => {
    let groupID = msg.chat.id;
    conn.query(query, (err, result) => {
        console.log(err);
        let rankSet = new Set;
        for (let i = 0; i < result.length; i++) {
            if (result[i]['group_id'] == groupID) {
                let user = {name: result[i]['name_player'], length: result[i]['length']}
                rankSet.add(user);
            }
        }
        let rankArr = Array.from(rankSet);
        rankArr.sort(function (a, b) {
            if (a.length < b.length) {
                return 1;
            }
            if (a.length > b.length) {
                return -1;
            }
            return 0;
        });
        const html = `Рейтинг гравців \n \n` + rankArr.map((f, i) => {
            return `<b>${i + 1}.</b> ${f.name} — ${f.length}см`;
        }).join('\n');

        bot.sendMessage(groupID, html, {
            parse_mode: 'HTML',
            reply_to_message_id: msg.message_id,
        });
    });
});
