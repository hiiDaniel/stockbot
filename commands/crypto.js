const discord = require('discord.js');
const axios = require('axios');

module.exports.run = async (bot, message, args) => {

    let baseURL = 'https://data.messari.io/api/v1/assets/';

    if (!args.length) {
        return message.channel.send(`You didn't provide a crypto symbol, ${message.author}!`);
    }
    else if (args.length) {

        let getData = async () => {
            let url = await axios.get(baseURL + args + '/metrics'); //crypto data
            let cryptoInfo = url.data;

            return {
                cryptoInfo
            };            
        }

        let cryptoData = await getData();
        let cryptoAtt = cryptoData.cryptoInfo.data;

        message.channel.send( {
            embed: {
                color: 0xebc11a ,
                title: cryptoAtt.name + ' (' + cryptoAtt.symbol + ')',
                fields:[
                    {
                    name: "Price",
                    value:  `$ ${cryptoAtt.market_data.price_usd.toFixed(6).toLocaleString()}`|| "N/A",
                    inline: true
                    },
                    {
                    name: "\u200B",
                    value: "\u200B",
                    inline: true
                    },
                    {
                    name: "24h Change",
                    value:  `${cryptoAtt.market_data.percent_change_usd_last_24_hours.toFixed(2)}%`|| "N/A",
                    inline: true
                    }
                ],
                timestamp: new Date()

            }}).then(async getChange => {
            if (cryptoAtt.market_data.percent_change_usd_last_24_hours > 0) {
                await getChange.react('📈');
            }
            else {
                await getChange.react('📉');
            }
        });
    }

};

module.exports.help = {
    name: "crypto"
};