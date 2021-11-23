const discord = require("discord.js");
const axios = require("axios");
const moment = require("moment");
const urlExists = require("url-exists-deep");
const { MessageEmbed } = require("discord.js");

//TODO:
// 1. Add logging
// 2. Clean layout of message.channel.send

module.exports.run = async (bot, message, args) => {
  let apiURL = `https://data.messari.io/api/v1/assets/${args}/metrics`;
  //https://data.messari.io/api/v2/assets/eth/profile
  let exists = await urlExists(apiURL);

  axios
    .get(apiURL)
    .then(function (response) {
      if (response) {
        let cryptoInfo = response.data;

        let coin_data = cryptoInfo.data;
        let market_data = coin_data.market_data;
        let marketcap = coin_data.marketcap;
        let supply = coin_data.supply;
        //let blockchain_stats_24_hours = coin_data.blockchain_stats_24_hours;
        let market_data_liquidity = coin_data.market_data_liquidity;
        let all_time_high = coin_data.all_time_high;
        let cycle_low = coin_data.cycle_low;
        //token_sale_stats
        //staking_stats
        //mining_stats
        //developer_activity
        let roi_data = coin_data.roi_data;
        //let roi_by_year = coin_data.roi_by_year;
        //let risk_metric = coin_data.risk_metric;

        //conditional currency formatting
        function curr(num) {
          if (num) {
            let s = String(num);
            let p = num.toFixed(2).split("."); //88.88
            let g = num.toFixed(6).split("."); //0.888888

            if (!s.startsWith("0.")) {
              return (
                "$" +
                p[0]
                  .split("")
                  .reverse()
                  .reduce(function (acc, num, i, orig) {
                    return num == "-"
                      ? acc
                      : num + (i && !(i % 3) ? "," : "") + acc;
                  }, "") +
                "." +
                p[1]
              );
            } else {
              return (
                "$" +
                g[0]
                  .split("")
                  .reverse()
                  .reduce(function (acc, num, i, orig) {
                    return num == "-"
                      ? acc
                      : num + (i && !(i % 3) ? "," : "") + acc;
                  }, "") +
                "." +
                g[1]
              );
            }
          } else {
            return "- ";
          }
        }

        //number formatting
        function nmbrs(x) {
          if (x) {
            let s = x
              .toFixed(2)
              .toString()
              .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

            return `${s}`;
          } else {
            return "- ";
          }
        }

        //date format
        function date(t) {
          if (t) {
            let f = moment(t).format("LL"); //November 11, 2021
            return f;
          }
          return "- ";
        }

        //time format
        function time(t) {
          if (t) {
            let d = moment(t).startOf("day").fromNow(); //25 min ago
            return d;
          } else {
            return "-";
          }
        }

        //tick arrows
        function arrws(a) {
          if (a) {
            let t = ((a * 100) / 100).toFixed(2); //only two decimals
            let c = Math.sign(t); //determines pos or neg
            let p = -t; //turns neg to pos

            let uArrw = "<:up_tick:908194638807044106>";
            let dArrw = "<:down_tick:908194638769319996>";

            switch (c) {
              case (c = 1):
                return `${uArrw} ${t}%`;
                break;

              case (c = 0):
                return `${t}%`;
                break;

              case (c = -1):
                return `${dArrw} ${p}%`;
                break;

              default:
                console.log(
                  `==> There was an error. The value of ${c} was outside of -1 to 1`
                );
            }
          } else {
            return "- ";
          }
        }

        if (!args.length) {
          message.channel.send(
            `Forgetting something, ${message.author}? \nAdd the crypto symbol after after the command. (e.g., !crypto {symbol})`
          );
          console.log(
            `==> ${message.member.user.tag} tried to summom the !crypto command but did not provide a symbol.`
          );
        } else
          console.log(
            `==> ${message.member.user.tag} used the !crypto command alongside the '${args}' symbol`
          );

        //add function for when there isn't enough data to create an embed

        if (!coin_data.symbol) {
          console.log(
            `==> Error: '${args}' doesn't have a symbol or enough data to create an embed. Invalidating request.`
          );
          message.channel
            .send(
              `${message.author}, **'${args}'** appears in the API but doesn't have enough information to create an embed. Market data is untracked.`
            )
            .then((msg) => {
              msg.react("🛠");
            })
            .catch((error) =>
              console.error("==> One of the emojis failed to react:", error)
            );
        } else {
          const embed = new MessageEmbed()
            .setTitle(`${coin_data.name} (${coin_data.symbol})`)
            .setURL(`https://coinmarketcap.com/currencies/${coin_data.slug}`)
            .setColor("#ffd478")
            //.setImage("https://share.chartiq.com/KVU4AGLT4D.png")

            .addField("Price", curr(market_data.price_usd), true)
            .addField(
              "24h %",
              arrws(market_data.percent_change_usd_last_24_hours),
              true
            )
            .addField("7d %", arrws(roi_data.percent_change_last_1_week), true)

            //line break
            .addField("\u200b", "\u200b", false)

            //line break
            .addField("Market Cap", curr(marketcap.current_marketcap_usd), true)
            .addField("\u200b", "\u200b", true)
            .addField(
              "Circulating Supply",
              `${nmbrs(supply.circulating)} ${coin_data.symbol}`,
              true
            )

            //line break
            .addField(
              "Volume (24h)",
              curr(market_data.real_volume_last_24_hours),
              true
            )
            .addField("\u200b", "\u200b", true)
            .addField(
              "Dominance",
              `${nmbrs(marketcap.marketcap_dominance_percent)}%`,
              true
            )

            //line break
            .addField(
              "24h Low",
              `${curr(market_data.ohlcv_last_24_hour.low)}`,
              true
            )
            .addField("\u200b", "\u200b", true)
            .addField(
              "24h High",
              `${curr(market_data.ohlcv_last_24_hour.high)}`,
              true
            )

            //line break
            .addField(
              "ROI Week / Month / Year",
              `${nmbrs(roi_data.percent_change_last_1_week)}% / ${nmbrs(
                roi_data.percent_change_last_1_month
              )}% / ${nmbrs(roi_data.percent_change_last_1_year)}%`,
              true
            )
            .addField("\u200b", "\u200b", true)
            .addField("Rank", `${marketcap.rank}`, true)

            //linebreak
            .addField(
              "﹉﹉﹉﹉﹉﹉﹉﹉﹉﹉﹉﹉﹉﹉﹉﹉﹉﹉﹉﹉﹉﹉﹉﹉﹉﹉﹉﹉",
              `**All Time High** \nWas on __${date(all_time_high.at)}__ (${time(
                all_time_high.at
              )}) and it was **${curr(
                all_time_high.price
              )}** \n\n**All Time Low** \nWas on __${date(
                cycle_low.at
              )}__ (${time(cycle_low.at)}) and it was **${curr(
                cycle_low.price
              )}**\n﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍`,
              false
            );

          message.channel
            .send({ embed })

            .then(async (getChange) => {
              if (market_data.percent_change_usd_last_24_hours > 0) {
                await getChange
                  .react("📈")
                  .catch((error) =>
                    console.error(
                      "==> One of the emojis failed to react:",
                      error
                    )
                  );
              } else {
                await getChange
                  .react("📉")
                  .catch((error) =>
                    console.error(
                      "==> One of the emojis failed to react:",
                      error
                    )
                  );
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      } else {
        message.channel
          .send(
            `We are soo sorry, ${message.author}! \nThe API seems to be having trouble and didn't respond. Please try again later.`
          )
          .then((msg) => {
            msg.react("😭");
          })
          .catch((error) =>
            console.error("==> One of the emojis failed to react:", error)
          );
        console.log("==> Error: There was no response from the API");
      }
    })
    .catch(function (error) {
      if (!exists) {
        console.log(
          `==> ${message.member.user.tag} tried to search for '${args}' and its a invalid or not supported symbol.`
        );
        console.log(
          `==> Error: ${error.response.status} ${error.response.statusText} and connection was ${error.response.headers.connection}d`
        );
        message.channel
          .send(
            `${message.author}, **'${args}'** is a not a valid or supported symbol. \nPlease check spelling and try again.`
          )
          .then((msg) => {
            msg.react("🙈");
          })
          .catch((error) =>
            console.error("==> One of the emojis failed to react:", error)
          );
      }
    });
};

module.exports.help = {
  //name: "c",
  name: "crypto",
};
