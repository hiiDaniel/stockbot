const discord = require('discord.js');
const axios = require('axios');
const moment = require("moment");

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

        function formatCourseDate() {
            let d = moment(cryptoAtt.all_time_high.at).calendar();
            return d;
        }

        function ifNull(n) {
            let i = n;
            if (i == null){
                return "no value";
            }
            return i.toFixed(2);
        }

        message.channel.send( {
            embed: {
                color: 0xebc11a ,
                title: cryptoAtt.name + ` (${cryptoAtt.symbol})`,
                fields:[
                    {
                    name: "Price",
                    value:  `$${cryptoAtt.market_data.price_usd.toLocaleString('en-US',{minimumFractionDigits: 4})}`,
                    inline: true
                    },
                    {
                    name: "\u200B",
                    value: "\u200B",
                    inline: true
                    },
                    {
                    name: "24h Change",
                    value: `${(cryptoAtt.market_data.percent_change_usd_last_24_hours).toFixed(2)}%`,
                    inline: true
                    },
                    {
                    name: "24h Low",
                    value: `$${cryptoAtt.market_data.ohlcv_last_24_hour.low.toLocaleString('en-US',{minimumFractionDigits: 4})}`,
                    inline: true
                    },
                    {
                    name: "\u200B",
                    value: "\u200B",
                    inline: true
                    },
                    {
                    name: "24h High",
                    value: `$${cryptoAtt.market_data.ohlcv_last_24_hour.high.toLocaleString('en-US',{minimumFractionDigits: 4})}`,
                    inline: true
                    },
                    {
                    name: "Market Dominance",
                    value: `${cryptoAtt.marketcap.marketcap_dominance_percent.toFixed(2)}%`,
                    inline: true
                    },
                    {
                    name: "\u200B",
                    value: "\u200B",
                    inline: true
                    },
                    {
                    name: "Annual Inflation",
                    value: ifNull(cryptoAtt.supply.annual_inflation_percent),
                    inline: true
                    },
                    {
                    name: "ROI Wk / Mo / Yr",
                    value: `${cryptoAtt.roi_data.percent_change_last_1_week.toFixed(2)}% / ${cryptoAtt.roi_data.percent_change_last_1_month.toFixed(2)}% / ${cryptoAtt.roi_data.percent_change_last_1_year.toFixed(2)}%`,
                    inline: false
                    },
                    {
                    name: "All Time High",
                    value: formatCourseDate(),
                    inline: false
                    },
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

// "\u200B"