const discord = require('discord.js');
const axios = require('axios');

module.exports.run = async (bot, message, args) => {

    let mention = message.mentions.members.first();

    let complimentData = async ()  => {
        let url = await axios.get('https://complimentr.com/api'); //compliment data
        let getCompliment = url.data;

        return {
            getCompliment
        };
    }

    let complimentInfo = await complimentData();

    //get mention
    function getUserFromMention(mention){
        if (!mention) return;

        if (mention.startsWith('<@') && mention.endsWith('>')) {
            mention = mention.slice(2, -1);

            if (mention.startsWith ('!')) {
                mention = mention.slice(1);
            }

            return bot.users.cache.get(mention);
        }
    }

    const user = getUserFromMention(args[0]);
    
    if (!user) {
        return message.channel.send(`Nice of you to want to compliment someone, ${message.author}! try again by adding their @name` || "N/A");
    }
    else if (user) {

        return message.channel.send(`${user} ` + complimentInfo.getCompliment.compliment).then(function(messageSent) {
            messageSent.react('🤗').catch(() => console.error('emoji failed to react.'));
        });
    }
};

module.exports.help = {
    name: "compliment"
};
