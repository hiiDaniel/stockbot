const discord = require('discord.js');
const axios = require('axios');
const moment = require("moment");

//TODO:
// 1. Add logging
// 2. Clean layout of message.channel.send

module.exports.run = async (args) => {
    try {
        const response = await axios.get(`https://data.messari.io/api/v1/assets/${args}/metrics`);
        console.log(response);
    }
    catch (error) {
        console.error(error);
    }
}

module.exports.help = {
    name: "crypto"
};