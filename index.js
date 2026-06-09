const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const MUSIC_CHANNEL_ID = '1513979423634886827';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  // Ignore bot messages
  if (message.author.bot) return;

  // Only delete messages in the music channel
  if (message.channel.id === MUSIC_CHANNEL_ID) {
    await message.delete().catch(console.error);
  }
});

client.login(process.env.TOKEN);
