require('dotenv').config();

const tmi = require('tmi.js');

const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);

const commands = {
  so: {
    response: (user) => `Check out ${user} who is an awesome streamer!!! Visit their channel, https://twitch.tv/${user}`
  },
  shoutout: {
    response: (user) => `Check out ${user} who is an awesome streamer!!! Visit their channel, https://twitch.tv/${user}`
  }
}

const client = new tmi.Client({
  connection: {
    reconnect: true
  },
  channels: [
    '103ghostreptile'
    ],
    identity: {
      username: process.env.TWITCH_BOT_USERNAME,
      password: process.env.TWITCH_OAUTH_TOKEN
  }
});

client.connect();

client.on('message', (channel, tags, message, self) => {
  const isNotBot = tags.username.toLowerCase() !== process.env.TWITCH_BOT_USERNAME;

  if (!isNotBot) return;

  const [raw, command, argument] = message.match(regexpCommand);

  const { response } = commands[command] || {};

  if (typeof response === 'function') {
    client.say(channel, response(argument));
  }
  
});