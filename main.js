const Discord = require("discord.js");
const config = require("./config.js");
const bot = new Discord.Client({ disableEveryone: true });
const fs = require("fs");

bot.commands = new Discord.Collection();

//when bot ready
bot.on("ready", async () => {
  console.log(`${bot.user.username} is ready for action!`);
  bot.user.setActivity("for '!triggers' commands", { type: "WATCHING" });
});

//load commands
bot.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
  if (err) console.error(err);
  let commandFiles = files.filter((f) => f.split(".").pop() === "js");

  if (commandFiles.length <= 0) return console.log("No commands to load...");

  console.log(`Loading ${commandFiles.length} commands...`);
  commandFiles.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`${i + 1}: ${f} loaded!`);
    bot.commands.set(props.help.name, props);
  });
});

//message event
bot.on("message", async (message) => {
  if (message.author.bot) return;
  if (message.channel.type == "dm") return;

  let prefix = config.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0].toLowerCase();
  let args = messageArray.slice(1);

  if (!message.content.startsWith(prefix)) return;

  let msg = bot.commands.get(cmd.slice(prefix.length));
  if (msg) msg.run(bot, message, args);
});

//diagnose API errors

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});

bot.login(config.bot_token);
