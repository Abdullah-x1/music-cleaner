const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const { handleMessageDelete } = require('./src/cleaner');
const { handleCommand } = require('./src/commands');
const { initDistube } = require('./src/player');

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
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers
  ]
});

client.on('clientReady', () => {
  console.log(`Logged in as ${client.user.tag}`);
  initDistube(client, config);
});

// Handle messages
client.on('messageCreate', async (message) => {
  if (!config.channels.includes(message.channel.id)) return;
  if (message.author.id === client.user.id) return;

  if (!message.author.bot) {
    await handleCommand(message, config);
  }

  await handleMessageDelete(message, config);
});

client.login(config.token);
