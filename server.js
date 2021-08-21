require('dotenv').config();

const tmi = require('tmi.js');

const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);

function shoutout(shoutoutUser, user, channel) {
  let isMod = user.mod || user['user-type'] === 'mod';
  let isBroadcaster = channel.slice(1) === user.username;
  let isModUp = isMod || isBroadcaster;

  if (isModUp)
    return `Check out ${shoutoutUser} who is an awesome streamer!!! Visit their channel, https://twitch.tv/${shoutoutUser}`
}

const commands = {
  so: {
    response: (shoutoutUser, user, channel) => shoutout(shoutoutUser, user, channel)
  },
  shoutout: {
    response: (shoutoutUser, user, channel) => shoutout(shoutoutUser, user, channel)
  }
}

const client = new tmi.Client({
  connection: {
    reconnect: true
  },
  channels: [
    process.env.TWITCH_CHANNEL
    ],
    identity: {
      username: process.env.TWITCH_BOT_USERNAME,
      password: process.env.TWITCH_OAUTH_TOKEN
  }
});

client.connect();

client.on('message', (channel, user, message, self) => {
  const isNotBot = user.username.toLowerCase() !== process.env.TWITCH_BOT_USERNAME;

  if (!isNotBot) return;

  const [raw, command, argument] = message.match(regexpCommand);

  const { response } = commands[command] || {};

  if (typeof response === 'function') {
    client.say(channel, response(argument, user, channel));
  }
  
});