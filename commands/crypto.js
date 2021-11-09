const discord = require('discord.js');
const axios = require('axios');
const moment = require("moment");

module.exports = {
    name:'crypto',
    category: 'commands',
    description: 'Displays crypto information',
}


run = async (message, args) => {
    axios.get('https://data.messari.io/api/v1/assets/')
        .then((res) => {
            console.log('RES:', res)
        })
        .catch((err) => {
            console.error('ERR:', err)
        })
}

//module.exports.help = {
//    name: "crypto"
//};