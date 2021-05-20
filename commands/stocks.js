const discord = require('discord.js');
const axios = require('axios');
const config = require('../config.js')

module.exports.run = async (bot, message, args) => {

    let baseURL = 'https://cloud.iexapis.com/stable/stock/';
    let token = config.stock_token;

        if (!args.length) {
            return message.channel.send(`You didn't provide a stock symbol, ${message.author}!`);
        }
        else if (args.length) {

            let getCompany = async () => {
                let stockCompany = await axios.get(baseURL + args + '/batch?types=company,quote,book,logo,stats,news,chart&range=1m&last=1&token=' + token); //company data
                let companyInfo = stockCompany.data;

                return {
                    companyInfo
                };
            }

            function newsLinkSummary(n) {

                let i = stockInfo.companyInfo.news;
                if (stockInfo.companyInfo.news.length > 0){
                    return "no summary available";
                }
                return i[0].summary.substring(0, 200) + "...";
            }

            let stockInfo = await getCompany();
            let newsLink = newsLinkSummary(stockInfo.companyInfo.news[0].summary);

            message.channel.send( {
                embed: {
                    color: 0x0de5de,
                    title: stockInfo.companyInfo.company.companyName + ' (' + stockInfo.companyInfo.company.symbol + ')',
                    url: stockInfo.companyInfo.company.website,
                    description: stockInfo.companyInfo.company.description,
                    thumbnail: {
                        url: stockInfo.companyInfo.logo.url
                    },
                    fields:[
                        {
                        name: "$" + stockInfo.companyInfo.quote.latestPrice || "N/A",
                        value: stockInfo.companyInfo.quote.change + " (" + (stockInfo.companyInfo.quote.changePercent * 100).toFixed(2) + "%)" || "N/A",
                        inline: false
                        },
                        {
                        name: "\u200B",
                        value: "\u200B",
                        inline: false
                        },
                        {
                        name: "Exchange",
                        value: stockInfo.companyInfo.company.exchange || "N/A",
                        inline: true
                        },
                        {
                        name: "\u200B",
                        value: "\u200B",
                        inline: true
                        },
                        {
                        name: "Market Cap",
                        value: (stockInfo.companyInfo.quote.marketCap).toLocaleString('en') || "N/A",
                        inline: true
                        },
                        {
                        name: "Sector",
                        value: stockInfo.companyInfo.company.sector || "N/A",
                        inline: true
                        },
                        {
                        name: "\u200B",
                        value: "\u200B",
                        inline: true
                        },
                        {
                        name: "P/E Ratio",
                        value: stockInfo.companyInfo.quote.peRatio || "N/A",
                        inline: true
                        },
                        {
                        name: "Industry",
                        value: stockInfo.companyInfo.company.industry || "N/A",
                        inline: true
                        },
                        {
                        name: "\u200B",
                        value: "\u200B",
                        inline: true
                        },
                        {
                        name: "Earnings Per Share (EPS)",
                        value: "$" + stockInfo.companyInfo.stats.ttmEPS || "N/A",
                        inline: true
                        },
                        {
                        name: "Today's High/Low",
                        value: "$" + stockInfo.companyInfo.chart[0].high + " / " + "$" + stockInfo.companyInfo.chart[0].low || "N/A",
                        inline: true
                        },
                        {
                        name: "\u200B",
                        value: "\u200B",
                        inline: true
                        },
                        {
                        name: "Annualized Dividend",
                        value: "$" + (stockInfo.companyInfo.stats.ttmDividendRate).toFixed(2) || "N/A",
                        inline: true
                        },
                        {
                        name: "Share Volume",
                        value: (stockInfo.companyInfo.chart[0].volume).toLocaleString('en') || "N/A",
                        inline: true
                        },
                        {
                        name: "\u200B",
                        value: "\u200B",
                        inline: true
                        },
                        {
                        name: "Ex Dividend Date",
                        value: stockInfo.companyInfo.stats.exDividendDate || "N/A",
                        inline: true
                        },
                        {
                        name: "Average Volume",
                        value: (stockInfo.companyInfo.quote.avgTotalVolume).toLocaleString('en') || "N/A",
                        inline: true
                        },
                        {
                        name: "\u200B",
                        value: "\u200B",
                        inline: true
                        },
                        {
                        name: "Previous Close",
                        value: "$" + stockInfo.companyInfo.quote.previousClose || "N/A",
                        inline: true
                        },
                        {
                        name: "Current Yield",
                        value: (stockInfo.companyInfo.stats.dividendYield * 100).toFixed(2) + "%" || "N/A",
                        inline: true
                        },
                        {
                        name: "\u200B",
                        value: "\u200B",
                        inline: true
                        },
                        {
                        name: "52 Week High/Low",
                        value: "$" + stockInfo.companyInfo.stats.week52high + " / " + "$" + stockInfo.companyInfo.stats.week52low || "N/A",
                        inline: true
                        },
                        {
                        name: "\u200B",
                        value: "\u200B",
                        inline: false
                        },
                        {
                        name: stockInfo.companyInfo.news[0].headline || "N/A",
                        value: `${newsLink} [read more](${stockInfo.companyInfo.news[0].url})`,
                        inline: false
                        }
                    ],
                    timestamp: new Date()

            }}).then(async getChange => {
                if (stockInfo.companyInfo.quote.change > 0) {
                    await getChange.react('📈');
                }
                else {
                    await getChange.react('📉');
                }
            });
        }
};

module.exports.help = {
    name: "stock"
};
