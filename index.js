const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

let config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

setInterval(() => {
  try {
    const newConfig = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
    if (JSON.stringify(newConfig) !== JSON.stringify(config)) {
      config = newConfig;
      console.log('Config reloaded!');
    }
  } catch (e) {}
}, 2000);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions
  ]
});

client.on('clientReady', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (!config.channels.includes(message.channel.id)) return;
  if (message.author.id === client.user.id) return;

  const delay = message.author.bot ? config.botMessageDelay : config.deleteDelay;

  setTimeout(async () => {
    try {
      const msg = await message.channel.messages.fetch(message.id);
      const reaction = msg.reactions.cache.get(config.pinEmoji);
      if (reaction) {
        const users = await reaction.users.fetch();
        if (config.owners.some(id => users.has(id))) return;
      }
      await msg.delete();
    } catch (e) {}
  }, delay);
});
// Keep Render happy
const http = require('http');
http.createServer((req, res) => res.end('Bot is running!')).listen(process.env.PORT || 3000);

client.login(process.env.TOKEN || config.token);
