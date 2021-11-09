const discord = require('discord.js');
const axios = require('axios');

module.exports.run = async (bot, message, args) => {
    return message.channel.send('All systems are go!')
};

module.exports.help = {
    name: "reminder"
};
