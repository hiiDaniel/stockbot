const discord = require('discord.js');
const axios = require('axios');

module.exports.run = async (bot, message, args) => {

    let mention = message.mentions.members.first();

    let insultData = async ()  => {
        let url = await axios.get('https://evilinsult.com/generate_insult.php?lang=en&type=json'); //insult data
        let getInsult = url.data;

        return {
            getInsult
        };
    }

    let insultInfo = await insultData();

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
        return message.channel.send(`Do you want me to insult you ${message.author}?! Format that shit correctly next time!` || "N/A");
    }
    else if (user) {

        return message.channel.send(`${user} ` + insultInfo.getInsult.insult).then(function(messageSent) {
            messageSent.react('🖕').catch(() => console.error('emoji failed to react.'));
        });
    }
};

module.exports.help = {
    name: "insult"
};
