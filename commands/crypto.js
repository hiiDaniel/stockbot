const discord = require('discord.js-commando');
const axios = require('axios');
const moment = require("moment");

module.exports = class cryptoCommand extends discord.Command {
    constructor(client){
        super (client, {
            name: 'crypto',
            group: 'commands',
            memberName: 'bot',
            description: 'Displays crypto information',
        })
    }
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

module.exports.help = {
    name: "crypto"
};