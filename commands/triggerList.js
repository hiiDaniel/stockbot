const discord = require('discord.js');

module.exports.run = async (bot, message, args) => {

    message.channel.send( {
        embed: {
            color: 0xc90886,
            fields:[
                {
                name: "Stocks",
                value: "!stock {Symbol}",
                inline: true
                },
                {
                name: '\u200B',
                value: '\u200B',
                inline: true
                },
                {
                name: "Cryptocurrencies",
                value: "!crypto {Symbol}",
                inline: true
                },
                {
                name: "Insult",
                value: "!insult @mention",
                inline: true
                },
                {
                name: '\u200B',
                value: '\u200B',
                inline: true
                },
                {
                name: "compliment",
                value: "!compliment @mention",
                inline: true
                },
                {
                name: "health",
                value: "!health",
                inline: true
                }
                ]
            }})

};

module.exports.help = {
    name: "triggers"
};
